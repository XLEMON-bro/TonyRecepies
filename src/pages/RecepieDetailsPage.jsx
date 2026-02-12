import { useParams, Navigate } from "react-router-dom";
import { apiHelper } from "../apiHelper/http";
import { useEffect, useState } from "react";

export default function RecepieDetailsPage(){
    const { id } = useParams();
    const [recipeDetailsLoading, setrecipeDetailsLoading] = useState(true);
    const [recipeDetails, setRecipeDetails] = useState({});

    useEffect(() => {
        async function getRecipeDetails(){
        let response = await apiHelper.get(`https://localhost:7210/api/recipes/${id}`);
        console.log(response);
            
        if(response.status == 200){
            setRecipeDetails(response.data);
            setrecipeDetailsLoading(false);
        }
    };

    getRecipeDetails();

    }, []);


    if(!id){
        return <Navigate to="/recepies" replace />
    }
    
    return(
        <>{ !recipeDetailsLoading &&
        (<div>
            <h1>Recipe Details</h1>
            <p>Recipe ID: {recipeDetails.recipe.id}</p>
            <p>Recipe Name: {recipeDetails.recipe.title}</p>
            <p>Recipe Views: {recipeDetails.recipe.views}</p>
            <img src={recipeDetails.recipe.mainImageUrl} alt="Food IMG" />
            { recipeDetails.recipe.videoUrl &&
            (<iframe width={ "320px" } height={ "240px" } 
                src={recipeDetails.recipe.videoUrl}>
            </iframe>)}
        </div>)}
        </>
    );
}