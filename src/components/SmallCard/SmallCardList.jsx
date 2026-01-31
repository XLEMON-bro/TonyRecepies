import "./SmallCardList.scss"
import SmallCard from "./SmallCard"

export default function SmallCardList({cardsData}){
    const cards = cardsData.map(card => <SmallCard key={card.id} card={card}/>)

    return(
        <div className="small-card-grid">
            {cards}
        </div>
    );
}