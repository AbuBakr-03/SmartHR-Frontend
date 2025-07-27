import Navbar from "@/components/layouts/navbar/Navbar";
import Footer from "@/components/layouts/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar sidebar={false} />
      <Outlet />
      <Footer />
    </>
  );
};
export default Layout;
