import type { Product, Supplier, Order } from "./types";

const PRODUCTS_KEY = "safal_products";
const SUPPLIERS_KEY = "safal_suppliers";
const ORDERS_KEY = "safal_orders";

// Event for updating components when inventory changes
export const INVENTORY_UPDATED = "safal-inventory-updated";

export const getProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); 
  window.dispatchEvent(new Event(INVENTORY_UPDATED));
};

export const getSuppliers = (): Supplier[] => {
  try {
    const data = localStorage.getItem(SUPPLIERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveSuppliers = (suppliers: Supplier[]) => {
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers));
};

export const getOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};