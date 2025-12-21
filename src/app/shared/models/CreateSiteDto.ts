import { CreatePolygonDto } from './CreatePolygonDto';

export interface CreateSiteDto {
  name: {
    en: string;
    ar: string;
  };
  path: string;
  isLeaf: boolean;
  parentId?: string | null;
  pricePerHour?: number;
  integrationCode?: string;
  numberOfSlots?: number;
  polygons?: CreatePolygonDto[];
}
