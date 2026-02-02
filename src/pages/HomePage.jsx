import React from "react";
import App from "../components/App";
import Search from "../components/Search/Search";
import SmallCardList from "../components/SmallCard/SmallCardList";
import { MOCK_SMALL_CARDS_DATA } from "../mockData/mockData";

export default function HomePage() {
  return (
    <div>
      <h1>Tony Recepies</h1>
      <Search />
      <SmallCardList cardsData={MOCK_SMALL_CARDS_DATA} header={"Popular Recepie Types"}/>
    </div>
  );
}
