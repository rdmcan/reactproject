import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import theme from "./theme";
import pic from "./images/pic.png";

const HomeComponent = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <div
        className="center"
        style={{
          marginTop: "0vh",
        }}
      >
        <img src={pic} alt="Company Logo" height={200} width={360} />
      </div>
      <Typography
        variant="h6"
        color="primary"
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginTop: "3vh",
          marginBottom: "3vh",
        }}
      >
        World Wide Travel Alerts
      </Typography>
    </MuiThemeProvider>
  );
};

export default HomeComponent;
