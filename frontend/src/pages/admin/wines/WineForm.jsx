import { useEffect, useState } from "react";

import {
  attachGrapesToWine,
  createWine,
  getCreatedWineId,
  getImageUrl,
  syncWineGrapes,
  updateWine,
  uploadWineImage,
} from "./wine.service";

import { Actions, Card, Form, Full, Message, Preview } from "./wine.styles";

const initialForm = {
  name: "",
  producer: "",
  style_id: "",
  country_code: "",
  region: "",
  vintage: "",
  alcohol_content: "",
  serving_temperature: "",
  short_description: "",
  description: "",
  tasting_notes: "",
  pairing: "",
  search_keywords: "",
};

function emptyToNull(value) {
  if (value === undefined || value === null) return null;

  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

function toFormValue(value) {
  if (value === undefined || value === null) return "";
  return String(value);
}

function buildInitialFormFromWine(wine) {
  if (!wine) return initialForm;

  return {
    name: toFormValue(wine.name),
    producer: toFormValue(wine.producer),
    style_id: toFormValue(wine.style_id),
    country_code: toFormValue(wine.country_code),
    region: toFormValue(wine.region),
    vintage: toFormValue(wine.vintage),
    alcohol_content: toFormValue(wine.alcohol_content),
    serving_temperature: toFormValue(wine.serving_temperature),
    short_description: toFormValue(wine.short_description),
    description: toFormValue(wine.description),
    tasting_notes: toFormValue(wine.tasting_notes),
    pairing: toFormValue(wine.pairing),
    search_keywords: toFormValue(wine.search_keywords),
  };
}

export function WineForm({
  wineStyles = [],
  countries = [],
  grapes = [],
  editingWine = null,
  editingGrapeIds = [],
  onCreated,
  onUpdated,
  onCancelEdit,
}) {
  const isEditing = Boolean(editingWine?.id);

  const [form, setForm] = useState(initialForm);
  const [selectedGrapes, setSelectedGrapes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editingWine) {
      resetForm();
      return;
    }

    setForm(buildInitialFormFromWine(editingWine));
    setSelectedGrapes((Array.isArray(editingGrapeIds) ? editingGrapeIds : []).map(String));
    setImageFile(null);
    setImagePreview(editingWine.image_url ? getImageUrl(editingWine.image_url) : "");
    setMessage("");
  }, [editingWine, editingGrapeIds]);

  function handleChange(event) {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  }

  function handleGrapeChange(event) {
    const values = Array.from(event.target.selectedOptions).map(
      (option) => option.value,
    );

    setSelectedGrapes(values);
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setForm(initialForm);
    setSelectedGrapes([]);
    setImageFile(null);
    setImagePreview("");
  }

  function handleCancelEdit() {
    resetForm();
    setMessage("");
    onCancelEdit?.();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const uploadedImageUrl = await uploadWineImage(imageFile);

      const payload = {
        name: form.name.trim(),
        producer: form.producer.trim(),
        style_id: Number(form.style_id),
        country_code: form.country_code,
        region: emptyToNull(form.region),
        vintage: emptyToNull(form.vintage),
        alcohol_content: form.alcohol_content
          ? Number(form.alcohol_content)
          : null,
        serving_temperature: emptyToNull(form.serving_temperature),
        image_url: uploadedImageUrl || editingWine?.image_url || null,
        thumbnail_url: editingWine?.thumbnail_url || null,
        short_description: emptyToNull(form.short_description),
        description: emptyToNull(form.description),
        tasting_notes: emptyToNull(form.tasting_notes),
        pairing: emptyToNull(form.pairing),
        search_keywords: emptyToNull(form.search_keywords),
      };

      if (isEditing) {
        await updateWine(editingWine.id, payload);
        await syncWineGrapes(editingWine.id, selectedGrapes);

        resetForm();
        setMessage("Vinho atualizado com sucesso.");
        onUpdated?.();
        return;
      }

      const createdWine = await createWine(payload);
      const wineId = getCreatedWineId(createdWine);

      if (!wineId) {
        throw new Error("Vinho criado, mas o backend não retornou o ID.");
      }

      await attachGrapesToWine(wineId, selectedGrapes);

      resetForm();
      setMessage("Vinho cadastrado com sucesso.");
      onCreated?.();
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        (isEditing ? "Erro ao atualizar vinho." : "Erro ao cadastrar vinho.");

      setMessage(apiMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2>{isEditing ? "Editar Vinho" : "Novo Vinho"}</h2>

      <Form onSubmit={handleSubmit}>
        {message && <Message>{message}</Message>}

        <input
          name="name"
          placeholder="Nome do vinho"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="producer"
          placeholder="Produtor"
          value={form.producer}
          onChange={handleChange}
          required
        />

        <select
          name="style_id"
          value={form.style_id}
          onChange={handleChange}
          required
        >
          <option value="">Selecione o estilo</option>
          {(Array.isArray(wineStyles) ? wineStyles : []).map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </select>

        <select
          name="country_code"
          value={form.country_code}
          onChange={handleChange}
          required
        >
          <option value="">Selecione o país</option>
          {(Array.isArray(countries) ? countries : []).map((country) => {
            const code = country.code || country.country_code;

            return (
              <option key={code} value={code}>
                {country.name}
              </option>
            );
          })}
        </select>

        <input
          name="region"
          placeholder="Região"
          value={form.region}
          onChange={handleChange}
        />

        <input
          name="vintage"
          placeholder="Safra"
          value={form.vintage}
          onChange={handleChange}
        />

        <input
          name="alcohol_content"
          placeholder="Teor alcoólico"
          type="number"
          step="0.1"
          value={form.alcohol_content}
          onChange={handleChange}
        />

        <input
          name="serving_temperature"
          placeholder="Temperatura de serviço"
          value={form.serving_temperature}
          onChange={handleChange}
        />

        <Full>
          <select multiple value={selectedGrapes} onChange={handleGrapeChange}>
            {(Array.isArray(grapes) ? grapes : []).map((grape) => (
              <option key={grape.id} value={grape.id}>
                {grape.name}
              </option>
            ))}
          </select>
        </Full>

        <Full>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </Full>

        {imagePreview && (
          <Preview>
            <img src={imagePreview} alt="Prévia do vinho" />
          </Preview>
        )}

        <Full>
          <input
            name="short_description"
            placeholder="Descrição curta"
            value={form.short_description}
            onChange={handleChange}
          />
        </Full>

        <Full>
          <textarea
            name="description"
            placeholder="Descrição completa"
            value={form.description}
            onChange={handleChange}
          />
        </Full>

        <Full>
          <textarea
            name="tasting_notes"
            placeholder="Notas sensoriais"
            value={form.tasting_notes}
            onChange={handleChange}
          />
        </Full>

        <Full>
          <textarea
            name="pairing"
            placeholder="Harmonização"
            value={form.pairing}
            onChange={handleChange}
          />
        </Full>

        <Full>
          <input
            name="search_keywords"
            placeholder="Palavras-chave para busca"
            value={form.search_keywords}
            onChange={handleChange}
          />
        </Full>

        <Actions>
          {isEditing && (
            <button type="button" onClick={handleCancelEdit} disabled={loading}>
              Cancelar
            </button>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Cadastrar"}
          </button>
        </Actions>
      </Form>
    </Card>
  );
}
