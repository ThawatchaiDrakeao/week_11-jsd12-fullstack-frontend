import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div>
      <Navbar />
      <section className="flex justify-center bg-zinc-950">
        <Outlet />
      </section>
    </div>
  );
}
