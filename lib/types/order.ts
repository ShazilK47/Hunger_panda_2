import { OrderStatus } from "./order-status";

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  userId: string;
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
    menuItemId: string;
    quantity: number;
  }>;
  deliveryAddress: string;
  paymentMethod: string;
}

export interface CreateOrderInput {
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  total: number;
}
