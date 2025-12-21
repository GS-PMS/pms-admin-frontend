export interface CreatePolygonDto {
  siteId: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }[];
}
