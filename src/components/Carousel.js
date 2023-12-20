import styles from "../css/carousel.module.css";
export const Carousel=({onNext,onPrev,onCancel,url,title})=>{
return(
    <div className={styles.carousel}>
        <button onClick={onCancel}>X</button>
        <button onClick={onPrev}>{"<"}</button>
        <div className={styles.imagediv}>
        <img src={url} alt={title} />
        </div>
        <button onClick={onNext}>{">"}</button>
    </div>
)
}