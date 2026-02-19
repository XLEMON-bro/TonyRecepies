import { useSearchParams, Navigate } from "react-router-dom";
import RecepieCard from "../components/RecepieCard/RecepieCard";
import { useEffect, useState } from "react";
import { apiHelper } from "../apiHelper/http";
import { buildUrl } from "../apiHelper/buildUrl";
import ListComponent from "../components/ListComponents/ListComponent";
import Search from "../components/Search/Search";
import Pagination from "../components/Pagination/Pagination";
import styles from "./RecepiesPage.module.scss";
import SelectionDropDown from "../components/SelectionDropDown/SelectionDropDown";

export default function RecepiesPage(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [recipesData, setrecipesData] = useState({});
    const name = searchParams.get("name"); 
    const categoryId = searchParams.get("categoryId");
    const page = Number(searchParams.get("page") ?? 1);
    const [cardsDataIsLoading, setCardsDataIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page") ?? 1));
    const params = new URLSearchParams(searchParams);
    const [categoriesData, setCategoriesData] = new useState({});
    const [categoriesDataIsLoading, setCategoriesDataIsLoading] = new useState(true);

    useEffect(() => {
        async function getCategories(){
            let url = buildUrl("https://localhost:7210/api/categories", {});
            let response = await apiHelper.get(url);

            console.log(response);

            if(response.status == 200){
                setCategoriesData(response.data);
                setCategoriesDataIsLoading(false);
            }
        }

        getCategories();
    }, []);

    useEffect(() => {
        async function getCards(){
            let url = buildUrl("https://localhost:7210/api/recipes", {name: name, categoryId: categoryId, page: currentPage, pageSize: 8})
            let response = await apiHelper.get(url);
            console.log(response);
            
            if(response.status == 200){
                setrecipesData(response.data);
                setCardsDataIsLoading(false);
            }
        };                    

        getCards();

    }, [categoryId, name, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    },[name, categoryId]);

    function handleSelectCategory(id){
        params.set("categoryId", id.toString());
        setSearchParams(params);
        params.set("page", 1);
        setSearchParams(params);
        setCurrentPage(1);
    }

    function handleSelectAllCategories(){
        setSearchParams({});
        setCurrentPage(1);
    }

    function pageChanged(page){
        setCurrentPage(page)
        params.set("page", page.toString());
        setSearchParams(params);
    }

    return(
        <div>
            <Search/>
            <h1>Recipes</h1>
            { cardsDataIsLoading  ? 
                <div>Loading...</div>  : 
                (
                <>
                    {(!categoriesDataIsLoading && recipesData?.items?.length > 0 ) && (            
                        <div className={styles.categorySelectionWrapper}>
                            <SelectionDropDown items={categoriesData} initialSelectedId={categoryId ? Number(categoryId) : null} onSelect={handleSelectCategory} onSelectAll={handleSelectAllCategories}/>
                        </div>
                    )}
                    <ListComponent>
                        {recipesData.items.map((card) => (<RecepieCard key={card.id} recepie={card}></RecepieCard>))}
                    </ListComponent>
                    <Pagination
                        currentPage={currentPage}
                        numberOfPages={Math.ceil(recipesData.totalCount / recipesData.pageSize)}
                        onPageChange={(page) => pageChanged(page)}
                    />
                </>
                )
            }
        </div>
    );
}