import { setupStore } from "@/shared/store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { CharacterSelectionPage } from "@/pages/CharacterSelection";
import { HubPage } from "@/pages/Hub";

import "@/shared/styles/global.scss"

const store = setupStore();

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <CharacterSelectionPage />
      },
      {
        path: "hub",
        element: <HubPage />
      }
    ]
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
