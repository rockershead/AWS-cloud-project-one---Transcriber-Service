import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  BrowserRouter,
} from "react-router-dom";

import UploadVoiceFile from "./pages/UploadVoiceFile";
import TranscriptList from "./pages/TranscriptList";
import Login from "./pages/Login";

import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    //Render a loading indicator while isLoading is true
    return <p>Loading...</p>;
  }

  return (
    <Container style={{ width: "400px" }}>
      <Row>
        <Col>
          <BrowserRouter>
            <Routes>
              <Route
                path="/uploadvoicefile"
                //element={<UploadVoiceFile />}

                element={user ? <UploadVoiceFile /> : <Navigate to="/login" />}
              />
              <Route
                path="/transcriptlist"
                //element={<TranscriptList />}

                element={user ? <TranscriptList /> : <Navigate to="/login" />}
              />
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
