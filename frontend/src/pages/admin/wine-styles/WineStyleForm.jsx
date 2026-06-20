import { useState } from "react";
import { createWineStyle } from "./wine-style.service";
import { Card, Form } from "./wine-style.styles";

export function WineStyleForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await createWineStyle(form);

    setForm({
      name: "",
      description: "",
    });

    onCreated();
  }

  return (
    <Card>
      <h2>Novo Estilo</h2>

      <Form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nome do estilo"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">Cadastrar</button>
      </Form>
    </Card>
  );
}
