import "./SmallCardList.scss"
import SmallCard from "./SmallCard"

export default function SmallCardList({cardsData, header}){
    const cards = cardsData.map(card => <SmallCard key={card.id} card={card}/>)

    return(
        <>
            <div className="small-card-header">
                <h2>{header}</h2>
            </div>
            <div className="small-card-grid">
                {cards}
            </div>
        </>
    );
}