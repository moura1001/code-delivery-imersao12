import { useEffect, useState, useRef, ChangeEvent, FormEvent, useCallback } from 'react';
import { Grid, Select, MenuItem, Button, makeStyles } from "@material-ui/core";
import { Route } from '../utils/models';
import { Navbar } from './Navbar';
import MyMap from './MyMap';

const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles({
    root: {
      width: "100%",
      height: "100%",
    },
    form: {
      margin: "16px",
    },
    btnSubmitWrapper: {
      textAlign: "center",
      marginTop: "8px",
    },
    map: {
      width: "100%",
      height: "100%",
    },
});

const Content = () => {
    
    const classes = useStyles();

    const [routes, setRoutes] = useState<Route[]>([]);
    const [routeIdSelected, setRouteIdSelected] = useState<string>("");
    //const ws = useRef(null);

    const handleSelectChange = (event: ChangeEvent<{ value: unknown }>): void => {
        setRouteIdSelected(event.target.value as string);
    };

    const startRoute = useCallback((event: FormEvent): void => {
        event.preventDefault();
        console.log(routeIdSelected)
    }, [routeIdSelected]);

    useEffect(() => {
        /*ws.current = new WebSocket("wss://ws.kraken.com/");
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");

        const wsCurrent = ws.current;

        return () => {
            wsCurrent.close();
        };*/
        fetch(`${API_URL}/routes`)
            .then((data) => data.json())
            .then((data) => setRoutes(data));
    }, []);

    return ( 
        <Grid container className={classes.root}>
            <Grid item xs={12} sm={3}>
                <Navbar />
                <form onSubmit={startRoute} className={classes.form}>
                    <Select fullWidth value={routeIdSelected} onChange={handleSelectChange}>
                        <MenuItem value="">Selecione uma Corrida</MenuItem>
                        <MenuItem value="1">
                            <em>Primeira</em>
                        </MenuItem>
                        <MenuItem value="2">
                            <em>Segunda</em>
                        </MenuItem>
                        <MenuItem value="3">
                            <em>Terceira</em>
                        </MenuItem>
                    </Select>
                    <div className={classes.btnSubmitWrapper}>
                        <Button type="submit" color="primary" variant="contained">Iniciar Corrida</Button>
                    </div>
                </form>
            </Grid>
            <Grid item xs={12} sm={9}>
                <div id="map" className={classes.map}>
                    <MyMap />
                </div>
            </Grid>
        </Grid>
    );
}
 
export default Content;