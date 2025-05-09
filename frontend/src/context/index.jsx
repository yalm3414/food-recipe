import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [recipeDetailsData, setRecipeDetailsData] = useState(null);
  const [favoritesList, setFavoritesList] = useState([]);
  const [searchResult, setSearchResult] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const appId = "fd12f1fb";
    const appKey = "beeec0d085c6eff18764530a59ff0889";

    try {
      const response = await axios.get(
        `https://api.edamam.com/api/recipes/v2`,
        {
          params: {
            type: "public",
            q: searchParam, // Search query (e.g., 'chicken')
            app_id: appId, // Your app_id
            app_key: appKey, // Your app_key
            count: 10,
            //diet: 'balanced',  // Optional, depending on the type of diet you want
          },
          headers: {
            "Edamam-Account-User": "johnadms954",
          },
        }
      );

      const data = response.data;

      if (data?.hits) {
        setRecipes(data?.hits);
        setLoading(false);
        setSearchResult(searchParam);
        console.log(searchResult);
        setSearchParam("");
        navigate("/");
      }

      console.log(data);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setSearchParam("");
    }
  }

  //delete later using different method in details page
  function handleAddToFavorite(getCurrentItem) {
    const getRecipeId = (uri) => uri.split("#").pop();

    console.log(getCurrentItem);
    let cpyFavoritesList = [...favoritesList];
    const index = cpyFavoritesList.findIndex(
      (item) =>
        getRecipeId(item?.recipe?.uri) ===
        getRecipeId(getCurrentItem?.recipe?.uri)
    );

    if (index === -1) {
      cpyFavoritesList.push(getCurrentItem);
    } else {
      cpyFavoritesList.splice(index, 1);
    }

    setFavoritesList(cpyFavoritesList);
  }

  console.log(favoritesList, "favoritesList");
  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        setSearchParam,
        loading,
        handleSubmit,
        recipes,
        recipeDetailsData,
        setRecipeDetailsData,
        handleAddToFavorite,
        favoritesList,
        searchResult,
        setSearchResult,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
