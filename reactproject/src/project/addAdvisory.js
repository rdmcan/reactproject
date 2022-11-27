import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import theme from "./theme";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import Box from "@mui/material/Box";
import HomeComponent from "./homeComponent";

const AddAdvisory = (props) => {
  // Initial State
  const initialState = {
    msg: "",
    namesctry: [],
    name: "",
    country: "",
    alert: "",
    date: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  // Snackbar Handler
  const propsHandler = (data) => {
    props.passState(true);
    props.passChildData(data);
  };

  const fetchUsers = async () => {
    try {
      propsHandler("Attempting to load users from server...");

      // const GRAPHURL = "http://localhost:5000/graphql";
      const GRAPHURL = "/graphql";
      const headers = {
        "Content-Type": "application/json",
      };

      const graphqlQuery = {
        query: `{alerts{name}}`,
      };

      const response = await axios({
        url: GRAPHURL,
        method: "POST",
        headers: headers,
        data: graphqlQuery,
      });

      setTimeout(() => {
        propsHandler("User data loaded");
      }, 3000);

      setState({
        namesctry: response.data.data.alerts.map((obj) => obj.name).sort(),
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  }; // end fetchUsers

  // Load Country names
  useEffect(() => {
    fetchUsers();
  }, []);

  const onChange = (e, selectedOption) => {
    selectedOption
      ? setState({ country: selectedOption })
      : setState({ msg: "" });
  };

  const handleNameInput = (e) => {
    setState({ name: e.target.value });
  };

  // get country's alert
  const getAlert = async (country) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // const GRAPHURL = "http://localhost:5000/graphql";
    const GRAPHURL = "/graphql";
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          query: `query ($name: String) {findAlert(name: $name) {text}}`,
          variables: { name: country },
        }),
      });
      let json = await response.json();
      const today = new Date();
      setState({ alert: json.data.findAlert.text, date: today });
    } catch (error) {
      console.log(error);
    }
  };

  // Create new user in the db
  const sendUserData = async () => {
    try {
      // Add user
      const headers = {
        "Content-Type": "application/json",
      };

      if (state.alert !== "") {
        // eslint-disable-next-line
        // const GRAPHURL = "http://localhost:5000/graphql";
        const GRAPHURL = "/graphql";
        let response = await fetch(GRAPHURL, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            query: `mutation($name: String, $country: String, $text: String, $date: String){addOneTraveller(name: $name, country: $country, text: $text, date: $date) {name, country, text, date }}`,
            variables: {
              name: state.name,
              country: state.country,
              text: state.alert,
              date: state.date,
            },
          }),
        });
      }
      propsHandler(`added advisory on ${state.date}`);
    } catch (error) {
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  // Add new traveller user
  const onAddClicked = () => {
    sendUserData();
  };

  useEffect(() => {
    getAlert(state.country);
  }, [onAddClicked]);

  const emptyorundefined =
    state.name === undefined ||
    state.name === "" ||
    state.country === undefined ||
    state.country === "";

  return (
    <MuiThemeProvider theme={theme}>
      <Card>
        <HomeComponent />
        <Typography
          variant="h6"
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#0B4E81",
          }}
        >
          Add Advisory
        </Typography>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "20ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            value={state.name}
            label="Traveller's name"
            variant="standard"
            onChange={handleNameInput}
            style={{ marginLeft: 85 }}
          />
        </Box>
        <CardContent>
          <Autocomplete
            options={state.namesctry}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            onChange={onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Countries"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <p />
          <div>
            <Typography color="primary">{state.msg}</Typography>
          </div>
        </CardContent>
        <div>
          <Grid container justifyContent="center">
            <Button
              color="primary"
              variant="contained"
              onClick={() => onAddClicked()}
              disabled={emptyorundefined}
            >
              ADD ADVISORY
            </Button>
          </Grid>
        </div>
        <br />
      </Card>
    </MuiThemeProvider>
  );
};

export default AddAdvisory;
