import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Card, CardContent, Typography, TextField } from "@material-ui/core";
import { useState, useReducer, useEffect } from "react";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import HomeComponent from "./homeComponent";

const ListAdvisories = (props) => {
  const initialState = {
    msg: "",
    selectedOptions: "", // drop down list option
    tvlrData: [], // array traveller's data: name, country, alert
    regions: [], // array with all regions
    subregions: [], // array with all subregions
    selectTvlr: [], // array with selected traveller countries
    selRegions: [], // array with selected regions
    selSubRegions: [], // array with selected sub-regions
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  // Traveller state
  const [traveller, setTraveller] = useState("");
  const [option, setOption] = useState(""); // Radio button selector

  // Snackbar Handler
  const propsHandler = (data) => {
    props.passState(true);
    props.passChildData(data);
  };

  // Autocomplete get travel, region or subregion
  const dropListHandler = (value) => {
    switch (value) {
      case "traveller":
        return state.tvlrData;
      case "region":
        return state.regions;
      case "subregion":
        return state.subregions;
      default:
        return state.tvlrData;
    }
  };

  // useEffect get travellers data when loading
  useEffect(() => {
    getTravellers();
    getRegions();
    getSubRegions();
    propsHandler("Travellers, Regions and Sub-regios loaded");
    setOption("traveller");
  }, []);

  // drop down event handler
  const handleChange = (e, selectedOption) => {
    selectedOption ? setTraveller(selectedOption) : setState({ msg: "" });
  };

  // useEffect radio button
  useEffect(() => {
    if (option === "traveller" || option === "") {
      getTvlrData(traveller);
    } else if (option === "region") {
      getAlertRegions(traveller);
    } else {
      getAlertSubRegions(traveller);
    }

    console.log(option);
  }, [traveller]);

  useEffect(() => {
    propsHandler(`found ${state.tvlrData.length} travellers`);
  }, [state.tvlrData]);

  // get traveller's Data //1
  const getTravellers = async () => {
    try {
      // const GRAPHURL = "http://localhost:5000/graphql";
      const GRAPHURL = "/graphql";

      const headers = {
        "Content-Type": "application/json",
      };
      const graphqlQuery = {
        query: `query{travellersName{name, country, text, date}}`,
      };

      const response = await axios({
        url: GRAPHURL,
        method: "POST",
        headers: headers,
        data: graphqlQuery,
      });

      const tvlrNames = response.data.data.travellersName.map(
        (item) => item.name
      );

      // remove duplicates
      const tvlrUnique = [...new Set(tvlrNames)];
      setState({
        tvlrData: tvlrUnique,
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  useEffect(() => {
    console.log(state.selectTvlr);
  }, [state.selectTvlr]);

  // get traveller' Info
  const getTvlrData = async (tvrlName) => {
    try {
      // const GRAPHURL = "http://localhost:5000/graphql";
      const GRAPHURL = "/graphql";

      const headers = {
        "Content-Type": "application/json",
      };
      const graphqlQuery = {
        operationName: "fetchTvlr",
        query: `query fetchTvlr ($name: String) {travellerInfo(name: $name) {_id, name, country, text, date}}`,
        variables: { name: tvrlName },
      };

      const response = await axios({
        url: GRAPHURL,
        method: "POST",
        headers: headers,
        data: graphqlQuery,
      });
      propsHandler(
        `found ${response.data.data.travellerInfo.length} alerts for ${tvrlName}`
      );

      setState({
        selectTvlr: response.data.data.travellerInfo,
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  // get Regions data //1
  const getRegions = async () => {
    try {
      // const GRAPHURL = "http://localhost:5000/graphql";
      const GRAPHURL = "/graphql";

      const headers = {
        "Content-Type": "application/json",
      };
      const graphqlQuery = {
        query: `query{regions}`,
      };

      const response = await axios({
        url: GRAPHURL,
        method: "POST",
        headers: headers,
        data: graphqlQuery,
      });

      const allRegions = response.data.data.regions;
      const regionsArr = [];

      for (let index = 1; index < allRegions.length; index++) {
        regionsArr.push(allRegions[index]);
      }

      setState({
        regions: regionsArr,
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  useEffect(() => {
    console.log(state.selRegions);
  }, [state.selRegions]);

  // get alerts for Regions
  const getAlertRegions = async (value) => {
    try {
      // const GRAPHURL = "http://localhost:5000/graphql";
      const GRAPHURL = "/graphql";

      const myHeaders = {
        "Content-Type": "application/json",
      };

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          query: `query($region: String) {alertsforregion(region: $region) {name, text}}`,
          variables: { region: value },
        }),
      });

      let res = await response.json();
      propsHandler(
        `found ${res.data.alertsforregion.length} regions for ${value}`
      );
      setState({
        selRegions: res.data.alertsforregion,
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  // get Sub-Regions //1
  const getSubRegions = async () => {
    try {
      // const GRAPHURL = "http://localhost:5000/graphql";
      const GRAPHURL = "/graphql";

      const headers = {
        "Content-Type": "application/json",
      };
      const graphqlQuery = {
        query: `query{subregions}`,
      };

      const response = await axios({
        url: GRAPHURL,
        method: "POST",
        headers: headers,
        data: graphqlQuery,
      });

      const allsubRegions = response.data.data.subregions;

      const subRegionsArr = [];

      for (let index = 1; index < allsubRegions.length; index++) {
        subRegionsArr.push(allsubRegions[index]);
      }

      setState({
        subregions: subRegionsArr,
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  useEffect(() => {
    console.log(state.selSubRegions);
  }, [state.selSubRegions]);

  // get alerts for Sub-Regions
  const getAlertSubRegions = async (value) => {
    try {
      // const GRAPHURL = "http://localhost:5000/graphql";
      const GRAPHURL = "/graphql";

      const myHeaders = {
        "Content-Type": "application/json",
      };

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          query: `query($subregion: String) {alertsforsubregion(subregion: $subregion) {name, text}}`,
          variables: { subregion: value },
        }),
      });

      let res = await response.json();
      propsHandler(
        `found ${res.data.alertsforsubregion.length} alerts for ${value}`
      );

      setState({
        selSubRegions: res.data.alertsforsubregion,
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  // Conditional rendering
  const condRendering = () => {
    if (option === "traveller" && traveller !== "") {
      return (
        <TableBody>
          <TableRow>
            <TableCell align="center">Country</TableCell>
            <TableCell align="center">Alert Information</TableCell>
          </TableRow>
          {state.selectTvlr.map((row) => (
            <TableRow
              key={row._id}
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
              <TableCell component="th" scope="row" align="center">
                {row.country}
              </TableCell>
              <TableCell align="left">
                {row.text}
                {` `}
                {row.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    } else if (option === "region") {
      return (
        <TableBody>
          <TableRow>
            <TableCell align="center">Country</TableCell>
            <TableCell align="center">Alert Information</TableCell>
          </TableRow>
          {state.selRegions.map((row) => (
            <TableRow
              key={row.name}
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
              <TableCell component="th" scope="row" align="center">
                {row.name}
              </TableCell>
              <TableCell align="left">{row.text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    } else if (option === "subregion") {
      return (
        <TableBody>
          <TableRow>
            <TableCell align="center">Country</TableCell>
            <TableCell align="center">Alert Information</TableCell>
          </TableRow>
          {state.selSubRegions.map((row) => (
            <TableRow
              key={row.name}
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
              <TableCell component="th" scope="row" align="center">
                {row.name}
              </TableCell>
              <TableCell align="left">{row.text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card>
        <HomeComponent />
        <Typography
          color="primary"
          style={{
            textAlign: "center",
            marginTop: "3vh",
            marginBottom: "1vh",
            color: "primary",
            fontWeight: "bold",
          }}
        >
          List Advisories By:
        </Typography>
        <RadioGroup
          style={{
            display: "flex",
            flexDirection: "row",
            marginLeft: 15,
          }}
          defaultValue="traveller"
          aria-labelledby="radio-buttons-group-label"
          name="radio-buttons-group"
          onChange={(e) => setOption(e.target.value)}
        >
          <FormControlLabel
            value="traveller"
            control={<Radio />}
            label="Traveller"
          />
          <FormControlLabel value="region" control={<Radio />} label="Region" />
          <FormControlLabel
            value="subregion"
            control={<Radio />}
            label="Sub-Region"
          />
        </RadioGroup>
        <CardContent>
          <Autocomplete
            value={null}
            options={dropListHandler(option)}
            getOptionLabel={(option) => option}
            style={{ width: 250 }}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label={option}
                variant="outlined"
                fullWidth
              />
            )}
          />
          <p />
        </CardContent>
      </Card>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          {condRendering()}
        </Table>
      </TableContainer>
      <div>
        <Typography color="primary">{state.msg}</Typography>
      </div>
    </MuiThemeProvider>
  );
};

export default ListAdvisories;
