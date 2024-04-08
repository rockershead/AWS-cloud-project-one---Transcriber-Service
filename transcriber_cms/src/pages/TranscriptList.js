import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/transcriptList.css";

function TranscriptList() {
  const [transcripts, setTranscripts] = useState([]);

  const userId = "9dd2999b9ee24788ba9d1fbaf9e7d934"; //for testing

  useEffect(() => {
    // Fetch transcripts data when component mounts
    axios
      .get(`${process.env.REACT_APP_API_URL}/transcripts/${userId}`)
      .then((response) => {
        setTranscripts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transcripts:", error);
      });
  }, []);

  const handleDownload = (path) => {
    // Make a POST request to get the presigned URL
    axios
      .post(`${process.env.REACT_APP_API_URL}/transcripts`, { path })
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
