import { createBrowserRouter } from "react-router";
import { LoginScreen } from "./components/schools/LoginScreen";
import { RegisterScreen } from "./components/schools/RegisterScreen";
import { Dashboard } from "./components/schools/dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginScreen,
  },
  {
    path: "/login",
    Component: LoginScreen,
  },
  {
    path: "/register",
    Component: RegisterScreen,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
]);
