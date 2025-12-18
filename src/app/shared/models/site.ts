import { Polygon } from "./polygon";

export interface Site {
    id: string;
    name: {
        en: string;
        ar: string;
    };
    path: string;
    integrationCode: string;
    isLeaf: boolean;
    childrenCount: number;
    children?: Site[];
    pricePerHour?: number;
    numberOfSlots?: number;
    polygons?: Polygon[];
}
