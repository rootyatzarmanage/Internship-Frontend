import { Outlet } from "react-router-dom";
import SmoothScroll from "../components/common/SmoothScroll";
import ScrollToTop from "../components/common/ScrollToTop";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

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
