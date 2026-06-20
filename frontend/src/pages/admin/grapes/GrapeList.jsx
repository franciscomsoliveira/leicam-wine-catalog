import { useEffect, useState } from "react";

import { getGrapes } from "./grape.service";
import { GrapeForm } from "./GrapeForm";
import { Card, Table } from "./grape.styles";
import { getApiMessage } from "../../../services/response";

export function GrapeList() {
  const [grapes, setGrapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadGrapes() {
    try {
      setLoading(true);
      setMessage("");

      const data = await getGrapes();
      setGrapes(Array.isArray(data) ? data : []);
    } catch (error) {
      setGrapes([]);
      setMessage(getApiMessage(error, "Erro ao carregar uvas."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGrapes();
  }, []);

  return (
    <div>
      <GrapeForm onCreated={loadGrapes} />

      <Card>
        <h2>Uvas</h2>

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
                <td colSpan="3">Carregando uvas...</td>
              </tr>
            ) : grapes.length === 0 ? (
              <tr>
                <td colSpan="3">Nenhuma uva cadastrada.</td>
              </tr>
            ) : (
              grapes.map((grape) => (
                <tr key={grape.id}>
                  <td>{grape.name}</td>
                  <td>{grape.slug}</td>
                  <td>{grape.active ? "Ativo" : "Inativo"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
