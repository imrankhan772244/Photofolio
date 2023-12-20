import './App.css';
import Navbar from './components/Navbar';
import { AlbumList } from './components/AlbumList';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../src/css/app.module.css"
function App() {
  return (
    <div className="App">
     <ToastContainer />
     <Navbar />
     <div className="content">
        <AlbumList />
      </div>
    </div>
  );
}

export default App;
