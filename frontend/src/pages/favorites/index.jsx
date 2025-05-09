import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-item";
import api from "../../api";

export default function Favorites() {
  const [favorites, setFavorites] = useState(null);
  const { searchParam, setSearchParam, handleSubmit } =
    useContext(GlobalContext);

  useEffect(() => {
    getFavoriteRecipes();
  }, []);
  const getFavoriteRecipes = () => {
    api
      .get("/api/favorite-recipes/")
      .then((res) => res.data)
      .then((data) => {
        setFavorites(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="container mx-auto py-10 grid grid-cols-1">
      {favorites && favorites.length > 0 ? (
        <div>
          <h1 className="font-extrabold lg:text-4xl text-xl text-black">
            Favorites
          </h1>

          <div className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
            {favorites.map((item) => (
              <RecipeItem item={item} type="favorites" />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="lg:text-4xl text-xl text-center text-black font-extrabold">
            Nothing is added in favorites.
          </p>
        </div>
      )}
    </div>
  );
}
