import { useState ,useEffect } from 'react';
import styles from '../css/albumList.module.css';
import { toast } from "react-toastify";
import Spinner from 'react-spinner-material';
import photos from '../assets/photos.png';
import trashicon from "../assets/trash-bin.png"
import editicon from "../assets/edit.png"
//firebase imports
import{collection,getDocs,addDoc,Timestamp,query,orderBy,deleteDoc,doc, setDoc} from "firebase/firestore";
import {db} from '../firebaseinit';

//component imports
import { AlbumForm } from './AlbumForm';
import { ImageList } from './ImageList';

//mock data
//import { albumsdata} from '../../static/mock';

export const AlbumList=()=>{
    //array for locally adding the values
    const [albums, setAlbums]=useState([]);

    //state to show to loading icon
    const [loading, setLoading]=useState(false);

    const [albumAddLoading, setAlbumAddLoading]=useState(false);

    const [updateAlbumIntent,setUpdateAlbumIntent]=useState(false);
    //function for initial fetching data
    const getAlbums=async()=>{
        setLoading(true);
        const albumsRef=collection(db,"albums");
        const albumsSnapShot=await getDocs(
            query(albumsRef,orderBy("created","desc"))
        );
        const albumData=albumsSnapShot.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
        }));
        console.log(albumData,"this is album in get function!!!");
        setAlbums(albumData);
        setLoading(false);
    }
    useEffect(()=>{
        getAlbums();
    },[]);

    //adding new album
    const handleAdd=async (name)=>{
        if(albums.find((a)=> a.name=== name))
        return toast.error("Album name already in use");

        setAlbumAddLoading(true);
        const albumRef=await addDoc(collection(db,"albums"),{
            name,
            created: Timestamp.now(),
        });
        setAlbums((prev)=> [{id: albumRef.id,name},...prev]);
        setAlbumAddLoading(false);
        toast.success("Albums Added Successfully.");
    };

    //function for album name update
    // const handleUpdate=async (title,id)=>{
    //     setAlbumAddLoading(true);
    //     console.log("id",id);
    //     if(title){
    //         console.log("inside if block")
    //     const albumRef=doc(db,"albums",id);
    //     console.log(albumRef);

    //     await setDoc(albumRef,{name:title});

    //     const updatedAlbum=albums.map((album)=>{
    //         if(album.id === id)
    //         return {id:albumRef.id,name:title}
    //         return album;
    //     })
    //     console.log(updatedAlbum,"this is updated album!!!")
    //     console.log(albums,"this is the original album");
    //     setAlbums(updatedAlbum);
    //     toast.success("Album Name Updated");
    // }else{
    // console.log("inside else block")
    // toast.error("Album name not Updated!")
    // }
    //     setAlbumAddLoading(false);
    // }
    const handleUpdate = async (title, id) => {
  setAlbumAddLoading(true);

  if (title) {
    const albumRef = doc(db, "albums", id);

    await setDoc(albumRef, { name: title,created: Timestamp.now() }); // Use 'name' instead of 'title' in the setDoc function

    const updatedAlbums = albums.map((album) => {
      if (album.id === id) {
        return { id: albumRef.id, name: title };
      }
      return album;
    });

    setAlbums(updatedAlbums);
    toast.success("Album Name Updated");
  } else {
    toast.error("Album name not Updated!");
  }

  setAlbumAddLoading(false);
};


    //state for changing the button text and css of add album button
    const [createAlbumIntent, setCreateAlbumIntent]=useState(false);
    //state for checking which album is currntly active
    const [activeAlbum, setActiveAlbum]=useState(null);

    const [activeHoverAlbumIndex,setActiveHoverAlbumIndex]=useState(null);

    //function for changing the curent active album
    const handleClick=(name)=>{
        if(activeAlbum ===name) return setActiveAlbum(null);
        setActiveAlbum(name);
    }

    //delete album funcitonality
    const handleDelete=async(e,id)=>{
        // console.log(id);
        e.stopPropagation();

        await deleteDoc(doc(db,"albums",id));
        const filteredalbum=albums.filter((i)=> i.id !== id);
        setAlbums(filteredalbum);
    toast.success("Album deleted successfully.");
    }

    //function to come out of a album
    const handleBack=()=>{setActiveAlbum(null)};

    //condition for checking the album is present in list or not
    if(albums.length === 0 && !loading){
        return(
            <>
                <div className={styles.top}>
                    <h3>No Albums Found.</h3>
                    <button className={`${createAlbumIntent && styles.active}`} onClick={()=> setCreateAlbumIntent(!createAlbumIntent)}>
                        {!createAlbumIntent ? "Add Album" : "Cancel"}
                    </button>
                </div>
                {createAlbumIntent && <AlbumForm onAdd={handleAdd} />}
            </>
        )
    }

    //if loading the album the show the spinner
    if(loading){
        return(
            <div className={styles.loader}>
                <Spinner color='#0077ff'></Spinner>
            </div>
        )
    }

    //returning the simple jsx
    return(
        <>
        {/* checking if clicked on add album checking there should be not album active now */}
            {(createAlbumIntent || updateAlbumIntent) && !activeAlbum && (
                <AlbumForm loading={albumAddLoading} onAdd={handleAdd} onUpdate={handleUpdate} updateIntent={updateAlbumIntent}/>
            )}

            {!activeAlbum && (
                <div>
                    <div className={styles.top}>
                        <h3>Your albums</h3>
                        {updateAlbumIntent &&(
                            <button className={styles.active} onClick={()=> setUpdateAlbumIntent(false)}>
                                 Cancel
                             </button> )}
                        {!updateAlbumIntent && (
                        <button className={`${createAlbumIntent && styles.active}`} onClick={()=> setCreateAlbumIntent(!createAlbumIntent)}>
                            {!createAlbumIntent ? "Add Album" : "Cancel"}
                        </button>
                        )}
                    </div>
                    <div className={styles.albumsList}>
                        {albums.map((album,i)=>(
                            <div key={album.id}
                            className={styles.album}
                            onMouseOver={()=> setActiveHoverAlbumIndex(i)}
                            onMouseOut={()=> setActiveHoverAlbumIndex(null)}
                            onClick={()=>handleClick(album.name)}>
                            <div className={styles.icon}>
                            {/* update icon */}
                            <div className={`${styles.update} ${
                                activeHoverAlbumIndex === i && styles.active}`} 
                                onClick={(e)=>{e.stopPropagation(); setUpdateAlbumIntent(album)} }>
                                    <img src={editicon} alt='edit' />
                                </div>
                            {/* delete button added */}
                            <div className={`${styles.delete} ${
                               activeHoverAlbumIndex === i && styles.active
                            }`} onClick={(e)=>handleDelete(e,album.id)}>
                                <img src={trashicon} alt='delete' />
                            </div>
                            </div>
                                <img src={photos} className={styles.images} alt='images'/>
                                <span>{album.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeAlbum && (
                <ImageList
                    albumId={albums.find((a)=> a.name=== activeAlbum).id}
                    albumName={activeAlbum}
                    onBack={handleBack}
                />
            )}
        </>
    )

}