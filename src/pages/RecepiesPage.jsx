import { useSearchParams, Navigate } from "react-router-dom";
import RecepieCard from "../components/RecepieCard/RecepieCard";

export default function RecepiesPage(){
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category"); // "pizza" | null
    const page = Number(searchParams.get("page") ?? 1);

    const recepie = {
        id: 24,
        name: "Burgers EL Hovnida",
        imgUrl: "https://media.istockphoto.com/id/1337797176/uk/%D1%84%D0%BE%D1%82%D0%BE/%D1%8F%D0%BB%D0%BE%D0%B2%D0%B8%D1%87%D1%96-%D0%B1%D1%83%D1%80%D0%B3%D0%B5%D1%80%D0%B8-%D0%B7-%D1%81%D0%BE%D1%83%D1%81%D0%BE%D0%BC-%D0%BF%D0%B5%D1%81%D1%82%D0%BE.jpg?s=2048x2048&w=is&k=20&c=dJd_zl9SD9xgOh4ial0H0WkvH0jpoAe8qdfG9MDTrRs=",
        timeToCook: "1h",
        difficulty: "MEDIUM",
        servings: 3,
        isFavourite: false,
    };

    return(
        <div>
            <h1>Recipes</h1>
            
            {category && <p>Filtering by category: {category}</p>}
            <p>Page: {page}</p>

            <RecepieCard
                recepie={recepie}
                onFavouriteChanged={(id, next) => {
                  console.log("Favourite changed:", id, next);
                }}
            />
        </div>
    );
}