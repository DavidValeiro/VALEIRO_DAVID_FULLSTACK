import { Outlet } from "react-router-dom";
import Menu from "../Menu/Menu";

const Layout = () => (
  <>
    <Menu />
    <Outlet />
  </>
);

export default Layout;
