import { PropsWithChildren, createContext, useContext } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/shared/Loader";
import { User } from "../interfaces/user";
import { getCurrentUser } from "../services/authService";
import useLocalStorage from "./useLocalStorage";

interface AuthContext {
  isAuthenticated: boolean;
  user: null | User;
}

const AuthContext = createContext<AuthContext>(undefined!);

export function AuthProvider({ children }: Readonly<PropsWithChildren>) {
  const [token, _, removeToken] = useLocalStorage("token");
  const navigate = useNavigate();

  const { isSuccess, data } = useQuery({
    queryFn: () => getCurrentUser(token),
    queryKey: ["currentUser", token],
    enabled: !!token,
    retry: 1,
    onError() {
      removeToken();
      navigate("/login");
    },
  });

  if (isSuccess) {
    return (
      <AuthContext.Provider value={{ user: data, isAuthenticated: true }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return <Loader />;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(`Use inside of <AuthProvider />`);
  }
  return context;
}
