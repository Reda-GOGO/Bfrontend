export enum OrderEnum {
  PENDING = "pending",
  PARTIALLY_PAID = "partially_paid",
  PAID = "paid",
  CANCELED = "canceled",
}

// Order item type (used in order)
export type OrderItem = {
  name: string;
  quantity: number; // Quantity sold (can be partial)
  price: number; // Price per unit at time of sale
  unit: string; // Unit used for this sale (e.g., "kg", "packet")
  productUnit: number | null;
  orderId?: number;
  productId: number;
};

// -------------------------------------------------------------

export type ProductUnit = {
  id: number;
  productId: number;
  name: string; // e.g., "packet", "kg", "piece"
  quantityInBase: number; // e.g., 25 (means 1 packet = 25kg)
  price: number; // Selling price per unit
  createdAt?: Date;
  updatedAt?: Date | null;
  archived?: boolean;
  // Product is usually omitted or made optional/partial for typical data transfer objects (DTOs)
  // OrderItem[] is usually omitted or made optional/partial for typical DTOs
};

// -------------------------------------------------------------

export type ProductType = {
  id: number;
  name: string;
  handle: string;
  image: string | null;
  description: string | null;
  cost: number;
  price: number;
  unit: string; // Default/base unit
  inventoryUnit: string;
  inventoryQuantity: number;
  vendorName: string | null;
  vendorContact: string | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  archived: boolean;

  // Relations (often optional or excluded when fetching product data without relations)
  orderItems?: OrderItem[]; // Arrays of related objects
  units?: ProductUnit[]; // Arrays of related objects
};

export type OrderType = {
  items: OrderItem[];
  totalAmount: number;
  totalAmountString: string;
  status: string;
  type: string;
  customerId: number;
  createdBy: number;
  archived: boolean;
};
