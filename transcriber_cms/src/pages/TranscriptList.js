import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/transcriptList.css";
import { useAuthContext } from "../hooks/useAuthContext";

function TranscriptList() {
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    // Fetch transcripts data when component mounts
    axios
      .get(`${process.env.REACT_APP_API_URL}/transcripts/`, {
        headers: {
          //"Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((response) => {
        setTranscripts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching transcripts:", error);
        setLoading(false);
      });
  }, []);

  const handleDownload = (path) => {
    // Make a POST request to get the presigned URL
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/transcripts`,
        { path },
        {
          headers: {
            //  "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then((response) => {
        window.open(response.data);
      })
      .catch((error) => {
        console.error("Error fetching presigned URL:", error);
      });
  };

  return (
    <div>
      <h2>Transcripts</h2>
      <div className="transcript-list">
        {transcripts.map((transcript) => (
          <div key={transcript.fileName} className="transcript-container">
            <p
              className="filename"
              onClick={() => handleDownload(transcript.path)}
            >
              {transcript.fileName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TranscriptList;
