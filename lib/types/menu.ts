// Types related to menu items
export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  restaurantId: string;
}
