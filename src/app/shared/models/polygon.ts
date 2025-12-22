export interface Polygon {
  id: string;
  siteId?: string;
  name: string;
  polygonPoints: {
    latitude: number;
    longitude: number;
  }[];
}
