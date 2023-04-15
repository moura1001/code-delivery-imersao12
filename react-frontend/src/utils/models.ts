export interface Route {
    routeId: string;
    clientId: string;
    position: Position;
    finished: boolean;
}

export interface Position {
    latitude: number;
    longitude: number;
}