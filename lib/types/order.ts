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
    menuItemId: number;
    quantity: number;
  }>;
  deliveryAddress: string;
  paymentMethod: string;
}

export interface CreateOrderInput {
  items: {
    menuItemId: number;
    quantity: number;
  }[];
  total: number;
}
