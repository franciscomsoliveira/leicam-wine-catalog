import { useEffect, useState } from "react";

import { getWineStyles } from "./wine-style.service";
import { WineStyleForm } from "./WineStyleForm";
import { Card, Table } from "./wine-style.styles";
import { getApiMessage } from "../../../services/response";

export function WineStyleList() {
  const [wineStyles, setWineStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadWineStyles() {
    try {
      setLoading(true);
      setMessage("");

      const data = await getWineStyles();
      setWineStyles(Array.isArray(data) ? data : []);
    } catch (error) {
      setWineStyles([]);
      setMessage(getApiMessage(error, "Erro ao carregar estilos de vinho."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWineStyles();
  }, []);

  return (
    <div>
      <WineStyleForm onCreated={loadWineStyles} />

      <Card>
        <h2>Estilos de Vinho</h2>

        {message && <p>{message}</p>}

        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3">Carregando estilos...</td>
              </tr>
            ) : wineStyles.length === 0 ? (
              <tr>
                <td colSpan="3">Nenhum estilo cadastrado.</td>
              </tr>
            ) : (
              wineStyles.map((style) => (
                <tr key={style.id}>
                  <td>{style.name}</td>
                  <td>{style.slug}</td>
                  <td>{style.active ? "Ativo" : "Inativo"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
