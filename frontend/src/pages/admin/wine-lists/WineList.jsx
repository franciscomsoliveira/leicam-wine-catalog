import { useEffect, useMemo, useState } from "react";

import {
  activateWineList,
  createWineListItem,
  deactivateWineList,
  deleteWineListItem,
  getRestaurants,
  getWineListItems,
  getWineLists,
  getWines,
  makeWineListItemAvailable,
  makeWineListItemFeatured,
  makeWineListItemUnavailable,
  makeWineListItemUnfeatured,
  publishWineList,
  unpublishWineList,
} from "./wine-list.service";

import { WineListForm } from "./WineListForm";
import { getApiMessage } from "../../../services/response";

import {
  Actions,
  Card,
  CheckGroup,
  Empty,
  Form,
  Full,
  Message,
  SelectedBox,
  Status,
  Table,
  Toolbar,
} from "./wine-list.styles";

const initialItemForm = {
  wine_id: "",
  bottle_price: "",
  glass_price: "",
  currency: "BRL",
  available: true,
  featured: false,
};

function formatMoney(value, currency = "BRL") {
  if (value === null || value === undefined || value === "") return "-";

  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency,
  });
}

export function WineList() {
  const [restaurants, setRestaurants] = useState([]);
  const [wines, setWines] = useState([]);
  const [wineLists, setWineLists] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedWineListId, setSelectedWineListId] = useState("");
  const [itemForm, setItemForm] = useState(initialItemForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedWineList = useMemo(() => {
    return wineLists.find(
      (wineList) => Number(wineList.id) === Number(selectedWineListId),
    );
  }, [wineLists, selectedWineListId]);

  async function loadWineLists() {
    try {
      const data = await getWineLists();
      setWineLists(Array.isArray(data) ? data : []);
    } catch (error) {
      setWineLists([]);
      setMessage(getApiMessage(error, "Erro ao carregar cartas."));
    }
  }

  async function loadOptions() {
    try {
      const [restaurantsData, winesData] = await Promise.all([
        getRestaurants(),
        getWines(),
      ]);

      setRestaurants(Array.isArray(restaurantsData) ? restaurantsData : []);
      setWines(Array.isArray(winesData) ? winesData : []);
    } catch (error) {
      setRestaurants([]);
      setWines([]);
      setMessage(getApiMessage(error, "Erro ao carregar opções da carta."));
    }
  }

  async function loadItems(wineListId = selectedWineListId) {
    if (!wineListId) {
      setItems([]);
      return;
    }

    try {
      const data = await getWineListItems(wineListId);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setItems([]);
      setMessage(getApiMessage(error, "Erro ao carregar itens da carta."));
    }
  }

  useEffect(() => {
    loadWineLists();
    loadOptions();
  }, []);

  useEffect(() => {
    loadItems(selectedWineListId);
  }, [selectedWineListId]);

  function handleItemChange(event) {
    const { name, value, type, checked } = event.target;

    setItemForm({
      ...itemForm,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function resetItemForm() {
    setItemForm(initialItemForm);
  }

  async function handleCreateItem(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        wine_list_id: Number(selectedWineListId),
        wine_id: Number(itemForm.wine_id),
        bottle_price:
          itemForm.bottle_price === "" ? null : Number(itemForm.bottle_price),
        glass_price:
          itemForm.glass_price === "" ? null : Number(itemForm.glass_price),
        currency: itemForm.currency || "BRL",
        available: itemForm.available,
        featured: itemForm.featured,
      };

      await createWineListItem(payload);

      resetItemForm();
      setMessage("Vinho adicionado à carta com sucesso.");
      loadItems();
    } catch (error) {
      setMessage(getApiMessage(error, "Erro ao adicionar vinho à carta."));
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublish(wineList) {
    if (wineList.published) {
      await unpublishWineList(wineList.id);
    } else {
      await publishWineList(wineList.id);
    }

    loadWineLists();
  }

  async function handleToggleActive(wineList) {
    if (wineList.active) {
      await deactivateWineList(wineList.id);
    } else {
      await activateWineList(wineList.id);
    }

    loadWineLists();
  }

  async function handleToggleItemAvailability(item) {
    if (item.available) {
      await makeWineListItemUnavailable(item.id);
    } else {
      await makeWineListItemAvailable(item.id);
    }

    loadItems();
  }

  async function handleToggleItemFeatured(item) {
    if (item.featured) {
      await makeWineListItemUnfeatured(item.id);
    } else {
      await makeWineListItemFeatured(item.id);
    }

    loadItems();
  }

  async function handleDeleteItem(item) {
    const confirmed = window.confirm(
      `Remover ${item.wine_name} desta carta?`,
    );

    if (!confirmed) return;

    await deleteWineListItem(item.id);
    loadItems();
  }

  return (
    <div>
      <WineListForm restaurants={restaurants} onCreated={loadWineLists} />

      <Card>
        <Toolbar>
          <div>
            <h2>Cartas</h2>
            <p>Selecione uma carta para adicionar vinhos.</p>
          </div>
        </Toolbar>

        {wineLists.length === 0 ? (
          <Empty>Nenhuma carta cadastrada ainda.</Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Restaurante</th>
                <th>Padrão</th>
                <th>Publicada</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {wineLists.map((wineList) => (
                <tr key={wineList.id}>
                  <td>{wineList.name}</td>
                  <td>{wineList.restaurant_name}</td>
                  <td>{wineList.is_default ? "Sim" : "Não"}</td>
                  <td>
                    <Status $active={wineList.published}>
                      {wineList.published ? "Publicada" : "Rascunho"}
                    </Status>
                  </td>
                  <td>
                    <Status $active={wineList.active}>
                      {wineList.active ? "Ativa" : "Inativa"}
                    </Status>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setSelectedWineListId(wineList.id)}
                    >
                      Selecionar
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => handleTogglePublish(wineList)}
                    >
                      {wineList.published ? "Despublicar" : "Publicar"}
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => handleToggleActive(wineList)}
                    >
                      {wineList.active ? "Inativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card>
        <Toolbar>
          <div>
            <h2>Itens da Carta</h2>
            <p>Adicione vinhos, preços e destaques para a carta selecionada.</p>
          </div>
        </Toolbar>

        {!selectedWineList ? (
          <Empty>Selecione uma carta para gerenciar os vinhos.</Empty>
        ) : (
          <>
            <SelectedBox>
              <strong>{selectedWineList.name}</strong>{" "}
              <span>• {selectedWineList.restaurant_name}</span>
            </SelectedBox>

            <Form onSubmit={handleCreateItem}>
              {message && <Message>{message}</Message>}

              <Full>
                <select
                  name="wine_id"
                  value={itemForm.wine_id}
                  onChange={handleItemChange}
                  required
                >
                  <option value="">Selecione o vinho</option>
                  {wines.map((wine) => (
                    <option key={wine.id} value={wine.id}>
                      {wine.name} {wine.producer ? `- ${wine.producer}` : ""}
                    </option>
                  ))}
                </select>
              </Full>

              <input
                name="bottle_price"
                placeholder="Preço garrafa"
                type="number"
                step="0.01"
                value={itemForm.bottle_price}
                onChange={handleItemChange}
              />

              <input
                name="glass_price"
                placeholder="Preço taça"
                type="number"
                step="0.01"
                value={itemForm.glass_price}
                onChange={handleItemChange}
              />

              <input
                name="currency"
                placeholder="Moeda"
                value={itemForm.currency}
                onChange={handleItemChange}
                maxLength={3}
              />

              <CheckGroup>
                <input
                  type="checkbox"
                  name="available"
                  checked={itemForm.available}
                  onChange={handleItemChange}
                />
                <span>Disponível</span>
              </CheckGroup>

              <CheckGroup>
                <input
                  type="checkbox"
                  name="featured"
                  checked={itemForm.featured}
                  onChange={handleItemChange}
                />
                <span>Destaque</span>
              </CheckGroup>

              <Actions>
                <button type="submit" disabled={loading}>
                  {loading ? "Adicionando..." : "Adicionar Vinho"}
                </button>
              </Actions>
            </Form>

            {items.length === 0 ? (
              <Empty>Nenhum vinho adicionado nesta carta ainda.</Empty>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Ordem</th>
                    <th>Vinho</th>
                    <th>Estilo</th>
                    <th>Garrafa</th>
                    <th>Taça</th>
                    <th>Disponível</th>
                    <th>Destaque</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.display_order}</td>
                      <td>
                        {item.wine_name}
                        <br />
                        <small>{item.producer || "-"}</small>
                      </td>
                      <td>{item.style_name || "-"}</td>
                      <td>{formatMoney(item.bottle_price, item.currency)}</td>
                      <td>{formatMoney(item.glass_price, item.currency)}</td>
                      <td>
                        <Status $active={item.available}>
                          {item.available ? "Sim" : "Não"}
                        </Status>
                      </td>
                      <td>
                        <Status $active={item.featured}>
                          {item.featured ? "Sim" : "Não"}
                        </Status>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => handleToggleItemAvailability(item)}
                        >
                          {item.available ? "Indisponível" : "Disponível"}
                        </button>
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => handleToggleItemFeatured(item)}
                        >
                          {item.featured ? "Remover destaque" : "Destacar"}
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDeleteItem(item)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
