import { useContext } from "react";
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-item";

export default function Home() {
  const { recipes, loading } = useContext(GlobalContext);
  const { searchResult, setSearchResult } = useContext(GlobalContext);

  if (loading) return <div>Loading... Please Wait!</div>;
  //console.log("searchParam:", searchParam);
  return (
    <div>
      {recipes && recipes.length > 0 ? (
        <div>
          <h1 className="font-extrabold lg:text-4xl text-xl text-black">
            Recipes For : {searchResult}
          </h1>
          <div className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
            {recipes.map((item) => (
              <RecipeItem item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="lg:text-4xl text-xl text-center text-black font-extrabold">
            Nothing here yet. Search for a recipe to start
          </p>
        </div>
      )}
    </div>
  );
}
