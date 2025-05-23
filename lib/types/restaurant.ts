// Types related to restaurants
import { MenuItem } from "./menu";

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  address: string;
  phone: string | null;
  cuisine: string | null;
  menuItems?: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RestaurantFormData {
  id?: string;
  name: string;
  description?: string | null;
  address: string;
  imageUrl?: string | null;
  phone?: string | null;
  cuisine?: string | null;
}
