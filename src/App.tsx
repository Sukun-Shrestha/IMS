import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import {
  getProducts,
  saveProducts,
  INVENTORY_UPDATED,
} from "./data";

import type { Product } from "./types";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Stock from "./pages/Stock";
import Suppliers from "./pages/Suppliers";

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => getProducts());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Keep the product state synchronized with LocalStorage updates.
  useEffect(() => {
    const updateProducts = () => {
      setProducts(getProducts());
    };

    window.addEventListener(INVENTORY_UPDATED, updateProducts);
    window.addEventListener("storage", updateProducts);

    return () => {
      window.removeEventListener(INVENTORY_UPDATED, updateProducts);
      window.removeEventListener("storage", updateProducts);
    };
  }, []);

  // Update React state and save the products.
  const handleSetProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="min-h-screen lg:ml-64">
        <Header onMenu={() => setSidebarOpen(true)} />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Routes>
              {/* Dashboard */}
              <Route
                path="/"
                element={<Dashboard products={products} />}
              />

              {/* Products */}
              <Route
                path="/products"
                element={
                  <Products
                    products={products}
                    setProducts={handleSetProducts}
                  />
                }
              />

              {/* Stock Management */}
              <Route
                path="/stock"
                element={
                  <Stock
                    products={products}
                    setProducts={handleSetProducts}
                  />
                }
              />

              {/* Orders */}
              <Route
                path="/orders"
                element={<Orders />}
              />

              {/* Suppliers */}
              <Route
                path="/suppliers"
                element={<Suppliers />}
              />

              {/* Reports */}
              <Route
                path="/reports"
                element={<Reports products={products} />}
              />

              {/* Settings */}
              <Route
                path="/settings"
                element={<Settings />}
              />

              {/* Redirect unknown pages */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-stone-200 bg-white px-4 py-5 text-center sm:px-6">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Safal Bakery Inventory Management System
          </p>

          <p className="mt-1 text-xs text-stone-400">
            Fresh inventory. Better business. Every day.
          </p>
        </footer>
      </div>
    </div>
  );
}