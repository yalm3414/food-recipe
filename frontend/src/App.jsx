import { useState } from "react";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar";
import Favorites from "./pages/favorites";
import Details from "./pages/details";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import NotFound from "./pages/notfound";
import CustomRecipes from "./pages/custom-recipes";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateRecipe from "./pages/create-recipe";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div className="min-h-screen p-6 bg-white text-gray-600 text-lg">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-recipes"
            element={
              <ProtectedRoute>
                <CustomRecipes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-recipe/:id"
            element={
              <ProtectedRoute>
                <CreateRecipe />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/recipe-item/:type/:id" element={<Details />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
