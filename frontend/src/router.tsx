import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    loader: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return redirect("/login");
      }
      return null;
    },
    children: [
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            path: "/",
            Component: App,
          },
          {
            path: "/notifications",
            element: <div>Notifications Page</div>,
          },
          {
            path: "/message",
            element: <div>Message Page</div>,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    loader: async () => {
      const token = localStorage.getItem("token");
      if (token) {
        return redirect("/");
      }
      return null;
    },
    Component: Login,
  },
  {
    path: "*",
    element: <div>404 not found</div>,
  },
]);

export default router;
