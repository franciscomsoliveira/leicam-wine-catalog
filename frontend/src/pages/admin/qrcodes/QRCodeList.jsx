import { useEffect, useState } from "react";

import { getRestaurantQRCodes, getRestaurants } from "./qr-code.service";

import {
  Actions,
  Card,
  Empty,
  Grid,
  Message,
  PublicUrl,
  QRBox,
  QRCard,
  QRHeader,
  Status,
  Toolbar,
} from "./qr-code.styles";

function downloadSvg(filename, svg) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function safeFileName(value = "qrcode") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function QRCodeList() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadQRCodes() {
    try {
      setLoading(true);
      setMessage("");

      const restaurants = await getRestaurants();
      const safeRestaurants = Array.isArray(restaurants) ? restaurants : [];
      const qrCodes = await getRestaurantQRCodes(safeRestaurants);

      setItems(Array.isArray(qrCodes) ? qrCodes : []);
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message || "Erro ao gerar QR Codes.";

      setMessage(apiMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(publicUrl) {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setMessage("Link copiado para a área de transferência.");
    } catch {
      setMessage("Não foi possível copiar automaticamente. Copie o link manualmente.");
    }
  }

  useEffect(() => {
    loadQRCodes();
  }, []);

  return (
    <Card>
      <Toolbar>
        <div>
          <h2>QR Codes dos Restaurantes</h2>
          <p>Cada QR aponta para a carta pública no padrão /r/:slug.</p>
        </div>

        <button type="button" onClick={loadQRCodes} disabled={loading}>
          {loading ? "Gerando..." : "Atualizar"}
        </button>
      </Toolbar>

      {message && <Message>{message}</Message>}

      {loading ? (
        <Empty>Gerando QR Codes...</Empty>
      ) : items.length === 0 ? (
        <Empty>Nenhum restaurante cadastrado ainda.</Empty>
      ) : (
        <Grid>
          {items.map((restaurant) => {
            const qrCode = restaurant.qrCode;
            const publicUrl = qrCode?.public_url || "";
            const svg = qrCode?.svg || "";

            return (
              <QRCard key={restaurant.id}>
                <QRHeader>
                  <strong>{restaurant.name}</strong>
                  <span>/{restaurant.slug}</span>
                  <Status $active={restaurant.active}>
                    {restaurant.active ? "Ativo" : "Inativo"}
                  </Status>
                </QRHeader>

                <QRBox dangerouslySetInnerHTML={{ __html: svg }} />

                <PublicUrl>{publicUrl}</PublicUrl>

                <Actions>
                  <a href={publicUrl} target="_blank" rel="noreferrer">
                    Abrir carta
                  </a>

                  <button
                    type="button"
                    className="secondary"
                    onClick={() => handleCopy(publicUrl)}
                  >
                    Copiar link
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadSvg(
                        `${safeFileName(restaurant.name)}-qrcode.svg`,
                        svg,
                      )
                    }
                  >
                    Baixar SVG
                  </button>

                  <button
                    type="button"
                    className="secondary"
                    onClick={() => window.print()}
                  >
                    Imprimir
                  </button>
                </Actions>
              </QRCard>
            );
          })}
        </Grid>
      )}
    </Card>
  );
}
