import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Card, Typography } from "@material-ui/core";
import theme from "./theme";
import HomeComponent from "./homeComponent";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import axios from "axios";

const AlertComponent = (props) => {
  const initialState = {
    gotData: false,
    setupAlerts: [],
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
      propsHandler("Running setup...");
      // const GRAPHURL = "http://localhost:5000/graphql";
      const GRAPHURL = "/graphql";

      const headers = {
        "Content-Type": "application/json",
      };
      const graphqlQuery = {
        query: `query {setupalerts{results}}`,
      };

      const result = await axios({
        url: GRAPHURL,
        method: "POST",
        headers: headers,
        data: graphqlQuery,
      });

      const payload = result.data.data.setupalerts.results;

      // return the JSON to a variable called payload, then
      let resArr = [];
      resArr = payload.replace(/([.])\s*(?=[A-Z])/g, "$1|").split("|");

      setState({
        setupAlerts: resArr,
      });
      propsHandler("alerts collection setup completed");
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  }; // end fetchUsers

  useEffect(() => {
    fetchUsers();
  }, []);

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
          Alert Setup - Details
        </Typography>

        <br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableBody>
              {state.setupAlerts.map((row) => (
                <TableRow
                  key={row}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </MuiThemeProvider>
  );
};

export default AlertComponent;
