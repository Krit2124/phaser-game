import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { setupStore } from "@/shared/store";
import { MainLayout } from "./layouts/MainLayout";
import { CharacterSelectionPage } from "@/pages/CharacterSelection";
const GamePage = lazy(() => import("@/pages/GamePage/GamePage"));
import { ErrorPage } from "@/pages/ErrorPage";

import "@/shared/styles/global.scss"

const store = setupStore();

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <CharacterSelectionPage />
      },
      {
        path: "game",
        element: <GamePage />
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
