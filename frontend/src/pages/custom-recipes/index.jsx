import { useState, useEffect } from "react";
import api from "../../api";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

export default function CreateRecipe() {
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [title, setTitle] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const createCustomRecipe = (e) => {
    e.preventDefault();
    api
      .post("/api/custom-recipes/", { ingredients, instructions, title })
      .then((res) => {
        if (res.status === 201) alert("Recipe Created!");
        else alert("Failed to make Recipe.");
        navigate("/custom-recipes");
      })
      .catch((err) => alert(err));
  };

  const updateCustomRecipe = (e) => {
    e.preventDefault();
    api
      .put(`/api/custom-recipes/details/${id}/`, {
        ingredients,
        instructions,
        title,
      })
      .then((res) => {
        if (res.status === 200) alert("Recipe Updated!");
        else alert("Failed to update Recipe.");
        navigate("/custom-recipes");
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    if (id !== "create") {
      const getCustomRecipes = () => {
        api
          .get(`/api/custom-recipes/details/${id}/`)
          .then((res) => {
            setTitle(res.data.title);
            setIngredients(res.data.ingredients);
            setInstructions(res.data.instructions);
          })
          .catch((err) => console.error(err));
      };

      getCustomRecipes();
    }
  }, [id]);

  return (
    <div>
      <div className="flex flex-col mx-auto items-center content- max-w-5xl w-full p-5 gap-10 ">
        <h1 className="font-extrabold lg:text-4xl text-xl text-black">
          {id === "create" ? "Create Recipe" : "Update Recipe"}
        </h1>
        <form
          onSubmit={id === "create" ? createCustomRecipe : updateCustomRecipe}
          className="flex flex-col mx-auto items-start content- max-w-5xl w-full p-5 gap-5 "
        >
          <label
            htmlFor="title"
            className="font-extrabold lg:text-3xl text-xl text-black"
          >
            Title:
          </label>
          <input
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-300 dark:border-gray-500 dark:placeholder-shown:*: dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Recipe title here..."
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <label
            htmlFor="ingredients"
            className="font-extrabold lg:text-3xl text-xl text-black"
          >
            Ingredients:
          </label>
          <textarea
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-300 dark:border-gray-500 dark:placeholder-shown:*: dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write the ingredients here..."
            rows={5}
            id="ingredients"
            name="ingredients"
            required
            onChange={(e) => setIngredients(e.target.value)}
            value={ingredients}
          ></textarea>
          <label
            htmlFor="instructions"
            className="font-extrabold lg:text-3xl text-xl text-black"
          >
            Instructions:
          </label>
          <textarea
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-300 dark:border-gray-500 dark:placeholder-shown:*: dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write the instructions here..."
            rows={8}
            id="instructions"
            name="instructions"
            required
            onChange={(e) => setInstructions(e.target.value)}
            value={instructions}
          ></textarea>
          <button
            className="text-sm p-3 mt-5 px-8 w-43 mx-auto rounded-lg uppercase font-medium tracking-wider inline-block shadow-md bg-black text-white"
            type="submit"
          >
            {id === "create" ? "Create Recipe" : "Update Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
}
