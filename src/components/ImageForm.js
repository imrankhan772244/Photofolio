import {useEffect, useRef } from "react"
import styles from "../css/imageForm.module.css"

export const ImageForm =({
    updateIntent,
    albumName,
    onAdd,
    onUpdate,
    loading
    })=>{
        //ref for fetching the value for name or title
        const imageTitleInput=useRef();
        //ref for fetching the value for url
        const imageUrlInput=useRef();

        //function for adding the image 
        const handleSubmit=(e)=>{
            e.preventDefault();
            const title=imageTitleInput.current.value;
            const url=imageUrlInput.current.value;

            if(!updateIntent) onAdd({title,url});
            else onUpdate({title,url});
            handleClear();
        }

        // function for clearing the inputs after submititng them
        const handleClear=()=>{
            imageTitleInput.current.value="";
            imageUrlInput.current.value="";
        }

        // funciton for loading the current value of image in form to edit them
        const handleDefaultValues=()=>{
            imageTitleInput.current.value=updateIntent.title;
            imageUrlInput.current.value=updateIntent.url;
        }

        //useEffect function to call the asynchronus tasks of code
        useEffect(()=>{
            if(updateIntent)handleDefaultValues();
        },[updateIntent]);

        return(
            <>
                <div className={styles.imageForm}>
                    <span>
                        {!updateIntent
                         ? `Add image to ${albumName}` :
                         `Update image ${updateIntent.title}`}
                    </span>

                    <form onSubmit={handleSubmit}>
                        <input required placeholder="Title" ref={imageTitleInput} autoFocus={true}/>
                        <input required placeholder="Image Url" ref={imageUrlInput} />
                        <div className={styles.actions}>
                            <button type="button" onClick={handleClear} disabled={loading}>Clear </button>
                            <button disabled={loading}>{!updateIntent ? "Add" : "Update"}</button>
                        </div>
                    </form>
                </div>
            </>
        )
}