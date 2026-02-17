import { useSearchParams, Navigate } from "react-router-dom";
import RecepieCard from "../components/RecepieCard/RecepieCard";
import { useEffect, useState } from "react";
import { apiHelper } from "../apiHelper/http";
import { buildUrl } from "../apiHelper/buildUrl";
import ListComponent from "../components/ListComponents/ListComponent";
import Search from "../components/Search/Search";
import Pagination from "../components/Pagination/Pagination";

export default function RecepiesPage(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [recipesData, setrecipesData] = useState({});
    const name = searchParams.get("name"); 
    const categoryId = searchParams.get("categoryId");
    const page = Number(searchParams.get("page") ?? 1);
    const [dataIsLoading, setDataIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(page);
    const params = new URLSearchParams(searchParams);

    useEffect(() => {
        console.log("rendered details");

        async function getCards(){
            let url = buildUrl("https://localhost:7210/api/recipes", {name: name, categoryId: categoryId, page: currentPage, pageSize: 8})
            let response = await apiHelper.get(url);
            console.log(response);

            params.set("page", currentPage.toString());
            setSearchParams(params);

            if(response.status == 200){
                setrecipesData(response.data);
                setDataIsLoading(false);
            }
        };

        getCards();

    }, [categoryId, name, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    },[name, categoryId]);

    return(
        <div>
            <Search/>
            <h1>Recipes</h1>

            { dataIsLoading  ? 
                <div>Loading...</div>  : 
                (
                <>
                    <ListComponent>
                        {recipesData.items.map((card) => (<RecepieCard key={card.id} recepie={card}></RecepieCard>))}
                    </ListComponent>
                    <Pagination
                        currentPage={currentPage}
                        numberOfPages={Math.ceil(recipesData.totalCount / recipesData.pageSize)}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </>
                )

            }
        </div>
    );
}