import React from "react";
import App from "../components/App";
import Search from "../components/Search/Search";

export default function HomePage() {
  return (
    <div>
      <h1>TonyRecepies</h1>
      <p>Home page (public). Later we’ll show featured recipes, search, categories, etc.</p>
      <Search />
      
    </div>
  );
}
