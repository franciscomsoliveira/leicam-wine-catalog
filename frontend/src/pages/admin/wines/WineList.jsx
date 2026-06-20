import { useEffect, useState } from "react";

import {
  activateWine,
  deactivateWine,
  deleteWine,
  getImageUrl,
  getWineById,
  getWineFormOptions,
  getWineGrapes,
  getWines,
} from "./wine.service";

import { WineForm } from "./WineForm";
import {
  Card,
  Message,
  RowActions,
  StatusBadge,
  Table,
  WineImage,
} from "./wine.styles";

function isWineActive(wine) {
  return Boolean(wine?.active ?? wine?.is_active);
}

function getApiErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export function WineList() {
  const [wines, setWines] = useState([]);
  const [wineStyles, setWineStyles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [grapes, setGrapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const [editingWine, setEditingWine] = useState(null);
  const [editingGrapeIds, setEditingGrapeIds] = useState([]);

  async function loadWines() {
    const data = await getWines();
    setWines(Array.isArray(data) ? data : []);
  }

  async function loadOptions() {
    const options = await getWineFormOptions();

    setWineStyles(Array.isArray(options.styles) ? options.styles : []);
    setCountries(Array.isArray(options.countries) ? options.countries : []);
    setGrapes(Array.isArray(options.grapes) ? options.grapes : []);
  }

  async function loadPageData() {
    try {
      setLoading(true);
      setMessage("");

      await Promise.all([loadWines(), loadOptions()]);
    } catch (error) {
      const apiMessage = getApiErrorMessage(error, "Erro ao carregar vinhos.");

      setMessage(apiMessage);
      setWines([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(wine) {
    try {
      setActionLoadingId(wine.id);
      setMessage("");

      const [wineDetails, wineGrapes] = await Promise.all([
        getWineById(wine.id),
        getWineGrapes(wine.id),
      ]);

      setEditingWine(wineDetails);
      setEditingGrapeIds((Array.isArray(wineGrapes) ? wineGrapes : []).map((item) => Number(item.grape_id)));

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Erro ao carregar vinho para edição."));
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleToggleActive(wine) {
    const active = isWineActive(wine);
    const actionText = active ? "inativar" : "ativar";

    const confirmed = window.confirm(
      `Deseja realmente ${actionText} o vinho "${wine.name}"?`,
    );

    if (!confirmed) return;

    try {
      setActionLoadingId(wine.id);
      setMessage("");

      if (active) {
        await deactivateWine(wine.id);
        setMessage("Vinho inativado com sucesso.");
      } else {
        await activateWine(wine.id);
        setMessage("Vinho ativado com sucesso.");
      }

      await loadWines();
    } catch (error) {
      setMessage(getApiErrorMessage(error, `Erro ao ${actionText} vinho.`));
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDelete(wine) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o vinho "${wine.name}"? Essa ação remove o vinho da listagem administrativa.`,
    );

    if (!confirmed) return;

    try {
      setActionLoadingId(wine.id);
      setMessage("");

      await deleteWine(wine.id);

      if (editingWine?.id === wine.id) {
        handleCancelEdit();
      }

      setMessage("Vinho excluído com sucesso.");
      await loadWines();
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Erro ao excluir vinho."));
    } finally {
      setActionLoadingId(null);
    }
  }

  function handleCancelEdit() {
    setEditingWine(null);
    setEditingGrapeIds([]);
  }

  async function handleSaved() {
    handleCancelEdit();
    await loadWines();
  }

  useEffect(() => {
    loadPageData();
  }, []);

  return (
    <div>
      <WineForm
        wineStyles={wineStyles}
        countries={countries}
        grapes={grapes}
        editingWine={editingWine}
        editingGrapeIds={editingGrapeIds}
        onCreated={loadWines}
        onUpdated={handleSaved}
        onCancelEdit={handleCancelEdit}
      />

      <Card>
        <h2>Vinhos</h2>

        {message && <Message>{message}</Message>}

        {loading ? (
          <Message>Carregando vinhos...</Message>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Produtor</th>
                <th>Estilo</th>
                <th>País</th>
                <th>Safra</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {wines.length === 0 ? (
                <tr>
                  <td colSpan="8">Nenhum vinho cadastrado.</td>
                </tr>
              ) : (
                wines.map((wine) => {
                  const active = isWineActive(wine);
                  const rowLoading = actionLoadingId === wine.id;

                  return (
                    <tr key={wine.id}>
                      <td>
                        <WineImage>
                          {wine.image_url ? (
                            <img
                              src={getImageUrl(wine.image_url)}
                              alt={wine.name}
                            />
                          ) : (
                            <span>Sem foto</span>
                          )}
                        </WineImage>
                      </td>
                      <td>{wine.name}</td>
                      <td>{wine.producer || "-"}</td>
                      <td>{wine.style_name || wine.wine_style_name || "-"}</td>
                      <td>{wine.country_code || "-"}</td>
                      <td>{wine.vintage || "-"}</td>
                      <td>
                        <StatusBadge $active={active}>
                          {active ? "Ativo" : "Inativo"}
                        </StatusBadge>
                      </td>
                      <td>
                        <RowActions>
                          <button
                            type="button"
                            onClick={() => handleEdit(wine)}
                            disabled={rowLoading}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleActive(wine)}
                            disabled={rowLoading}
                          >
                            {active ? "Inativar" : "Ativar"}
                          </button>

                          <button
                            type="button"
                            className="danger"
                            onClick={() => handleDelete(wine)}
                            disabled={rowLoading}
                          >
                            Excluir
                          </button>
                        </RowActions>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
