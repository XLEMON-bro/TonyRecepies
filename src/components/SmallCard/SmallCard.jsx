import { useState } from "react";
import { Link } from "react-router-dom";
import "./SmallCard.scss"

export default function SmallCard({card}){
    const link = `recepies?category=${card.category}`
    
    return(
        <Link className="recepie-link" to={link}>
            <div className="small-card__wrapper">
                <img src={card.imgUrl} alt="Food IMG" />
                <div className="overlay">
                    <span>{card.name}</span>
                </div>
                <div className="small-card__text">
                    <h4>{card.category}</h4>
                </div>
            </div>
        </Link>
    );
}