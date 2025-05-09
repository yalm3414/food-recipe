import { NavLink } from "react-router-dom";
import { GlobalContext } from "../../context";
import { useContext } from "react";

export default function Navbar() {
  const { searchParam, setSearchParam, handleSubmit } =
    useContext(GlobalContext);

  console.log(searchParam);

  return (
    <nav className="flex justify-between items-center py-8 container mx-auto flex-col lg:flex-row gap-5 lg:gap:0">
      <h2 className="text-2xl font-bold ">
        <NavLink to={"/"}>Recipe Search</NavLink>
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          value={searchParam}
          onChange={(event) => setSearchParam(event.target.value)}
          placeholder="Enter Item..."
          className="bg-white/75 p-3 px-8 rounded-full outline-none lg:w-96 shadow-lg shadow-blue-100 focus:shadow-blue-200 "
        />
      </form>
      <ul className="flex gap-5">
        <li>
          <NavLink
            to={"/"}
            className="text-black font-semibold hover:text-gray-500 duration-300"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/custom-recipes"}
            className="text-black font-semibold hover:text-gray-700 duration-300"
          >
            Custom
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/favorites"}
            className="text-black font-semibold hover:text-gray-700 duration-300"
          >
            Favorites
          </NavLink>
        </li>
      </ul>
      <NavLink
        to={"/login"}
        className="text-sm p-3 mt-5  mx-auto rounded-lg uppercase font-medium tracking-wider inline-block shadow-md bg-black text-white"
      >
        Sign In
      </NavLink>
    </nav>
  );
}
