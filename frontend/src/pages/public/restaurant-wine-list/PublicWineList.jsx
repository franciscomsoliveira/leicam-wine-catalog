import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getPublicWineList,
  resolveAssetUrl,
} from "./public-wine-list.service";

import {
  Badge,
  BadgeRow,
  Chip,
  Chips,
  Content,
  Empty,
  Eyebrow,
  Hero,
  HeroContent,
  InfoList,
  Logo,
  Page,
  PriceBox,
  PriceRow,
  SearchCard,
  Section,
  SectionTitle,
  StateBox,
  Subtitle,
  Title,
  WineBody,
  WineCard,
  WineGrid,
  WineImage,
  WineMeta,
  WineName,
  WineText,
} from "./public-wine-list.styles";

function formatMoney(value, currency = "BRL") {
  if (value === null || value === undefined || value === "") return null;

  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency,
  });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getWineSearchText(item) {
  const wine = item.wine || {};
  const grapes = Array.isArray(wine.grapes)
    ? wine.grapes.map((grape) => grape.name).join(" ")
    : "";

  return [
    wine.name,
    wine.producer,
    wine.country_name,
    wine.country_code,
    wine.region,
    wine.style?.name,
    wine.short_description,
    grapes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function WineItemCard({ item }) {
  const wine = item.wine || {};
  const imageUrl = resolveAssetUrl(wine.image_url || wine.thumbnail_url);
  const bottlePrice = formatMoney(item.bottle_price, item.currency);
  const glassPrice = formatMoney(item.glass_price, item.currency);
  const grapes = Array.isArray(wine.grapes)
    ? wine.grapes.map((grape) => grape.name).join(", ")
    : "";

  return (
    <WineCard $featured={item.featured}>
      <WineImage>
        {imageUrl ? <img src={imageUrl} alt={wine.name} /> : <span>Sem imagem</span>}
      </WineImage>

      <WineBody>
        <BadgeRow>
          {item.featured && <Badge $gold>Destaque</Badge>}
          {wine.style?.name && <Badge>{wine.style.name}</Badge>}
          {wine.country_name && <Badge>{wine.country_name}</Badge>}
        </BadgeRow>

        <WineName>{wine.name}</WineName>

        <WineMeta>
          {wine.producer || "Produtor não informado"}
          {wine.vintage ? ` • ${wine.vintage}` : ""}
          {wine.region ? ` • ${wine.region}` : ""}
        </WineMeta>

        {wine.short_description && <WineText>{wine.short_description}</WineText>}

        <InfoList>
          {grapes && (
            <div>
              <strong>Uvas</strong>
              <span>{grapes}</span>
            </div>
          )}

          {wine.tasting_notes && (
            <div>
              <strong>Notas</strong>
              <span>{wine.tasting_notes}</span>
            </div>
          )}

          {wine.pairing && (
            <div>
              <strong>Harmonização</strong>
              <span>{wine.pairing}</span>
            </div>
          )}

          {(wine.alcohol_content || wine.serving_temperature) && (
            <div>
              <strong>Serviço</strong>
              <span>
                {wine.alcohol_content ? `${wine.alcohol_content}% vol.` : ""}
                {wine.alcohol_content && wine.serving_temperature ? " • " : ""}
                {wine.serving_temperature || ""}
              </span>
            </div>
          )}
        </InfoList>

        <PriceRow>
          <PriceBox>
            <small>Garrafa</small>
            <strong>{bottlePrice || "-"}</strong>
          </PriceBox>

          <PriceBox>
            <small>Taça</small>
            <strong>{glassPrice || "-"}</strong>
          </PriceBox>
        </PriceRow>
      </WineBody>
    </WineCard>
  );
}

export function PublicWineList() {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("all");

  useEffect(() => {
    async function loadPublicWineList() {
      try {
        setLoading(true);
        setError("");

        const response = await getPublicWineList(slug);
        setData(response);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          "Não foi possível carregar a carta deste restaurante.";

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadPublicWineList();
  }, [slug]);

  const items = Array.isArray(data?.items) ? data.items : [];

  const styles = useMemo(() => {
    const uniqueStyles = new Map();

    items.forEach((item) => {
      const style = item.wine?.style;

      if (style?.name) {
        uniqueStyles.set(style.name, style.name);
      }
    });

    return Array.from(uniqueStyles.values()).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch = !term || getWineSearchText(item).includes(term);
      const matchesStyle =
        selectedStyle === "all" || item.wine?.style?.name === selectedStyle;

      return matchesSearch && matchesStyle;
    });
  }, [items, search, selectedStyle]);

  const featuredItems = filteredItems.filter((item) => item.featured);

  if (loading) {
    return (
      <StateBox>
        <div>
          <h1>Carregando carta</h1>
          <p>Preparando a seleção de vinhos.</p>
        </div>
      </StateBox>
    );
  }

  if (error) {
    return (
      <StateBox>
        <div>
          <h1>Carta indisponível</h1>
          <p>{error}</p>
        </div>
      </StateBox>
    );
  }

  const restaurant = data?.restaurant || {};
  const wineList = data?.wine_list || {};
  const logoUrl = resolveAssetUrl(restaurant.logo_url);
  const coverUrl = resolveAssetUrl(restaurant.cover_url);

  return (
    <Page>
      <Hero $coverUrl={coverUrl}>
        <HeroContent>
          <Logo>
            {logoUrl ? <img src={logoUrl} alt={restaurant.name} /> : getInitials(restaurant.name)}
          </Logo>

          <Eyebrow>LEICAM Wine Catalog</Eyebrow>
          <Title>{restaurant.name}</Title>
          <Subtitle>
            {wineList.description ||
              "Carta digital de vinhos com seleção da casa, preços atualizados e informações para harmonização."}
          </Subtitle>
        </HeroContent>
      </Hero>

      <Content>
        <SearchCard>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por vinho, uva, país, região ou estilo..."
          />

          <Chips>
            <Chip
              type="button"
              $selected={selectedStyle === "all"}
              onClick={() => setSelectedStyle("all")}
            >
              Todos
            </Chip>

            {styles.map((style) => (
              <Chip
                key={style}
                type="button"
                $selected={selectedStyle === style}
                onClick={() => setSelectedStyle(style)}
              >
                {style}
              </Chip>
            ))}
          </Chips>
        </SearchCard>

        {featuredItems.length > 0 && (
          <Section>
            <SectionTitle>
              <h2>Destaques</h2>
              <span>{featuredItems.length} seleção(ões)</span>
            </SectionTitle>

            <WineGrid>
              {featuredItems.map((item) => (
                <WineItemCard key={`featured-${item.id}`} item={item} />
              ))}
            </WineGrid>
          </Section>
        )}

        <Section>
          <SectionTitle>
            <h2>{wineList.name || "Carta de Vinhos"}</h2>
            <span>{filteredItems.length} vinho(s)</span>
          </SectionTitle>

          {filteredItems.length === 0 ? (
            <Empty>Nenhum vinho encontrado com esse filtro.</Empty>
          ) : (
            <WineGrid>
              {filteredItems.map((item) => (
                <WineItemCard key={item.id} item={item} />
              ))}
            </WineGrid>
          )}
        </Section>
      </Content>
    </Page>
  );
}
