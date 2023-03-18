import React from 'react';
import Content from './components/Content';
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "./theme"

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Content />
    </MuiThemeProvider>
  );
}

export default App;
