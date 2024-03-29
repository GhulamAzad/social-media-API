import { Outlet } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";

const AuthLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

export default AuthLayout;
