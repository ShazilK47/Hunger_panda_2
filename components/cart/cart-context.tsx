"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Cart, CartContextType, CartItem } from "@/lib/types/cart";
import { MenuItem } from "@/lib/types/menu";

// Initial empty cart state
const initialCart: Cart = {
  items: [],
  restaurantId: null,
  totalItems: 0,
  totalAmount: 0,
};

// Create context with default values
const CartContext = createContext<CartContextType>({
  cart: initialCart,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => Promise.resolve(),
  isInCart: () => false,
});

// Hook to use cart context
export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on client-side only after component mounts
  useEffect(() => {
    // This ensures we only run this on the client to prevent hydration mismatch
    const savedCart = localStorage.getItem("hungryPandaCart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        console.log("Cart loaded from localStorage:", parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("hungryPandaCart");
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes (but only after initialized)
  useEffect(() => {
    if (isInitialized) {
      console.log("Saving cart to localStorage:", cart);
      localStorage.setItem("hungryPandaCart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // Calculate cart totals
  const calculateTotals = (
    items: CartItem[]
  ): { totalItems: number; totalAmount: number } => {
    return items.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.totalAmount += item.menuItem.price * item.quantity;
        return acc;
      },
      { totalItems: 0, totalAmount: 0 }
    );
  };

  // Add item to cart
  const addToCart = (menuItem: MenuItem, quantity: number) => {
    // Check if adding from a different restaurant
    if (
      cart.restaurantId &&
      cart.restaurantId !== menuItem.restaurantId &&
      cart.items.length > 0
    ) {
      if (
        !window.confirm(
          "Your cart contains items from another restaurant. Would you like to clear your cart and add this item?"
        )
      ) {
        return; // User cancelled
      }
      // Clear cart if confirmed
      setCart(initialCart);
    }

    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.menuItem.id === menuItem.id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        newItems = [
          ...prevCart.items,
          {
            id: `${menuItem.id}_${Date.now()}`, // Generate unique cart item ID
            menuItem,
            quantity,
          },
        ];
      }

      const { totalItems, totalAmount } = calculateTotals(newItems);

      return {
        items: newItems,
        restaurantId: menuItem.restaurantId,
        totalItems,
        totalAmount,
      };
    });
  };

  // Remove item from cart
  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.id !== cartItemId);

      // If cart is empty, reset restaurantId
      const newRestaurantId =
        newItems.length > 0 ? prevCart.restaurantId : null;

      const { totalItems, totalAmount } = calculateTotals(newItems);

      return {
        items: newItems,
        restaurantId: newRestaurantId,
        totalItems,
        totalAmount,
      };
    });
  };

  // Update item quantity
  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      );

      const { totalItems, totalAmount } = calculateTotals(newItems);

      return {
        ...prevCart,
        items: newItems,
        totalItems,
        totalAmount,
      };
    });
  }; // Clear cart completely
  const clearCart = async () => {
    return new Promise<void>((resolve) => {
      // First clear localStorage to ensure it happens immediately
      localStorage.removeItem("hungryPandaCart");

      // Then update state and wait for it to complete
      setCart(initialCart);

      // Add a small delay to ensure state updates are processed
      setTimeout(() => {
        console.log("Cart state cleared");
        resolve();
      }, 300); // Increased timeout for more reliability
    });
  };

  // Check if menu item is in cart
  const isInCart = (menuItemId: string) => {
    return cart.items.some((item) => item.menuItem.id === menuItemId);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
