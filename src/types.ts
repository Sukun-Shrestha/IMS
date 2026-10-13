export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  price: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
}

export interface Order {
  id: string;
  supplier: string;
  date: string;
  items: number;
  total: number;
  status: "Pending" | "Received" | "Cancelled";
}