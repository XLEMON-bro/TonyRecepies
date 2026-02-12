import { useEffect, useMemo, useRef, useState } from "react";
import App from "../components/App";
import Search from "../components/Search/Search";
import ListComponent from "../components/ListComponents/ListComponent";
import { apiHelper } from "../apiHelper/http";
import SmallCard from "../components/SmallCard/SmallCard";

export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  
  useEffect(()=>{

    async function getCardsData(){
      let response = await apiHelper.get("https://localhost:7210/api/home/sections?topCategories=4&recipesPerCategory=1");
      console.log(response);

      if(response.status == 200){
        let cardsData = response.data.flatMap((group) => 
          group.recipes.map((r) => ({
            id: r.id,
            categoryName: group.category.name,
            categoryId: group.category.id,
            imgUrl: r.mainImageUrl,
            recepieName: r.title,
          }))
        );

        setCards(cardsData);
        setCardsLoading(false);
      }
    };

    getCardsData();
  }, []);


  return (
    <div>
      <h1>Tony Recepies</h1>
      <Search />
      {!cardsLoading && cards.length > 0 && 
        (<ListComponent header={"Popular Recepies"}>
          {cards.map((card) => (<SmallCard key={card.id} card={card}/>))}
        </ListComponent>)
        }
    </div>
  );
}
