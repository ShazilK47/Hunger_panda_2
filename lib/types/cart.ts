import { MenuItem } from "./menu";

export interface CartItem {
  id: string; // This can remain string as it's client-side generated
  menuItem: MenuItem;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  restaurantId: number | null; // To ensure items are from the same restaurant
  totalItems: number;
  totalAmount: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (menuItem: MenuItem, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  isInCart: (menuItemId: number) => boolean;
}
