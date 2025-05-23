import { MenuItem } from "./menu";

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  restaurantId: string | null; // To ensure items are from the same restaurant
  totalItems: number;
  totalAmount: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (menuItem: MenuItem, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (menuItemId: string) => boolean;
}
