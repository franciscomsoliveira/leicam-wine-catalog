import { useState } from "react";
import { createRestaurant } from "./restaurant.service";
import { Card, Form } from "./restaurant.styles";

export function RestaurantForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await createRestaurant(form);

    setForm({
      name: "",
      city: "",
      address: "",
      phone: "",
    });

    onCreated();
  }

  return (
    <Card>
      <h2>Novo Restaurante</h2>

      <Form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="city"
          placeholder="Cidade"
          value={form.city}
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Endereço"
          value={form.address}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Telefone"
          value={form.phone}
          onChange={handleChange}
        />

        <button type="submit">Cadastrar</button>
      </Form>
    </Card>
  );
}
