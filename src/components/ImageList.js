import styles from "../css/imageList.module.css";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "react-spinner-material";
import backicon from "../assets/back.png";
import clearicon from "../assets/clear.png";
import editicon from "../assets/edit.png";
import trashicon from "../assets/trash-bin.png";
import warningicon from "../assets/warning.png";
import searchicon from "../assets/search.png";

//importing components
import { ImageForm } from "./ImageForm";
import { Carousel } from "./Carousel";

//firebase imports
import {
    getDocs, collection, addDoc, deleteDoc, setDoc, Timestamp
    , query, orderBy, doc
} from "firebase/firestore";
import { db } from "../firebaseinit";

//variable for storing images globally
let IMAGES;
export const ImageList = ({ albumId, albumName, onBack }) => {
    //array used to store image data locally
    const [images, setImages] = useState([]);
    //check the loading phase
    const [loading, setLoading] = useState(false);
    //variable for check of search box
    const [searchIntent, setSearchIntent] = useState(false);
    const searchInput = useRef();

    // async function for fetching data in starting
    const getImages = async () => {
        setLoading(true);
        const imagesRef = collection(db, "albums", albumId, "images");
        const imagesSnapshot = await getDocs(query(imagesRef, orderBy("created", "desc")));
        const imagesData = imagesSnapshot.docs.map((doc) => (
            {
                id: doc.id,
                ...doc.data(),
            }
        ));
        console.log(imagesData,"this is imagsData")
        console.log(imagesSnapshot,"this is snapshot")
        setImages(imagesData);
        IMAGES = imagesData;
        setLoading(false);
    }

    //calling the asyncronus function
    useEffect(() => {
        getImages();
    }, []);

    //state to check add image button is active or not
    const [addImageIntent, setAddImageIntent] = useState(false);
    //image loading state
    const [imageLoading, setImageLoading] = useState(false);

    //state to update image button
    const [updateImageIntent, setUpdateImageIntent] = useState(false);

    //state to store active image iindez
    const [activeImageIndex, setActiveImageIndex] = useState(null);

    // state to keep track of image on which we are hovering
    const [activeHoverImageIndex, setActiveHoverImageIndex] = useState(null);

    //next image function
    const handleNext = () => {
        if (activeImageIndex === images.length - 1) return setActiveImageIndex(0);
        setActiveImageIndex((prev) => prev + 1)
    }

    //previous image function
    const handlePrev = () => {
        if (activeImageIndex === 0) return setActiveImageIndex(images.length - 1);
        setActiveImageIndex((prev) => prev - 1)
    }

    //cancle image view buttoon
    const handleCancel = () => {
        setActiveImageIndex(null);
    }

    //handling the search functionality of ui turinig on or off
    const handleSearchClick = () => {
        if (searchIntent) {
            searchInput.current.value = "";
            getImages();
        }
        setSearchIntent(!searchIntent);
    }

    //searching for the images
    const handleSearch = () => {
        const query = searchInput.current.value;
        if (!query) return IMAGES;
        const filteredImages = IMAGES.filter((i) => i.title.includes(query));
        setImages(filteredImages);
    }

    //add images function
    const handleAdd = async ({ title, url }) => {
        setImageLoading(true);
        const imageRef = await addDoc(collection(db, "albums", albumId, "images"), {
            title,
            url,
            created: Timestamp.now(),
        });
        setImages((prev) => [{ id: imageRef.id, title, url }, ...prev]);

        toast.success("Image Added Succesfully.")
        setImageLoading(false);
    }

    //function for updating the image details
    const handleUpdate = async ({ title, url }) => {
        setImageLoading(true);
        const imageRef = doc(db, "albums", albumId, "images", updateImageIntent.id);

        await setDoc(imageRef, {
            title,
            url,
            created: Timestamp.now(),
        });
        const updatedImages = images.map((image) => {
            if (image.id === imageRef.id)
                return { id: imageRef.id, title, url };

            return image;
        })

        setImages(updatedImages);
        toast.success("Image Updated Successfully");
        setImageLoading(false);
        setUpdateImageIntent(false);
    }

    //function for deleting a image
    const handleDelete = async ( e, id ) => {
        console.log("stop");
        e.stopPropagation();
        await deleteDoc(doc(db, "albums", albumId, "images", id))
        const filteredImages = images.filter((i) => i.id !== id);
        setImages(filteredImages);

        toast.success("Images deleted Successfully");
    }

    //here we are checking that any image is present in the album and checking if user is trying to add any image
    // loading is not going on if all these tasks are not happeing then this data 
    //will be appeared
    if (images.length === 0 && !searchInput.current?.value && !loading) {
        return (
            <>
                <div className={styles.top}>
                    <span onClick={onBack}>
                        <img src={backicon} alt="back" />
                    </span>
                    <h3>No images Found in the album.</h3>
                    <button className={`${addImageIntent && styles.active}`}
                        onClick={() => setAddImageIntent(!addImageIntent)}>
                        {!addImageIntent ? "Add Image" : "Cancel"}
                    </button>
                </div>
                {/* if user is trying to add image then this will render */}
                {addImageIntent && (
                    <ImageForm loading={imageLoading}
                        onAdd={handleAdd}
                        albumName={albumName}
                    />
                )}
            </>
        )
    }

    // default return statement if data is present in the album
    return (
        <>
            {/* conditons to check whether image form to load and sending data to imageform */}
            {(addImageIntent || updateImageIntent) && (
                <ImageForm loading={imageLoading}
                    onAdd={handleAdd}
                    albumName={albumName}
                    onUpdate={handleUpdate}
                    updateIntent={updateImageIntent} />
            )}
            {/* sendinng data to carousel to go forward and backward */}
            {(activeImageIndex || activeImageIndex === 0) && (
                <Carousel title={images[activeImageIndex].title}
                    url={images[activeImageIndex].url}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onCancel={handleCancel}
                />
            )}
            {/* setting up the back button for default rendering */}
            <div className={styles.top}>
                <span onClick={onBack}>
                    <img src={backicon} alt="back" />
                </span>
                <h3>Images in {albumName}</h3>
                <div className={styles.search}>
                    {searchIntent && (
                        <input placeholder="search..."
                            onChange={handleSearch}
                            ref={searchInput}
                            autoFocus={true} />
                    )}

                    {/* search image icon */}
                    <img onClick={handleSearchClick}
                        src={!searchIntent ? searchicon : clearicon}
                        alt={!searchIntent ? "Search" : "Clear"}
                    />
                </div>
                {/* update Image form html */}
                {updateImageIntent && (
                    <button className={styles.active}
                        onClick={() => setUpdateImageIntent(false)}>Cancel</button>
                )}
                {/* doubts */}
                {!updateImageIntent && (
                    <button className={`${addImageIntent && styles.active}`}
                        onClick={() => setAddImageIntent(!addImageIntent)}>
                        {!addImageIntent ? "Add Image" : "Cancel"}
                    </button>
                )}
            </div>

            {/*Setting up the loader  */}
            {loading && (
                <div className={styles.loader}>
                    <Spinner color="#0077ff" />
                </div>
            )}

            {/* if not loading */}
            {!loading && (
                <div className={styles.imageList}>
                    {images.map((image, i) => (
                        <div key={image.id}
                            className={styles.image}
                            onMouseOver={() => setActiveHoverImageIndex(i)}
                            onMouseOut={() => setActiveHoverImageIndex(null)}
                            onClick={() => setActiveImageIndex(i)}
                        >
                            <div className={`${styles.update} ${activeHoverImageIndex === i && styles.active}`}
                                onClick={(e) => { e.stopPropagation(); setUpdateImageIntent(image) }}>
                                <img src={editicon} alt="update" />
                            </div>
                            <div className={`${styles.delete} ${activeHoverImageIndex === i && styles.active}`}
                                onClick={(e) => handleDelete(e, image.id)}>
                                <img src={trashicon} alt="delete" />
                            </div>
                            <img
                                src={image.url}
                                alt={image.title}
                                onError={({ currentTarget }) => {
                                    currentTarget.src =  warningicon ;
                                }} />
                            <span>{image.title.substring(0.20)}</span>
                        </div>

                    ))}
                </div>
            )}
        </>
    )

}