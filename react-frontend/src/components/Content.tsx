import { useEffect, useState, useRef, ChangeEvent, FormEvent, useCallback } from 'react';
import { Grid, Select, MenuItem, Button, makeStyles } from "@material-ui/core";
import { Route } from '../utils/models';
import { Navbar } from './Navbar';
import MyMap from './MyMap';
import { Client, StompSubscription } from '@stomp/stompjs';
import { init } from '../utils/websocket'

const DEST = "/api/routes"
const API_URL = `${process.env.REACT_APP_API_URL}${DEST}`;

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

    //var route: Route | null = null;
    const [routes, setRoutes] = useState<string[]>([]);
    const [subscriptionsId, setSubscriptionsId] = useState<string[]>([]);
    const [routeIdSelected, setRouteIdSelected] = useState<string>("");
    const ws = useRef(null as unknown as Client);

    const handleSelectChange = (event: ChangeEvent<{ value: unknown }>): void => {
        setRouteIdSelected(event.target.value as string);
    };

    const startRoute = useCallback((event: FormEvent): void => {
        event.preventDefault();
        console.log(routeIdSelected);
        console.log(routes)
        if (ws.current && !routes.includes(routeIdSelected)) {

            setRoutes(prevState => [...prevState, routeIdSelected])

            const sessionId = ws.current.connectHeaders['sessionId'];
            const subscriptionId = sessionId + "-" + routeIdSelected;

            setSubscriptionsId(prevState => [...prevState, subscriptionId])

            ws.current.subscribe(
                '/user/queue/specific-user' + '-user' + sessionId,
                msgOut => {
                    console.log("received message: " + msgOut.body);
                    const r: Route = JSON.parse(msgOut.body);
                    if (r.finished) {
                        const subscriptionId = sessionId + "-" + r.routeId

                        console.log("route finished: " + JSON.stringify(r))
                        setRoutes(prevState => prevState.filter(route => route !== r.routeId))
                        setSubscriptionsId(prevState => prevState.filter(sub => sub !== subscriptionId))
                        ws.current.unsubscribe(subscriptionId)
                        console.log("unsubscribe from stomp id: " + subscriptionId)
                    }
                },
                {id: subscriptionId}
            );

            ws.current.publish({
                destination: "/api/routes",
                body: JSON.stringify({'routeId':routeIdSelected, 'clientId':sessionId})
            })
        }
    }, [routeIdSelected, routes]);

    useEffect(() => {
        if (!ws.current) {
            ws.current = init(API_URL)
            ws.current.activate();
        }

        return () => {
            if (ws.current?.connected) {
                ws.current.deactivate();
            }
            ws.current = null as unknown as Client
        };
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