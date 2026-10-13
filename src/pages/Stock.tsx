import { useMemo, useState } from "react";
import {
  Search,
  Boxes,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Minus,
} from "lucide-react";
import type { Product } from "../types";

interface StockProps {
  products: Product[];
  setProducts: (updatedProducts: Product[]) => void;
}

export default function Stock({ products, setProducts }: StockProps) {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [adjustingProduct, setAdjustingProduct] =
    useState<Product | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">(
    "add"
  );
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("Stock received");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalStockUnits = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      product.stock > 0 && product.stock <= product.reorderLevel
  );

  const outOfStockProducts = products.filter(
    (product) => product.stock <= 0
  );

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

      const matchesFilter =
        stockFilter === "all" ||
        (stockFilter === "low" &&
          product.stock > 0 &&
          product.stock <= product.reorderLevel) ||
        (stockFilter === "out" && product.stock <= 0) ||
        (stockFilter === "available" &&
          product.stock > product.reorderLevel);

      return matchesSearch && matchesFilter;
    });
  }, [products, search, stockFilter]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 2,
    }).format(amount);

  const getStockStatus = (product: Product) => {
    if (product.stock <= 0) {
      return {
        label: "Out of Stock",
        style: "bg-red-100 text-red-700",
      };
    }

    if (product.stock <= product.reorderLevel) {
      return {
        label: "Low Stock",
        style: "bg-amber-100 text-amber-700",
      };
    }

    return {
      label: "In Stock",
      style: "bg-green-100 text-green-700",
    };
  };

  const openAdjustment = (
    product: Product,
    type: "add" | "remove"
  ) => {
    setAdjustingProduct(product);
    setAdjustmentType(type);
    setQuantity("");
    setReason(type === "add" ? "Stock received" : "Stock damaged");
    setError("");
    setSuccess("");
  };

  const closeAdjustment = () => {
    setAdjustingProduct(null);
    setQuantity("");
    setError("");
  };

  const handleStockAdjustment = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!adjustingProduct) return;

    const amount = Number(quantity);

    if (quantity.trim() === "" || !Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a quantity greater than zero.");
      return;
    }

    const currentProduct = products.find(
      (product) => product.id === adjustingProduct.id
    );

    if (!currentProduct) {
      setError("This product could not be found. Refresh and try again.");
      return;
    }

    if (adjustmentType === "remove" && amount > currentProduct.stock) {
      setError(
        `You cannot remove ${amount} ${currentProduct.unit}. Only ${currentProduct.stock} ${currentProduct.unit} available.`
      );
      return;
    }

    const newStock =
      adjustmentType === "add"
        ? currentProduct.stock + amount
        : currentProduct.stock - amount;

    const updatedProducts = products.map((product) =>
      product.id === currentProduct.id
        ? { ...product, stock: newStock }
        : product
    );

    setProducts(updatedProducts);

    setSuccess(
      `${currentProduct.name}: stock ${adjustmentType === "add" ? "increased" : "decreased"
      } successfully.`
    );

    closeAdjustment();
  };

  const resetFilters = () => {
    setSearch("");
    setStockFilter("all");
  };

  return (
    <div className="min-h-screen space-y-6 bg-[#faf7f2] p-4 text-gray-800 sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Stock Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor inventory levels and manage stock movements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStockFilter("all");
            setSuccess("");
            setError("");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#eadfd6] bg-white px-4 py-2.5 text-sm font-semibold text-[#9a5b35] transition hover:bg-[#f3e5db]"
        >
          <RefreshCw size={17} />
          Refresh View
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {products.length}
              </h2>
            </div>
            <div className="rounded-lg bg-[#f3e5db] p-3 text-[#9a5b35]">
              <Package size={23} />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Unique products registered
          </p>
        </div>

        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stock</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {totalStockUnits.toLocaleString()}
              </h2>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
              <Boxes size={23} />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Combined quantities across products
          </p>
        </div>

        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {lowStockProducts.length}
              </h2>
            </div>
            <div className="rounded-lg bg-amber-100 p-3 text-amber-700">
              <AlertTriangle size={23} />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            At or below reorder level
          </p>
        </div>

        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {outOfStockProducts.length}
              </h2>
            </div>
            <div className="rounded-lg bg-red-100 p-3 text-red-600">
              <AlertTriangle size={23} />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Products with zero stock
          </p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={21}
              className="mt-0.5 shrink-0 text-amber-700"
            />
            <div className="min-w-0">
              <h2 className="font-semibold text-amber-900">
                Low Stock Alert
              </h2>
              <p className="mt-1 text-sm text-amber-800">
                The following products have reached or fallen below their
                reorder levels:
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {lowStockProducts.map((product) => (
                  <span
                    key={product.id}
                    className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-900"
                  >
                    {product.name}: {product.stock} {product.unit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-xl border border-[#eadfd6] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-[#eadfd6] p-4 sm:flex-row sm:items-center sm:p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Stock Inventory
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} displayed
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20 sm:w-56"
              />
            </div>

            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
              aria-label="Filter products by stock status"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20"
            >
              <option value="all">All Stock</option>
              <option value="available">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-[#faf7f2] text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Product</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Current Stock</th>
                <th className="px-5 py-4 font-semibold">Reorder Level</th>
                <th className="px-5 py-4 font-semibold">Stock Value</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">
                  Adjust Stock
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const status = getStockStatus(product);
                const stockValue = product.stock * product.price;

                return (
                  <tr
                    key={product.id}
                    className="transition hover:bg-[#faf7f2]/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3e5db] text-[#9a5b35]">
                          <Package size={19} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            ID: {product.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {product.category}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-900">
                        {product.stock}
                      </span>{" "}
                      <span className="text-gray-500">
                        {product.unit}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {product.reorderLevel} {product.unit}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-900">
                      {formatCurrency(stockValue)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${status.style}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openAdjustment(product, "add")}
                          title={`Add stock to ${product.name}`}
                          aria-label={`Add stock to ${product.name}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                        >
                          <Plus size={15} />
                          Add
                        </button>

                        <button
                          type="button"
                          onClick={() => openAdjustment(product, "remove")}
                          disabled={product.stock <= 0}
                          title={`Remove stock from ${product.name}`}
                          aria-label={`Remove stock from ${product.name}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus size={15} />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e5db] text-[#9a5b35]">
                      <Boxes size={26} />
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-900">
                      {products.length === 0
                        ? "No stock available"
                        : "No matching products"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {products.length === 0
                        ? "Add products on the Products page to manage your stock."
                        : "Try another search term or change the stock filter."}
                    </p>

                    {(search || stockFilter !== "all") && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 rounded-lg bg-[#9a5b35] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#814a2b]"
                      >
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAdjustment();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stock-adjustment-title"
            className="my-auto w-full max-w-md rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2
                  id="stock-adjustment-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {adjustmentType === "add"
                    ? "Add Stock"
                    : "Remove Stock"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {adjustingProduct.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeAdjustment}
                aria-label="Close stock adjustment"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <RefreshCw size={19} />
              </button>
            </div>

            <form
              onSubmit={handleStockAdjustment}
              className="space-y-5 p-5"
            >
              <div className="rounded-lg bg-[#faf7f2] p-4">
                <p className="text-sm text-gray-500">Current stock</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {adjustingProduct.stock} {adjustingProduct.unit}
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Adjustment Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAdjustmentType("add");
                      setReason("Stock received");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition ${adjustmentType === "add"
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <TrendingUp size={17} />
                    Add Stock
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdjustmentType("remove");
                      setReason("Stock damaged");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition ${adjustmentType === "remove"
                        ? "border-red-600 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <TrendingDown size={17} />
                    Remove Stock
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="stockQuantity"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Quantity ({adjustingProduct.unit})
                </label>
                <input
                  id="stockQuantity"
                  type="number"
                  min="0.01"
                  step="any"
                  max={
                    adjustmentType === "remove"
                      ? adjustingProduct.stock
                      : undefined
                  }
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="Enter quantity"
                  required
                  autoFocus
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="stockReason"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Reason
                </label>
                <select
                  id="stockReason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20"
                >
                  {adjustmentType === "add" ? (
                    <>
                      <option value="Stock received">Stock received</option>
                      <option value="Purchase">New purchase</option>
                      <option value="Return">Returned stock</option>
                      <option value="Correction">Stock correction</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Stock damaged">Stock damaged</option>
                      <option value="Expired">Expired products</option>
                      <option value="Sold">Products sold</option>
                      <option value="Used">Used in production</option>
                      <option value="Correction">Stock correction</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Reason selected: {reason}
                </p>
              </div>

              {quantity.trim() !== "" &&
                Number.isFinite(Number(quantity)) &&
                Number(quantity) > 0 && (
                  <div className="rounded-lg border border-[#eadfd6] p-4">
                    <p className="text-sm text-gray-500">
                      Estimated stock after adjustment
                    </p>
                    <p className="mt-1 text-xl font-bold text-[#9a5b35]">
                      {adjustmentType === "add"
                        ? adjustingProduct.stock + Number(quantity)
                        : Math.max(
                          0,
                          adjustingProduct.stock - Number(quantity)
                        )}{" "}
                      {adjustingProduct.unit}
                    </p>
                  </div>
                )}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAdjustment}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${adjustmentType === "add"
                      ? "bg-[#9a5b35] hover:bg-[#814a2b]"
                      : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                  {adjustmentType === "add"
                    ? "Confirm Add"
                    : "Confirm Removal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
