export interface Polygon {
    id: string;
    siteId: string;
    name: string;
    coordinates: {
        latitude: number;
        longitude: number;
    }[];
}
