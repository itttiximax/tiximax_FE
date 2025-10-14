import { RouterProvider } from "react-router-dom";
import Router from "./Router/Router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={Router} />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}

export default App;
