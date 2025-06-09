// Types related to menu items
export interface MenuItem {
  id: number;
  name: string;
  description: string; // We convert null to empty string
  price: number;
  imageUrl: string; // We convert null to empty string
  category: string;
  restaurantId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  restaurantId: number | string; // Allow both for backward compatibility during transition
}
