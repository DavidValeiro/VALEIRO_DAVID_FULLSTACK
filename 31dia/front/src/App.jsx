import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import About from "./pages/About";
import NavBar from "./components/NavBar/NavBar";
import User from "./pages/User";
import Post from "./pages/Post";
import SetUser from "./pages/SetUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "user/:id", element: <User /> },
      { path: "post/:id", element: <Post /> },
      { path: "set-user", element: <SetUser /> },
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen">
        <RouterProvider router={router} />
      </div>
    </UserProvider>
  );
}

export default App;
