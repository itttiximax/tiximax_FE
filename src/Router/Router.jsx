import { createBrowserRouter } from "react-router-dom";
import Layout from "../Page/Layout";
import SignIn from "../Page/SignIn";
import SignUp from "../Page/SignUp";
import ForgotPassword from "../Page/ForgotPassword";
import Home from "../Page/Home";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // { path: "/signin", element: <SignIn /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "home", element: <Home /> },
    ],
  },
]);

export default Router;
