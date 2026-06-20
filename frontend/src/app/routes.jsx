import { createBrowserRouter } from "react-router-dom";

import { Home } from "../pages/public/Home";
import { PublicWineList } from "../pages/public/restaurant-wine-list/PublicWineList";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Dashboard } from "../pages/admin/Dashboard";
import { RestaurantList } from "../pages/admin/restaurants/RestaurantList";
import { WineStyleList } from "../pages/admin/wine-styles/WineStyleList";
import { GrapeList } from "../pages/admin/grapes/GrapeList";
import { WineList } from "../pages/admin/wines/WineList";
import { WineList as AdminWineList } from "../pages/admin/wine-lists/WineList";
import { QRCodeList } from "../pages/admin/qrcodes/QRCodeList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/r/:slug",
    element: <PublicWineList />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "restaurants",
        element: <RestaurantList />,
      },
      {
        path: "wine-styles",
        element: <WineStyleList />,
      },
      {
        path: "grapes",
        element: <GrapeList />,
      },
      {
        path: "wines",
        element: <WineList />,
      },
      {
        path: "wine-lists",
        element: <AdminWineList />,
      },
      {
        path: "qrcodes",
        element: <QRCodeList />,
      },
    ],
  },
]);
