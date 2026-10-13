import {
  Bell,
  Menu,
  Search,
  AlertTriangle,
  Package,
  X,
  Users,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  getSuppliers,
  INVENTORY_UPDATED,
} from "../data";

import type { Product, Supplier } from "../types";

interface HeaderProps {
  onMenu?: () => void;
}

export default function Header({ onMenu }: HeaderProps) {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Load products and suppliers
  const loadData = () => {
    setProducts(getProducts());
    setSuppliers(getSuppliers());
  };

  useEffect(() => {
    loadData();

    window.addEventListener(INVENTORY_UPDATED, loadData);
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener(INVENTORY_UPDATED, loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  // Search products by name or category
  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  // Search suppliers by name, contact, or email
  const filteredSuppliers = suppliers.filter((supplier) => {
    const query = search.trim().toLowerCase();

    return (
      supplier.name.toLowerCase().includes(query) ||
      supplier.contact.toLowerCase().includes(query) ||
      supplier.email.toLowerCase().includes(query)
    );
  });

  const hasSearch = search.trim().length > 0;

  // Low-stock notifications
  const lowStockProducts = products.filter(
    (product) => product.stock <= product.reorderLevel
  );

  const notificationCount = lowStockProducts.length;

  // Open the selected page
  const openProduct = () => {
    setShowSearchResults(false);
    setShowNotifications(false);
    setSearch("");
    navigate("/products");
  };

  const openSupplier = () => {
    setShowSearchResults(false);
    setShowNotifications(false);
    setSearch("");
    navigate("/suppliers");
  };

  const openStockPage = () => {
    setShowNotifications(false);
    setShowSearchResults(false);
    navigate("/stock");
  };

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b border-[#eadfd6] bg-[#faf7f2]/95 px-4 backdrop-blur lg:ml-64 lg:px-8">

      {/* Mobile Menu */}
      <button
        type="button"
        className="rounded-lg p-2 hover:bg-white lg:hidden"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu />
      </button>

      {/* Search Bar */}
      <div className="relative max-w-xl flex-1">

        <Search
          size={19}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a8475]"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSearchResults(true);
            setShowNotifications(false);
          }}
          onFocus={() => {
            if (search.trim()) {
              setShowSearchResults(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setSearch("");
              setShowSearchResults(false);
            }

            if (e.key === "Enter" && hasSearch) {
              setShowSearchResults(false);
              navigate("/products");
            }
          }}
          placeholder="Search products, suppliers..."
          className="w-full rounded-xl border border-[#eadfd6] bg-white py-3 pl-10 pr-10 text-sm outline-none focus:border-[#9a5b35]"
        />

        {/* Clear Search */}
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setShowSearchResults(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            aria-label="Clear search"
          >
            <X size={17} />
          </button>
        )}

        {/* Search Results Dropdown */}
        {showSearchResults && hasSearch && (
          <div className="absolute left-0 right-0 top-14 z-50 max-h-96 overflow-y-auto rounded-xl border border-[#eadfd6] bg-white shadow-xl">

            {/* Product Results */}
            <div className="border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3">
                <Package size={16} className="text-[#9a5b35]" />
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Products ({filteredProducts.length})
                </span>
              </div>

              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 5).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={openProduct}
                    className="flex w-full items-center justify-between gap-3 border-b border-gray-50 px-4 py-3 text-left hover:bg-orange-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {product.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-gray-500">
                      {product.stock} {product.unit}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-4 text-sm text-gray-400">
                  No matching products found.
                </p>
              )}

              {filteredProducts.length > 5 && (
                <button
                  type="button"
                  onClick={openProduct}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-[#9a5b35] hover:bg-orange-50"
                >
                  View Products
                </button>
              )}
            </div>

            {/* Supplier Results */}
            <div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3">
                <Users size={16} className="text-[#9a5b35]" />
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Suppliers ({filteredSuppliers.length})
                </span>
              </div>

              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.slice(0, 5).map((supplier) => (
                  <button
                    key={supplier.id}
                    type="button"
                    onClick={openSupplier}
                    className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3 text-left hover:bg-orange-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Users size={17} className="text-orange-700" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {supplier.name}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {supplier.email}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="px-4 py-4 text-sm text-gray-400">
                  No matching suppliers found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Bell */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowNotifications((previous) => !previous);
            setShowSearchResults(false);
          }}
          className={`relative rounded-xl p-3 transition ${showNotifications ? "bg-white" : "hover:bg-white"
            }`}
          aria-label="View notifications"
          aria-expanded={showNotifications}
        >
          <Bell size={21} />

          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-xl border border-[#eadfd6] bg-white shadow-xl sm:w-96">

            <div className="border-b border-gray-100 px-4 py-4">
              <h3 className="font-semibold text-gray-900">
                Notifications
              </h3>

              <p className="text-xs text-gray-500">
                Bakery inventory alerts
              </p>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Bell
                  size={28}
                  className="mx-auto mb-3 text-green-600"
                />

                <p className="font-semibold text-gray-700">
                  You're all caught up!
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  No low-stock items at the moment.
                </p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {lowStockProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={openStockPage}
                    className="flex w-full items-start gap-3 border-b border-gray-100 px-4 py-4 text-left hover:bg-orange-50"
                  >
                    <AlertTriangle
                      size={20}
                      className="mt-1 shrink-0 text-red-500"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {product.stock === 0
                          ? "Out of Stock"
                          : "Low Stock Alert"}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {product.name}: {product.stock} {product.unit} remaining.
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Reorder level: {product.reorderLevel} {product.unit}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={openStockPage}
              className="flex w-full items-center justify-center gap-2 border-t px-4 py-3 text-sm font-semibold text-[#9a5b35] hover:bg-orange-50"
            >
              <Package size={17} />
              View Stock Management
            </button>
          </div>
        )}
      </div>

      {/* Admin Profile */}
      <button
        type="button"
        onClick={() => navigate("/settings")}
        className="hidden items-center gap-2 border-l border-[#eadfd6] pl-4 sm:flex"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#9a5b35] font-semibold text-white">
          A
        </span>

        <span className="text-sm font-semibold">Admin</span>
      </button>
    </header>
  );
}