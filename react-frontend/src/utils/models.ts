export interface Route {
    id: string;
    clientId: string;
    position: Position;
    finished: boolean;
}

export interface Position {
    latitude: number;
    longitude: number;
}