import styled from "styled-components";

export const Card = styled.div`
  background: #181818;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 24px;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 20px;

  h2,
  p {
    margin: 0;
  }

  p {
    color: #aaa;
    margin-top: 4px;
  }

  button {
    background: #d6b36a;
    border: 0;
    border-radius: 10px;
    padding: 12px 14px;
    font-weight: bold;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const Message = styled.div`
  background: #242424;
  border: 1px solid #333;
  color: #d6b36a;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const QRCard = styled.div`
  background: #101010;
  border: 1px solid #333;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const QRHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #fff;
    font-size: 16px;
  }

  span {
    color: #aaa;
    font-size: 13px;
  }
`;

export const QRBox = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    max-width: 260px;
    height: auto;
    display: block;
  }
`;

export const PublicUrl = styled.div`
  background: #181818;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 10px;
  color: #d6b36a;
  font-size: 12px;
  overflow-wrap: anywhere;
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  button,
  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #d6b36a;
    color: #101010;
    border: 0;
    border-radius: 10px;
    padding: 10px;
    font-weight: bold;
    font-size: 13px;
    cursor: pointer;
    text-decoration: none;
  }

  .secondary {
    background: #242424;
    border: 1px solid #333;
    color: #fff;
  }
`;

export const Status = styled.span`
  width: fit-content;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 12px;
  font-weight: bold;
  background: ${({ $active }) => ($active ? "#1f3b2a" : "#333")};
  color: ${({ $active }) => ($active ? "#8ee0a1" : "#999")};
`;

export const Empty = styled.div`
  background: #101010;
  border: 1px dashed #333;
  border-radius: 12px;
  color: #888;
  padding: 24px;
  text-align: center;
`;
