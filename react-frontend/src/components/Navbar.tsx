import { FunctionComponent } from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import DriverIcon from '@mui/icons-material/DriveEta';

export const Navbar: FunctionComponent = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <DriverIcon />
        </IconButton>
        <Typography variant="h6">Code Delivery - Desafio</Typography>
      </Toolbar>
    </AppBar>
  );
};