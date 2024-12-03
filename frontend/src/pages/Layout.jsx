import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
      <>
      {/* Outlet permet de rendre la route en cours d'utilisation
      (Si l'utilisateur est sur /home alors outlet va rendre la page Home) */}
      <Outlet />
      </>
  );
};

export default Layout;