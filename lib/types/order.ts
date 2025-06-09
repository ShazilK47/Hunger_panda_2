import { OrderStatus } from "./order-status";

export interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderInput {
  items: Array<{
    menuItemId: number | string; // Accept both types for backward compatibility
    quantity: number;
  }>;
  deliveryAddress: string;
  paymentMethod: string;
  total?: number; // Optional total field
}
