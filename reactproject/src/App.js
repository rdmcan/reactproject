import "./App.css";
import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Reorder from "@material-ui/icons/Reorder";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Snackbar,
} from "@material-ui/core";
import theme from "./project/theme";
import "./project/css/app.css";
import HomeComponent from "./project/homeComponent";
import AlertCompChild from "./project/alertcomponent";
import AddAdvisory from "./project/addAdvisory";
import ListAdvisories from "./project/listAdvisories";
import { Card } from "@material-ui/core";

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [childData, setChildData] = useState("");
  const [openSnack, setOpenSnack] = useState(false);

  // Snackbar handler
  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  // Toolbar handlers
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            TRAVEL ADVISORY
          </Typography>
          <IconButton
            onClick={handleClick}
            color="inherit"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <Reorder />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/home" onClick={handleClose}>
              Home
            </MenuItem>
            <MenuItem component={Link} to="/alertComp" onClick={handleClose}>
              Reset Alerts
            </MenuItem>
            <MenuItem component={Link} to="/addAdv" onClick={handleClose}>
              Add Advisory
            </MenuItem>
            <MenuItem component={Link} to="/listAdv" onClick={handleClose}>
              List Advisories
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div>
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route
            path="/home"
            element={
              <Card>
                <HomeComponent />
                <Typography
                  style={{
                    textAlign: "right",
                    fontSize: "smaller",
                    color: "#0B4E81",
                  }}
                >
                  @RUBENMEJIA - 2022
                </Typography>
              </Card>
            }
          />
          <Route
            path="/alertComp"
            element={
              <AlertCompChild
                passState={setOpenSnack}
                passChildData={setChildData}
              />
            }
          />
          <Route
            path="/addAdv"
            element={
              <AddAdvisory
                passState={setOpenSnack}
                passChildData={setChildData}
              />
            }
          />
          <Route
            path="/listAdv"
            element={
              <ListAdvisories
                passState={setOpenSnack}
                passChildData={setChildData}
              />
            }
          />
        </Routes>
      </div>
      <Snackbar
        open={openSnack}
        autoHideDuration={2500}
        message={childData}
        onClose={snackbarClose}
      />
    </MuiThemeProvider>
  );
}

export default App;
