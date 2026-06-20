import styled from "styled-components";

export const Card = styled.div`
  background: #181818;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 24px;
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;

  input,
  textarea,
  select {
    width: 100%;
    background: #101010;
    border: 1px solid #333;
    color: #fff;
    border-radius: 10px;
    padding: 12px;
    outline: none;
  }

  textarea {
    min-height: 90px;
    resize: vertical;
  }

  select[multiple] {
    min-height: 130px;
  }

  input[type="file"] {
    padding: 10px;
  }

  button {
    background: #d6b36a;
    border: 0;
    border-radius: 10px;
    padding: 12px;
    font-weight: bold;
    cursor: pointer;
  }

  button[type="button"] {
    background: #2b2b2b;
    color: #fff;
    border: 1px solid #444;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Full = styled.div`
  grid-column: 1 / -1;
`;

export const Actions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const Message = styled.div`
  grid-column: 1 / -1;
  background: #242424;
  border: 1px solid #333;
  color: #d6b36a;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
`;

export const Preview = styled.div`
  grid-column: 1 / -1;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
  background: #101010;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 14px;
    border-bottom: 1px solid #2a2a2a;
    text-align: left;
    vertical-align: middle;
  }

  th {
    color: #d6b36a;
  }
`;

export const WineImage = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 10px;
  overflow: hidden;
  background: #101010;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-size: 11px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $active }) => ($active ? "#143d26" : "#302f2f")};
  color: ${({ $active }) => ($active ? "#8be0a7" : "#aaa")};
  border: 1px solid ${({ $active }) => ($active ? "#21693d" : "#444")};
`;

export const RowActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  button {
    background: #2b2b2b;
    border: 1px solid #444;
    color: #fff;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 12px;
  }

  button:hover {
    border-color: #d6b36a;
  }

  button.danger {
    color: #ff9f9f;
    border-color: #613434;
  }

  button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
