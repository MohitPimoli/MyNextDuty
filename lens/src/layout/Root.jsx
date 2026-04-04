import { Outlet } from "react-router-dom";
import { Footer } from "../components/Hooter/Footer";
import { Header } from "../components/Header/Header";
export const Root = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
