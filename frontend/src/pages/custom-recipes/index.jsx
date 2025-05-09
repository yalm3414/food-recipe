import { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import RecipeItem from "../../components/recipe-item";

export default function CustomRecipes() {
  const [customRecipes, setCustomRecipes] = useState([]);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getCustomRecipes();
  }, []);

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

  const deleteCustomRecipe = (id) => {
    api
      .delete(`/api/custom-recipes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Recipe deleted!");
        else alert("Failed to delete note");
        getCustomRecipes();
      })
      .catch((error) => alert(error));
  };

  const createCustomRecipe = (e) => {
    e.preventDefault();
    api
      .post("/api/custom-recipes", { ingredients, instructions, title })
      .then((res) => {
        if (res.status === 201) alert("Note Created!");
        else alert("Failed to make note.");
        getCustomRecipes();
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
        {customRecipes.map((item) => (
          <RecipeItem item={item} type="custom" />
        ))}
      </div>
    </div>
  );
}
