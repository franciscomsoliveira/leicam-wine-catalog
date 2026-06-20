import { useState } from "react";
import { createGrape } from "./grape.service";
import { Card, Form } from "./grape.styles";

export function GrapeForm({ onCreated }) {
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

    await createGrape(form);

    setForm({
      name: "",
      description: "",
    });

    onCreated();
  }

  return (
    <Card>
      <h2>Nova Uva</h2>

      <Form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nome da uva"
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
