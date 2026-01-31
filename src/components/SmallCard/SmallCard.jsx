import { useState } from "react";
import "./SmallCard.scss"

export default function SmallCard({card}){
    const link = `/?id=${card.id}`
    
    return(
        <a href={link}>
            <div className="small-card__wrapper">
                <img src={card.imgUrl} alt="Food IMG" />
                <div className="overlay">
                    <span>{card.name}</span>
                </div>
                <div className="small-card__text">
                    <h4>{card.category}</h4>
                </div>
            </div>
        </a>
    );
}