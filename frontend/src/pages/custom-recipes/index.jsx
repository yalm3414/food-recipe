import { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import RecipeItem from "../../components/recipe-item";

// This is what loads for the "Custom" page
// Under protectedroute, so will only be displayed if logged in otherwise brings user to login page
export default function CustomRecipes() {
  const [customRecipes, setCustomRecipes] = useState([]);

  useEffect(() => {
    getCustomRecipes();
  }, []);

  // Gets all the custom recipes for the logged in user
  const getCustomRecipes = () => {
    api
      .get("/api/custom-recipes/")
      .then((res) => res.data)
      .then((data) => {
        setCustomRecipes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="container mx-auto py-10 grid grid-cols-1">
      <div className="flex flex-row w-200 p-5 gap-20 ">
        <h1 className="font-extrabold lg:text-4xl text-xl text-black">
          Custom Recipes
        </h1>
        <Link
          to={`/create-recipe/create`}
          className="text-sm p-3 mt-5 px-8 rounded-lg uppercase font-medium tracking-wider inline-block shadow-md bg-black text-white"
        >
          Create Recipe
        </Link>
      </div>
      <div className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
        {
          // (Change) Loads all the custom recipes in a list of "recipe-item" components
          customRecipes.map((item) => (
            <RecipeItem item={item} type="custom" />
          ))
        }
      </div>
    </div>
  );
}
