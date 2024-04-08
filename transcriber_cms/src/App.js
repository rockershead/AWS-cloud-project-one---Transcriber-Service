import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
//import Login from "./pages/Login";
//import Register from "./pages/Register";
//import ForgotPassword from "./pages/ForgotPassword";
import UploadVoiceFile from "./pages/UploadVoiceFile";
import TranscriptList from "./pages/TranscriptList";
//import ProductList from "./pages/ProductList";
//import NewPassword from "./pages/NewPassword";
//import Cart from "./pages/Cart";

//import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  //const { user, isLoading } = useAuthContext();

  //if (isLoading) {
  // Render a loading indicator while isLoading is true
  // return <p>Loading...</p>;
  //}

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/uploadvoicefile"
            element={<UploadVoiceFile />}
            //element={user ? <UploadProduct /> : <Navigate to="/login" />}
          />
          <Route
            path="/transcriptlist"
            element={<TranscriptList />}
            //element={user ? <UploadProduct /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
