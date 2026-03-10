import { Outlet } from "react-router-dom";
import { Footer } from "../components/footer/Footer";
import { Header } from "../components/header/Header";
export const Root = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
