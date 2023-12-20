import styles from '../css/albumForm.module.css';
import { useEffect, useRef } from 'react';

export const AlbumForm = ({ onAdd, loading, onUpdate, updateIntent }) => {

    //input ref for albumname
    const albumNameInput = useRef();

    //function for clearing the input value 
    const handleclear = () => {
        albumNameInput.current.value = "";
    }

    //function for getting value from album for and sending back
    const handleSubmit = (e) => {
        e.preventDefault();
        const albumName = albumNameInput.current.value;
        if (!updateIntent)
            onAdd(albumName);
        else onUpdate(albumName,updateIntent.id )
        console.log("updatte intent!!!",albumName);
        handleclear();
    }

    const handleDefault=()=>{
        albumNameInput.current.value=updateIntent.name;
        console.log(updateIntent.id,"this is the id of updated intent!!!")
    }

    useEffect(()=>{
        if(updateIntent){
            handleDefault();
        }
    },[updateIntent])

    return (
        <div className={styles.albumForm}>
            <span>Create an Album</span>
            <form onSubmit={handleSubmit}>
                <input required placeholder='Album Name' ref={albumNameInput} autoFocus={true} spellCheck={false} />
                <button type='button' onClick={handleclear} disabled={loading}>
                    Clear
                </button>
                <button disabled={loading}>{!updateIntent? "Create":"Update"}</button>
            </form>
        </div>
    )
}