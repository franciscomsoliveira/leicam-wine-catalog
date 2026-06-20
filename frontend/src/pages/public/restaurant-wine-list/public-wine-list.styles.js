import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(214, 179, 106, 0.16), transparent 34%),
    #0f0f0f;
  color: #f5f5f5;
`;

export const Hero = styled.section`
  min-height: 280px;
  padding: 28px 18px 34px;
  display: flex;
  align-items: flex-end;
  background:
    linear-gradient(180deg, rgba(15, 15, 15, 0.34), #0f0f0f 92%),
    ${({ $coverUrl }) => ($coverUrl ? `url(${$coverUrl})` : "#181818")};
  background-size: cover;
  background-position: center;
`;

export const HeroContent = styled.div`
  width: min(980px, 100%);
  margin: 0 auto;
`;

export const Logo = styled.div`
  width: 82px;
  height: 82px;
  border-radius: 22px;
  background: #181818;
  border: 1px solid rgba(214, 179, 106, 0.45);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  color: #d6b36a;
  font-size: 28px;
  font-weight: 800;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  color: #d6b36a;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 10px;
`;

export const Title = styled.h1`
  max-width: 720px;
  margin: 0;
  font-size: clamp(34px, 9vw, 72px);
  line-height: 0.95;
  letter-spacing: -0.06em;
`;

export const Subtitle = styled.p`
  max-width: 680px;
  margin: 14px 0 0;
  color: #d8d8d8;
  font-size: 16px;
  line-height: 1.5;
`;

export const Content = styled.section`
  width: min(980px, 100%);
  margin: 0 auto;
  padding: 22px 18px 48px;
`;

export const SearchCard = styled.div`
  background: rgba(24, 24, 24, 0.94);
  border: 1px solid #2a2a2a;
  border-radius: 18px;
  padding: 16px;
  margin-top: -42px;
  backdrop-filter: blur(16px);
  position: sticky;
  top: 12px;
  z-index: 5;

  input {
    width: 100%;
    background: #101010;
    border: 1px solid #333;
    color: #fff;
    border-radius: 14px;
    padding: 14px 16px;
    outline: none;
    font-size: 15px;
  }
`;

export const Chips = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-top: 12px;

  button {
    flex: 0 0 auto;
    border: 1px solid ${({ $active }) => ($active ? "#d6b36a" : "#333")};
    background: #101010;
    color: #fff;
    border-radius: 999px;
    padding: 9px 12px;
    cursor: pointer;
  }
`;

export const Chip = styled.button`
  border-color: ${({ $selected }) => ($selected ? "#d6b36a !important" : "#333")};
  color: ${({ $selected }) => ($selected ? "#d6b36a !important" : "#fff")};
`;

export const Section = styled.section`
  margin-top: 28px;
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  h2 {
    margin: 0;
    font-size: 22px;
  }

  span {
    color: #888;
    font-size: 13px;
  }
`;

export const WineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const WineCard = styled.article`
  background: #181818;
  border: 1px solid ${({ $featured }) => ($featured ? "rgba(214, 179, 106, 0.52)" : "#2a2a2a")};
  border-radius: 20px;
  overflow: hidden;
`;

export const WineImage = styled.div`
  height: 230px;
  background:
    linear-gradient(135deg, #222, #101010);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    color: #666;
    font-size: 13px;
  }
`;

export const WineBody = styled.div`
  padding: 18px;
`;

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: #101010;
  border: 1px solid #333;
  color: ${({ $gold }) => ($gold ? "#d6b36a" : "#ddd")};
  padding: 6px 9px;
  font-size: 12px;
  font-weight: 700;
`;

export const WineName = styled.h3`
  margin: 0;
  font-size: 22px;
  line-height: 1.1;
`;

export const WineMeta = styled.p`
  margin: 8px 0 0;
  color: #aaa;
  font-size: 14px;
  line-height: 1.45;
`;

export const WineText = styled.p`
  margin: 14px 0 0;
  color: #d5d5d5;
  line-height: 1.55;
  font-size: 14px;
`;

export const InfoList = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 14px;

  div {
    border-top: 1px solid #2a2a2a;
    padding-top: 10px;
  }

  strong {
    display: block;
    color: #d6b36a;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }

  span {
    color: #ddd;
    font-size: 14px;
    line-height: 1.45;
  }
`;

export const PriceRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 16px;
`;

export const PriceBox = styled.div`
  background: #101010;
  border: 1px solid #333;
  border-radius: 14px;
  padding: 12px;

  small {
    display: block;
    color: #888;
    margin-bottom: 4px;
  }

  strong {
    color: #f5f5f5;
    font-size: 18px;
  }
`;

export const StateBox = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #0f0f0f;
  color: #f5f5f5;
  text-align: center;

  div {
    width: min(420px, 100%);
    background: #181818;
    border: 1px solid #2a2a2a;
    border-radius: 18px;
    padding: 28px;
  }

  h1 {
    margin: 0 0 10px;
  }

  p {
    color: #aaa;
    line-height: 1.5;
  }
`;

export const Empty = styled.div`
  background: #181818;
  border: 1px dashed #333;
  border-radius: 18px;
  color: #888;
  padding: 28px;
  text-align: center;
`;
