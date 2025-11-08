export const OrderEnum = {
  PENDING: "pending",
  PARTIALLY_PAID: "partially_paid",
  PAID: "paid",
  CANCELED: "canceled",
} as const;

export type OrderEnum = typeof OrderEnum[keyof typeof OrderEnum];

// models.ts
// Auto-generated TypeScript types based on your Prisma schema

// ======================
// ENUMS
// ======================

export const StatsPeriod = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
} as const;

export type StatsPeriod = typeof StatsPeriod[keyof typeof StatsPeriod];

// ======================
// AUTH & USER MODELS
// ======================

export type Role = {
  id: number;
  jobTitle: string;
  description?: string | null;
  users?: User[];
  permissions?: Permission[];
};

export type Permission = {
  id: number;
  resource: string;
  action: string;
  roleId: number;
  createdAt: Date;
  updatedAt?: Date | null;
  role?: Role;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  roleId: number;
  archived: boolean;
  role?: Role;
  orders?: Order[];
};

// ======================
// PRODUCTS, UNITS & INVENTORY
// ======================

export type Product = {
  id: number;
  name: string;
  handle: string;
  image?: string | null;
  description?: string | null;
  cost: number;
  price: number;
  unit: string; // e.g., "kg", "piece"
  vendorName?: string | null;
  vendorContact?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  availableQty: number;
  archived: boolean;
  units?: ProductUnit[];
  orderItems?: OrderItem[];
  stats?: ProductStats[];
};

export type ProductUnit = {
  id: number;
  productId: number;
  name: string; // e.g., "packet", "box"
  quantityInBase: number; // e.g., 25 (means 1 packet = 25kg)
  isBase: boolean;
  price: number;
  cost: number;
  createdAt: Date;
  updatedAt?: Date | null;
  archived: boolean;
  product?: Product;
  orderItems?: OrderItem[];
};

// ======================
// ORDERS, ITEMS, CUSTOMERS & INVOICES
// ======================

export type Order = {
  id: number;
  totalAmount: number;
  discount?: number | null;
  profit: number;
  partiallyPaidIn?: number | null;
  totalAmountString: string;
  status: string; // e.g., "Pending", "Completed"
  type: string;
  paymentMode?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  customerId: number;
  createdBy: number;
  archived: boolean;
  items?: OrderItem[];
  invoice?: Invoice | null;
  customer?: Customer;
  user?: User;
};

export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  unitProfit: number;
  totalProfit: number;
  unit: string;
  productUnitId?: number | null;
  productId: number;
  orderId: number;
  createdAt: Date;
  updatedAt?: Date | null;
  productUnit?: ProductUnit | null;
  product?: Product;
  order?: Order;
};

export type Invoice = {
  id: number;
  orderId: number;
  createdAt: Date;
  updatedAt?: Date | null;
  archived: boolean;
  order?: Order;
};

export type Customer = {
  id: number;
  name: string;
  ice?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  archived: boolean;
  orders?: Order[];
};

// ======================
// ANALYTICS MODELS
// ======================

export type ProductStats = {
  id: number;
  key: string;
  period: StatsPeriod;
  soldQuantity: number;
  soldRevenue: number;
  soldProfit: number;
  productId: number;
  createdAt: Date;
  product?: Product;
};

export type SaleStats = {
  id: number;
  key: string;
  period: StatsPeriod;
  totalAmount: number;
  profit: number;
  createdAt: Date;
};

// ======================
// END OF FILE
// ======================
