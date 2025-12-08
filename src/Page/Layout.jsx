import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Banner from "../components/Customer/Banner";

function Layout() {
  const { pathname } = useLocation();

  // Những path không hiển thị Header/Footer
  const hiddenPaths = new Set([
    "/signin",
    "/signup",
    "/forgot-password",
    "/verification",
    "/reset-password",
  ]);

  const hideHeaderFooter = hiddenPaths.has(pathname);

  return (
    <>
      {!hideHeaderFooter && (
        <>
          <Banner />
          <Header />
        </>
      )}

      {/* {/* <main className="min-h-screen"> */}
      <main className="min-h-screen pb-64">
        <Outlet />
      </main>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default Layout;
