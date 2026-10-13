import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  X,
  AlertTriangle,
  Boxes,
} from "lucide-react";
import type { Product } from "../types";

interface ProductsProps {
  products: Product[];
  setProducts: (updatedProducts: Product[]) => void;
}

interface ProductFormData {
  name: string;
  category: string;
  stock: string;
  unit: string;
  reorderLevel: string;
  price: string;
}

const emptyForm: ProductFormData = {
  name: "",
  category: "",
  stock: "",
  unit: "pcs",
  reorderLevel: "10",
  price: "",
};

export default function Products({
  products,
  setProducts,
}: ProductsProps) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  }, [products, search]);

  const lowStockCount = products.filter(
    (product) =>
      product.stock > 0 && product.stock <= product.reorderLevel
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.stock <= 0
  ).length;

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      stock: String(product.stock),
      unit: product.unit,
      reorderLevel: String(product.reorderLevel),
      price: String(product.price),
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const name = formData.name.trim();
    const category = formData.category.trim();
    const unit = formData.unit.trim();
    const stock = Number(formData.stock);
    const reorderLevel = Number(formData.reorderLevel);
    const price = Number(formData.price);

    if (!name || !category || !unit) {
      setError("Please fill in all required fields.");
      return;
    }

    if (
      formData.stock.trim() === "" ||
      formData.reorderLevel.trim() === "" ||
      formData.price.trim() === ""
    ) {
      setError("Stock, reorder level, and price are required.");
      return;
    }

    if (
      !Number.isFinite(stock) ||
      !Number.isFinite(reorderLevel) ||
      !Number.isFinite(price) ||
      stock < 0 ||
      reorderLevel < 0 ||
      price < 0
    ) {
      setError(
        "Stock, reorder level, and price must be valid non-negative numbers."
      );
      return;
    }

    if (editingId) {
      const updatedProducts = products.map((product) =>
        product.id === editingId
          ? {
            ...product,
            name,
            category,
            stock,
            unit,
            reorderLevel,
            price,
          }
          : product
      );

      setProducts(updatedProducts);
    } else {
      const newProduct: Product = {
        id: crypto.randomUUID(),
        name,
        category,
        stock,
        unit,
        reorderLevel,
        price,
      };

      setProducts([...products, newProduct]);
    }

    closeForm();
  };

  const handleDelete = (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setProducts(
      products.filter((item) => item.id !== product.id)
    );
  };

  const getStockStatus = (product: Product) => {
    if (product.stock <= 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-100 text-red-700",
      };
    }

    if (product.stock <= product.reorderLevel) {
      return {
        label: "Low Stock",
        className: "bg-amber-100 text-amber-700",
      };
    }

    return {
      label: "In Stock",
      className: "bg-green-100 text-green-700",
    };
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="min-h-screen space-y-6 bg-[#faf7f2] p-4 text-gray-800 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your bakery products and inventory details.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9a5b35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#814a2b]"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h2 className="mt-2 text-2xl font-bold">
                {products.length}
              </h2>
            </div>
            <div className="rounded-lg bg-[#f3e5db] p-3 text-[#9a5b35]">
              <Package size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <h2 className="mt-2 text-2xl font-bold">
                {lowStockCount}
              </h2>
            </div>
            <div className="rounded-lg bg-amber-100 p-3 text-amber-700">
              <AlertTriangle size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <h2 className="mt-2 text-2xl font-bold">
                {outOfStockCount}
              </h2>
            </div>
            <div className="rounded-lg bg-red-100 p-3 text-red-600">
              <Boxes size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-xl border border-[#eadfd6] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-[#eadfd6] p-4 sm:flex-row sm:items-center sm:p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Product Inventory
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products or categories..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-[#faf7f2] text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Product</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Stock</th>
                <th className="px-5 py-4 font-semibold">Reorder Level</th>
                <th className="px-5 py-4 font-semibold">Unit Price</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const status = getStockStatus(product);

                return (
                  <tr
                    key={product.id}
                    className="transition hover:bg-[#faf7f2]/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3e5db] text-[#9a5b35]">
                          <Package size={20} />
                        </div>
                        <span className="font-medium text-gray-900">
                          {product.name}
                        </span>
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
                      {formatCurrency(product.price)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                          className="rounded-lg p-2 text-[#9a5b35] transition hover:bg-[#f3e5db]"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
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
                      <Package size={26} />
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-900">
                      {search
                        ? "No matching products"
                        : "No products added yet"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {search
                        ? "Try searching with another name or category."
                        : "Add your first bakery product to get started."}
                    </p>

                    {!search && (
                      <button
                        type="button"
                        onClick={openAddForm}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#9a5b35] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#814a2b]"
                      >
                        <Plus size={17} />
                        Add First Product
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
              <div>
                <h2
                  id="product-form-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the product information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. White Bread"
                  required
                  autoFocus
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20"
                >
                  <option value="">Select category</option>
                  <option value="Bread">Bread</option>
                  <option value="Cake">Cake</option>
                  <option value="Cookies">Cookies</option>
                  <option value="Pastries">Pastries</option>
                  <option value="Biscuits">Biscuits</option>
                  <option value="Doughnuts">Doughnuts</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Ingredients">Ingredients</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="stock"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Current Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="any"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="unit"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="pack">Packs</option>
                    <option value="box">Boxes</option>
                    <option value="litre">Litres</option>
                    <option value="ml">Millilitres (ml)</option>
                    <option value="bag">Bags</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reorderLevel"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Reorder Level <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reorderLevel"
                    name="reorderLevel"
                    type="number"
                    min="0"
                    step="any"
                    value={formData.reorderLevel}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Alert when stock reaches this level.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Unit Price (NPR){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="any"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 80"
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#9a5b35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#814a2b]"
                >
                  {editingId ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
