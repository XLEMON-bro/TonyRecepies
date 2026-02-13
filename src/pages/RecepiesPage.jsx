import { useSearchParams, Navigate } from "react-router-dom";
import RecepieCard from "../components/RecepieCard/RecepieCard";
import { useEffect, useState } from "react";
import { apiHelper } from "../apiHelper/http";
import { buildUrl } from "../apiHelper/buildUrl";
import ListComponent from "../components/ListComponents/ListComponent";
import Search from "../components/Search/Search";

export default function RecepiesPage(){
    const [searchParams] = useSearchParams();
    const [cards, setCards] = useState([]);
    const name = searchParams.get("name"); 
    const categoryId = searchParams.get("categoryId"); 
    const page = Number(searchParams.get("page") ?? 1);
    const [dataIsLoading, setDataIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(page)
    //Todo fetch data for recipes by name or categoryId (deepends what we get from params)
    //Add pagination for pages at the bottom of page
    //Add search at the top

    useEffect(() => {
        console.log("rendered details");

        async function getCards(){
            let url = buildUrl("https://localhost:7210/api/recipes", {name: name, categoryId: categoryId, page: currentPage})
            let response = await apiHelper.get(url);
            console.log(response);

            if(response.status == 200){
              let cardsData = response.data.items;

              setCards(cardsData);
              setDataIsLoading(false);
            }
        };

        getCards();

    }, [categoryId, name, page]);

    return(
        <div>
            <Search/>
            <h1>Recipes</h1>
            
            {categoryId && <p>Filtering by category: {categoryId}</p>}
            {name && <p>Filtering by name: {name}</p>}
            <p>Page: {page}</p>

            { dataIsLoading && cards.length > 0 ? 
                <div>Loading...</div>  : 
                <ListComponent>
                    {cards.map((card) => (<RecepieCard key={card.id} recepie={card}></RecepieCard>))}
                </ListComponent>
            }
        </div>
    );
}