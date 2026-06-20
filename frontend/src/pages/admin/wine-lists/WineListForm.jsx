import { useState } from "react";

import { createWineList } from "./wine-list.service";
import { getApiMessage } from "../../../services/response";
import { Actions, Card, CheckGroup, Form, Full, Message } from "./wine-list.styles";

const initialForm = {
  restaurant_id: "",
  name: "",
  description: "",
  is_default: false,
  published: false,
};

export function WineListForm({ restaurants = [], onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function resetForm() {
    setForm(initialForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        restaurant_id: Number(form.restaurant_id),
        name: form.name,
        description: form.description || null,
        is_default: form.is_default,
        published: form.published,
      };

      await createWineList(payload);

      resetForm();
      setMessage("Carta cadastrada com sucesso.");
      onCreated?.();
    } catch (error) {
      setMessage(getApiMessage(error, "Erro ao cadastrar carta."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2>Nova Carta</h2>

      <Form onSubmit={handleSubmit}>
        {message && <Message>{message}</Message>}

        <select
          name="restaurant_id"
          value={form.restaurant_id}
          onChange={handleChange}
          required
        >
          <option value="">Selecione o restaurante</option>
          {(Array.isArray(restaurants) ? restaurants : []).map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </option>
          ))}
        </select>

        <input
          name="name"
          placeholder="Nome da carta. Ex: Carta Principal"
          value={form.name}
          onChange={handleChange}
          required
        />

        <Full>
          <textarea
            name="description"
            placeholder="Descrição da carta"
            value={form.description}
            onChange={handleChange}
          />
        </Full>

        <CheckGroup>
          <input
            type="checkbox"
            name="is_default"
            checked={form.is_default}
            onChange={handleChange}
          />
          <span>Carta padrão deste restaurante</span>
        </CheckGroup>

        <CheckGroup>
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
          />
          <span>Publicar carta</span>
        </CheckGroup>

        <Actions>
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar Carta"}
          </button>
        </Actions>
      </Form>
    </Card>
  );
}
