import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: #0f0f0f;
  color: #f5f5f5;
`;

export const Sidebar = styled.aside`
  background: #151515;
  border-right: 1px solid #2a2a2a;
  padding: 24px;
`;

export const Brand = styled.div`
  margin-bottom: 32px;

  strong {
    display: block;
    font-size: 20px;
    color: #d6b36a;
  }

  span {
    font-size: 13px;
    color: #999;
  }
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;

  a {
    padding: 12px 14px;
    border-radius: 10px;
    color: #ccc;
    transition: 0.2s;
  }

  a:hover {
    background: #242424;
    color: #fff;
  }
`;

export const Content = styled.main`
  padding: 28px;
`;

export const Header = styled.header`
  margin-bottom: 28px;

  h1 {
    font-size: 28px;
    color: #fff;
  }

  p {
    margin-top: 6px;
    color: #aaa;
  }
`;
