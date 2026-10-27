import { Outlet } from "react-router-dom";
import GlobalNavbar from "./GlobalNavbar";
import GlobalFooter from "./GlobalFooter";

export default function MainLayout() {
  return (
    <>
      <GlobalNavbar />
      <main className="pt-5">
        <Outlet />
      </main>
      <GlobalFooter />
    </>
  );
}
