import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Search,
  Pencil,
  X,
  Package,
} from "lucide-react";

import type { Product } from "../types";
import { getProducts, saveProducts } from "../data";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = {
    name: "",
    category: "",
    stock: "",
    unit: "",
    reorderLevel: "",
    price: "",
  };

  const [form, setForm] = useState({ ...emptyForm });

  // Load saved products
  useEffect(() => {
    setProducts(getProducts());
  }, []);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Open form for a new product
  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  // Open form to edit an existing product
  const handleEdit = (product: Product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      stock: String(product.stock),
      unit: product.unit,
      reorderLevel: String(product.reorderLevel),
      price: String(product.price),
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Add or update a product
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = form.name.trim();
    const category = form.category.trim();
    const unit = form.unit.trim();

    if (
      !name ||
      !category ||
      !unit ||
      form.stock.trim() === "" ||
      form.reorderLevel.trim() === "" ||
      form.price.trim() === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const stock = Number(form.stock);
    const reorderLevel = Number(form.reorderLevel);
    const price = Number(form.price);

    if (
      !Number.isFinite(stock) ||
      !Number.isFinite(reorderLevel) ||
      !Number.isFinite(price) ||
      stock < 0 ||
      reorderLevel < 0 ||
      price < 0
    ) {
      alert(
        "Stock, reorder level, and price must be valid non-negative numbers."
      );
      return;
    }

    let updatedProducts: Product[];

    if (editingId) {
      // Update existing product
      updatedProducts = products.map((product) =>
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
    } else {
      // Create new product
      const newProduct: Product = {
        id: crypto.randomUUID(),
        name,
        category,
        stock,
        unit,
        reorderLevel,
        price,
      };

      updatedProducts = [...products, newProduct];
    }

    saveProducts(updatedProducts);
    setProducts(updatedProducts);

    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(false);
  };

  // Cancel form
  const handleCancel = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(false);
  };

  // Delete product
  const deleteProduct = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const updatedProducts = products.filter(
      (product) => product.id !== id
    );

    saveProducts(updatedProducts);
    setProducts(updatedProducts);

    if (editingId === id) {
      handleCancel();
    }
  };

  // Search by product name or category
  const filteredProducts = products.filter((product) => {
    const searchTerm = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>

          <p className="text-sm text-gray-500">
            Manage your bakery products and inventory items.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#9a5b35] px-4 py-2 text-white transition hover:bg-[#B5651D]"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search by product name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 outline-none focus:border-blue-500"
        />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>

            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {/* Product Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Product Name *
              </label>

              <input
                name="name"
                type="text"
                placeholder="e.g. Wheat Flour"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category *
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Dairy Products">Dairy Products</option>
                <option value="Eggs">Eggs</option>
                <option value="Chocolate & Cocoa">
                  Chocolate & Cocoa
                </option>
                <option value="Fruits & Nuts">Fruits & Nuts</option>
                <option value="Bakery Products">Bakery Products</option>
                <option value="Packaging Materials">
                  Packaging Materials
                </option>
                <option value="Other">Other</option>

                {/* Preserve existing custom category */}
                {form.category &&
                  ![
                    "Raw Materials",
                    "Dairy Products",
                    "Eggs",
                    "Chocolate & Cocoa",
                    "Fruits & Nuts",
                    "Bakery Products",
                    "Packaging Materials",
                    "Other",
                  ].includes(form.category) && (
                    <option value={form.category}>
                      {form.category}
                    </option>
                  )}
              </select>
            </div>

            {/* Current or Initial Stock */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {editingId ? "Current Stock *" : "Initial Stock *"}
              </label>

              <input
                name="stock"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 25"
                value={form.stock}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Unit */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Unit *
              </label>

              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Unit</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="L">Liter (L)</option>
                <option value="ml">Milliliter (ml)</option>
                <option value="pcs">Pieces (pcs)</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>

                {/* Preserve existing custom unit */}
                {form.unit &&
                  !["kg", "g", "L", "ml", "pcs", "pack", "box"].includes(
                    form.unit
                  ) && (
                    <option value={form.unit}>
                      {form.unit}
                    </option>
                  )}
              </select>
            </div>

            {/* Reorder Level */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Reorder Level *
              </label>

              <input
                name="reorderLevel"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 5"
                value={form.reorderLevel}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                required
              />

              <p className="mt-1 text-xs text-gray-400">
                A low-stock alert appears when stock reaches this level.
              </p>
            </div>

            {/* Price */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price (Rs.) *
              </label>

              <input
                name="price"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 120"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Form Buttons */}
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
              >
                {editingId ? (
                  <>
                    <Pencil size={16} />
                    Update Product
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Save Product
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border px-5 py-2 text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <Package
              size={45}
              className="mx-auto mb-3 text-gray-300"
            />

            <p className="font-medium text-gray-600">
              No products added yet.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Click "Add Product" to add your first product.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Search
              size={36}
              className="mx-auto mb-3 text-gray-300"
            />

            <p className="font-medium text-gray-600">
              No matching products found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Current Stock</th>
                  <th className="px-6 py-4 text-left">Reorder Level</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredProducts.map((product) => {
                  const isLowStock =
                    product.stock <= product.reorderLevel;

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {product.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {product.category}
                      </td>

                      {/* Current Stock */}
                      <td className="px-6 py-4">
                        <span className="text-gray-700">
                          {product.stock} {product.unit}
                        </span>

                        {product.stock === 0 && (
                          <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Reorder Level */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${isLowStock
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                            }`}
                        >
                          {product.reorderLevel} {product.unit}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-gray-600">
                        Rs. {product.price.toLocaleString()}
                      </td>

                      {/* Edit and Delete */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            title="Edit product"
                            aria-label={`Edit ${product.name}`}
                            className="rounded-lg border border-blue-200 p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            title="Delete product"
                            aria-label={`Delete ${product.name}`}
                            className="rounded-lg border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Count */}
      <p className="text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </p>
    </div>
  );
}