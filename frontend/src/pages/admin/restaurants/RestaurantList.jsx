import { useEffect, useState } from "react";

import { getRestaurants } from "./restaurant.service";
import { RestaurantForm } from "./RestaurantForm";
import { Card, Table } from "./restaurant.styles";
import { getApiMessage } from "../../../services/response";

export function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadRestaurants() {
    try {
      setLoading(true);
      setMessage("");

      const data = await getRestaurants();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (error) {
      setRestaurants([]);
      setMessage(getApiMessage(error, "Erro ao carregar restaurantes."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRestaurants();
  }, []);

  return (
    <div>
      <RestaurantForm onCreated={loadRestaurants} />

      <Card>
        <h2>Restaurantes</h2>

        {message && <p>{message}</p>}

        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade</th>
              <th>Telefone</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Carregando restaurantes...</td>
              </tr>
            ) : restaurants.length === 0 ? (
              <tr>
                <td colSpan="4">Nenhum restaurante cadastrado.</td>
              </tr>
            ) : (
              restaurants.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.city || "-"}</td>
                  <td>{restaurant.phone || "-"}</td>
                  <td>{restaurant.active ? "Ativo" : "Inativo"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
