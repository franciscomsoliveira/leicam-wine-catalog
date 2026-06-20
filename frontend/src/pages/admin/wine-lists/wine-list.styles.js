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

  button {
    background: #d6b36a;
    border: 0;
    border-radius: 10px;
    padding: 12px;
    font-weight: bold;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
`;

export const CheckGroup = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #101010;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 12px;
  color: #fff;

  input {
    width: auto;
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

  button {
    background: #d6b36a;
    border: 0;
    border-radius: 8px;
    padding: 8px 10px;
    font-weight: bold;
    cursor: pointer;
    margin-right: 6px;
    margin-bottom: 6px;
  }

  button.secondary {
    background: #242424;
    border: 1px solid #333;
    color: #fff;
  }

  button.danger {
    background: #4a1515;
    color: #fff;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;

  h2,
  p {
    margin: 0;
  }

  p {
    color: #aaa;
    margin-top: 4px;
  }
`;

export const Status = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

export const SelectedBox = styled.div`
  background: #101010;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 16px;

  strong {
    color: #d6b36a;
  }

  span {
    color: #aaa;
  }
`;
