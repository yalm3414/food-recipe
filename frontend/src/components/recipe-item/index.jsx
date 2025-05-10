import { Link } from "react-router-dom";

// This is used for all the recipe cards/items displayed in search, custom, and favorites

export default function RecipeItem({ item, type }) {
  // Gets uri id from edamam uri link
  // Need this when searching for specific recipe in Edamam api
  const getRecipeId = (uri) => {
    if (!uri) return ""; // Avoid calling split on undefined
    return uri.split("#").pop();
  };

  return (
    <div className="flex flex-col w-80 overflow-hidden p-5 bg-white/75 shadow-xl gap-5 border-2 rounded-2xl border-white">
      <div className="h-48 flex justify-center overflow-hidden items-center rounded-xl">
        <img
          src={
            type === "favorites"
              ? item?.image
              : // there is no image upload yet (Placeholder image)
              type === "custom"
              ? "/public/food_place_holder.png"
              : item?.recipe?.image
          }
          alt="recipe item"
          className="black w-full"
        />
      </div>
      <div>
        <span className="text-sm text-cyan-700 font-medium">
          {type === "favorites"
            ? item?.source
            : type === "custom"
            ? "by you"
            : item?.recipe?.source}
        </span>
        <h3 className="font-bold text-2xl truncate text-black">
          {type === "favorites"
            ? item?.label
            : type === "custom"
            ? item?.title
            : item?.recipe?.label}
        </h3>
        {/** Navigates to details page with there database id or uri
         *   So it can search the database or Edamam API for details for specific recipe
         */}
        <Link
          to={`/recipe-item/${
            type === "favorites"
              ? "favorites/"
              : type === "custom"
              ? "custom/"
              : "public/"
          }${
            type === "favorites"
              ? item?.id
              : type === "custom"
              ? item?.id
              : getRecipeId(item?.recipe?.uri)
          }`}
          className="text-sm p-3 mt-5 px-8 rounded-lg uppercase font-medium tracking-wider inline-block shadow-md bg-black text-white"
        >
          Recipe Details
        </Link>
      </div>
    </div>
  );
}
