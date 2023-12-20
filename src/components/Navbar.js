import React from "react";
import img from '../assets/logo.png';
import styles from '../css/navbar.module.css';

function Navbar(){
    return(
        <div className={styles.navbar}>
            <div className={styles.logo} onClick={()=> window.location.replace('/')}>
                <img src={img} alt="logo"/>
                <span>PhotoFolio</span>
            </div>
        </div>
    )
}

export default Navbar;