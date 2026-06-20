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

  input {
    background: #101010;
    border: 1px solid #333;
    color: #fff;
    border-radius: 10px;
    padding: 12px;
  }

  button {
    background: #d6b36a;
    border: 0;
    border-radius: 10px;
    padding: 12px;
    font-weight: bold;
    cursor: pointer;
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
  }

  th {
    color: #d6b36a;
  }
`;
