export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  menuItemId: string;
  orderId: string;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderInput {
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  deliveryAddress: string;
  paymentMethod: string;
}
