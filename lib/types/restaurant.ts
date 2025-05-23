// Types related to restaurants
import { MenuItem } from "./menu";

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  address: string;
  menuItems?: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RestaurantFormData {
  name: string;
  description: string;
  address: string;
  imageUrl?: string;
}
