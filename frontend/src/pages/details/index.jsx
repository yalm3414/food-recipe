import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../context";
import axios from "axios";
import api from "../../api";
import React from "react";

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
      });
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
        if (err.response?.status === (404 || 500)) {
          setFavoriteDetailsData(null);
        }
      });
  }

  /* useEffect(() => {
    async function checkFavorite() {
      if (recipeDetailsData?.recipe?.uri) {
        try {
          //await new Promise((resolve) => setTimeout(resolve, 1000));
          const response = await api.get(
            `/api/favorite-recipes/by-uri/?uri=${encodeURIComponent(
              recipeDetailsData.recipe.uri
            )}`
          );
          setFavoriteDetailsData(response.data);
        } catch (err) {
          if (err.response?.status === 404) {
            setFavoriteDetailsData(null);
          } else {
            console.error("Error checking favorite:", err);
          }
        }
      }
    }

    checkFavorite();
  }, []); */

  useEffect(() => {
    if (recipeDetailsData?.recipe?.uri) {
      setFavoriteDetailsData(null);

      checkFavoriterecipe();
    }
  }, [recipeDetailsData?.recipe?.uri]);

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
        if (res.status === 201) alert("Recipe Favorited!");
        else alert("Failed to favorive Recipe.");
        console.log(res.data);
        setFavoriteDetailsData(null);
        checkFavoriterecipe();
      })
      .catch((err) => alert(err));
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
