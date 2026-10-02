import { Outlet } from "react-router-dom";
import SmoothScroll from "../components/SmoothScroll";
import ScrollToTop from "../components/ScrollToTop";
import Header from "../sections/Header";
import Footer from "../sections/Footer";

// Header + Footer are rendered once; <Outlet /> is where each page appears.
export default function MainLayout() {
  return (
    <SmoothScroll>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
