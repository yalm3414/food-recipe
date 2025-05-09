import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../context";
import axios from "axios";
import api from "../../api";
import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function Details() {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const {
    recipeDetailsData,
    setRecipeDetailsData,
    favoritesList,
    handleAddToFavorite,
  } = useContext(GlobalContext);
  const [customDetailsData, setCustomDetailsData] = useState(null);
  const [favoriteDetailsData, setFavoriteDetailsData] = useState(null);

  const appId = "fd12f1fb";
  const appKey = "beeec0d085c6eff18764530a59ff0889";

  //console.log(id);

  /* useEffect(() => {
    if (recipeDetails?.recipe?.uri) {
      setFavoriteDetailsData(null);
      checkFavoriterecipe();
    }
  }, [recipeDetails?.recipe?.uri]); */

  switch (type) {
    case "public":
      useEffect(() => {
        async function getRecipeDetails() {
          const response = await axios.get(
            `https://api.edamam.com/api/recipes/v2/%231${id}`,
            {
              params: {
                type: "public",
                app_id: appId, // Your app_id
                app_key: appKey, // Your app_key
              },
              headers: {
                "Edamam-Account-User": "johnadms954",
              },
            }
          );
          const data = await response.data;

          if (data?.recipe) {
            setRecipeDetailsData(data);
          }
        }
        //console.log(recipeDetailsData);
        getRecipeDetails();
        checkFavoriterecipe();
      }, [recipeDetailsData]);

      break;
    case "custom":
      useEffect(() => {
        getCustomRecipes();
      }, []);
      const getCustomRecipes = () => {
        api
          .get(`api/custom-recipes/details/${id}/`)
          .then((res) => res.data)
          .then((data) => {
            setCustomDetailsData(data);
            console.log(data);
          })
          .catch((err) => alert(err));
      };
      break;
    case "favorites":
      useEffect(() => {
        setRecipeDetailsData(null);
        getFavoriteRecipes();
      }, []);
      const getFavoriteRecipes = () => {
        api
          .get(`api/favorite-recipes/${id}/`)
          .then((res) => res.data)
          .then((data) => {
            setFavoriteDetailsData(data);
            console.log(data);
          })
          .catch((err) => alert(err));
      };
      break;
  }

  const removeFavorite = () => {
    api
      .delete(`api/favorite-recipes/${favoriteDetailsData.id}/`)
      .then((res) => {
        if (res.status === 204) alert("Removed From Favorites");
        else alert("Failed to remove favorite");

        setFavoriteDetailsData(null);
        checkFavoriterecipe();
      })
      .catch((err) => alert(err));
  };

  const removeCustom = () => {
    api
      .delete(`api/custom-recipes/details/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Removed Custom Recipe");
        else alert("Failed to remove custom recipe");
      })
      .catch((err) => alert(err));
  };

  function checkFavoriterecipe() {
    api
      .get(
        `/api/favorite-recipes/by-uri/?uri=${encodeURIComponent(
          recipeDetailsData?.recipe?.uri
        )}`
      )
      .then((res) => res.data)
      .then((data) => {
        setFavoriteDetailsData(data);
        console.log(data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setFavoriteDetailsData(null);
        }
      });
  }

  const createFavoriteRecipe = (
    label,
    ingredients,
    source,
    url,
    uri,
    image
  ) => {
    api
      .post("/api/favorite-recipes/", {
        label,
        ingredients,
        source,
        url,
        uri,
        image,
      })
      .then((res) => {
        if (res.status === 201) {
          <div
            class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
            role="alert"
          >
            <svg
              class="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
            </svg>
            <p>Something happened that you should know about.</p>
          </div>;
        } else alert("Failed to favorive Recipe.");
        console.log(res.data);
        setFavoriteDetailsData(null);
        checkFavoriterecipe();
      })
      .catch((err) => navigate("/login"));
  };

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="row-start-2 lg:row-start-auto">
        <div className="h-96 overflow-hidden rounded-xl group">
          <img
            src={
              recipeDetailsData
                ? recipeDetailsData?.recipe?.image
                : favoriteDetailsData
                ? favoriteDetailsData?.image
                : "/public/food_place_holder.png"
            }
            className="w-full h-full object-cover block group-hover:scale-105 duration-300"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-sm text-cyan-700 font-medium">
          {recipeDetailsData
            ? recipeDetailsData?.recipe?.source
            : favoriteDetailsData
            ? favoriteDetailsData?.source
            : "by you"}
        </span>
        <h3 className="font-bold text-2xl truncate text-black">
          {recipeDetailsData
            ? recipeDetailsData?.recipe?.label
            : favoriteDetailsData
            ? favoriteDetailsData?.label
            : customDetailsData?.title}
        </h3>
        <div className="flex flex-row gap-5">
          {recipeDetailsData || favoriteDetailsData ? (
            <button
              onClick={() =>
                window.open(
                  recipeDetailsData?.recipe?.url || favoriteDetailsData?.url
                )
              }
              className="p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block shadow-md bg-black text-white"
            >
              Instructions
            </button>
          ) : (
            <button
              onClick={() => navigate(`/create-recipe/${customDetailsData.id}`)}
              className="p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block shadow-md bg-black text-white"
            >
              Update
            </button>
          )}

          {recipeDetailsData || favoriteDetailsData ? (
            <button
              onClick={() => {
                !favoriteDetailsData
                  ? createFavoriteRecipe(
                      recipeDetailsData?.recipe?.label,
                      recipeDetailsData?.recipe?.ingredientLines,
                      recipeDetailsData?.recipe?.source,
                      recipeDetailsData?.recipe?.url,
                      recipeDetailsData?.recipe?.uri,
                      recipeDetailsData?.recipe?.image
                    )
                  : removeFavorite();
              }}
              className="p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block shadow-md bg-black text-white"
            >
              {favoriteDetailsData
                ? "Remove from favorites"
                : "Add to favorites"}
            </button>
          ) : (
            <button
              onClick={removeCustom}
              className="p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block shadow-md bg-black text-white"
            >
              Delete
            </button>
          )}
        </div>
        <div>
          <span className="text-2xl font-semilbold text-black">
            Ingredients:
          </span>
          {recipeDetailsData ? (
            <ul className="flex flex-col gap-3">
              {recipeDetailsData?.recipe?.ingredients.map((ingredient) => (
                <li>
                  <span className="text-2xl font-semilbold text-black">
                    {ingredient.text}
                  </span>
                </li>
              ))}
            </ul>
          ) : favoriteDetailsData ? (
            <ul className="flex flex-col gap-3">
              {favoriteDetailsData?.ingredients.map((ingredient) => (
                <li>
                  <span className="text-2xl font-semilbold text-black">
                    {ingredient}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="list-disc pl-5">
              {customDetailsData?.ingredients
                ?.split("\n")
                .filter((line) => line.trim() !== "") // skip empty lines
                .map((line, index) => (
                  <li
                    key={index}
                    className="text-2xl font-semilbold text-black"
                  >
                    {line}
                  </li>
                ))}
            </ul>
          )}
        </div>
        {customDetailsData && (
          <div>
            <span className="text-2xl font-semilbold text-black">
              Instructions:
            </span>
            <ul className="list-disc pl-5">
              {customDetailsData?.instructions
                ?.split("\n")
                .filter((line) => line.trim() !== "") // skip empty lines
                .map((line, index) => (
                  <li
                    key={index}
                    className="text-2xl font-semilbold text-black"
                  >
                    {line}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
