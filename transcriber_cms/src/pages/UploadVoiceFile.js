import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
//import NavBar from "../components/NavBar";
//import { useAuthContext } from "../hooks/useAuthContext";
import {
  Button,
  TextField,
  makeStyles,
  Container,
  Paper,
  Typography,
  Grid,
  InputLabel,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
  },
  field: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "block",
  },
  imageUpload: {
    display: "none",
  },

  button: {
    marginTop: theme.spacing(2),
  },
}));

const UploadVoiceFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useAuthContext();

  const classes = useStyles();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/transcripts/uploadVoiceFile",
        formData,
        {
          headers: {
            //  "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      alert(response.data);

      // You can handle the response from the server here
    } catch (error) {
      alert("Error:", error);
      // Handle error scenarios
    }
  };

  return (
    <Container className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Upload Voice File
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InputLabel htmlFor="fileInput" className={classes.field}>
              <Button
                component="label"
                color="primary"
                className={classes.button}
              >
                Attach Voice File
                <input
                  type="file"
                  id="fileInput"
                  //accept="image/*"
                  className={classes.imageUpload}
                  onChange={handleFileChange}
                />
              </Button>
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={6}>
            <form onSubmit={uploadFile}>
              {/* Add more form fields as needed */}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Upload Voice File
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UploadVoiceFile;
