import { Link, Outlet } from "react-router-dom";

import {
  Container,
  Sidebar,
  Brand,
  Nav,
  Content,
  Header,
} from "./admin-layout.styles";

export function AdminLayout() {
  return (
    <Container>
      <Sidebar>
        <Brand>
          <strong>LEICAM Wine</strong>
          <span>Admin Catalog</span>
        </Brand>

        <Nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/restaurants">Restaurantes</Link>
          <Link to="/admin/wines">Vinhos</Link>
          <Link to="/admin/wine-styles">Estilos</Link>
          <Link to="/admin/grapes">Uvas</Link>
          <Link to="/admin/wine-lists">Cartas</Link>
          <Link to="/admin/qrcodes">QR Codes</Link>
        </Nav>
      </Sidebar>

      <Content>
        <Header>
          <h1>Painel Administrativo</h1>
          <p>Gerencie restaurantes, vinhos, cartas e catálogo público.</p>
        </Header>

        <Outlet />
      </Content>
    </Container>
  );
}
