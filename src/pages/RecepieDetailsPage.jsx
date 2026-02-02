import { useParams, Navigate } from "react-router-dom";

export default function RecepieDetailsPage(){
    const { id } = useParams();

    if(!id){
        return <Navigate to="/recepies" replace />
    }
    
    return(
        <div>
            <h1>Recipe Details</h1>
            <p>Recipe ID: {id}</p>
        </div>
    );
}