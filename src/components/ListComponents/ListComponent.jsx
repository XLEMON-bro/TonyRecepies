import "./ListComponent.scss"

export default function ListComponent({header, children}){
    return(
        <>
            <div className="small-card-header">
                <h2>{header}</h2>
            </div>
            <div className="small-card-grid">
                {children}
            </div>
        </>
    );
}