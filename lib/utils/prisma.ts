/* eslint-disable @typescript-eslint/no-explicit-any */
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Convert a Prisma Decimal to a regular number
 */
export const convertPrismaDecimal = (
  decimal: Decimal | number | null
): number | null => {
  if (decimal === null) return null;
  if (decimal instanceof Decimal) {
    return decimal.toNumber();
  }
  return decimal as number;
};

/**
 * Convert a Prisma order to a plain object with number values
 */
export const convertPrismaOrder = (order: any): any => {
  if (!order) return null;

  return {
    ...order,
    totalAmount: convertPrismaDecimal(order.totalAmount),
    items: order.items?.map((item: any) => ({
      ...item,
      price: convertPrismaDecimal(item.price),
      menuItem: item.menuItem
        ? {
            ...item.menuItem,
            price: convertPrismaDecimal(item.menuItem.price),
          }
        : undefined,
    })),
  };
};
