import { useEffect, useState } from "react";
import {
  Package,
  AlertTriangle,
  Boxes,
  DollarSign,
} from "lucide-react";

import type { Product } from "../types";
import { getProducts } from "../data";

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);

  const loadDashboard = () => {
    setProducts(getProducts());
  };

  useEffect(() => {
    loadDashboard();

    const handleStorageChange = () => {
      loadDashboard();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // -----------------------------
  // Dashboard calculations
  // -----------------------------

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const lowStock = products.filter(
    (product) => product.stock <= product.reorderLevel
  ).length;

  const stockValue = products.reduce(
    (total, product) => total + product.stock * product.price,
    0
  );

  // -----------------------------
  // Category graph data
  // -----------------------------

  const categoryData = products.reduce(
    (result, product) => {
      if (!result[product.category]) {
        result[product.category] = 0;
      }

      result[product.category] += product.stock;

      return result;
    },
    {} as Record<string, number>
  );

  const categories = Object.entries(categoryData);

  // Find highest stock for graph height
  const maxStock =
    categories.length > 0
      ? Math.max(...categories.map(([, value]) => value))
      : 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            Overview of your bakery inventory.
          </p>
        </div>


      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package size={22} />}
        />

        <StatCard
          title="Total Stock"
          value={totalStock}
          icon={<Boxes size={22} />}
        />

        <StatCard
          title="Low Stock Items"
          value={lowStock}
          icon={<AlertTriangle size={22} />}
        />

        <StatCard
          title="Income"
          value={`Rs. ${stockValue.toLocaleString()}`}
          icon={<DollarSign size={22} />}
        />

      </div>

      {/* Graph */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Stock by Category
          </h2>

          <p className="text-sm text-gray-500">
            Current inventory quantity for each product category.
          </p>
        </div>

        {categories.length === 0 ? (

          <div className="flex h-72 items-center justify-center">
            <div className="text-center">

              <Boxes
                size={45}
                className="mx-auto mb-3 text-gray-300"
              />

              <h3 className="font-semibold text-gray-700">
                No graph data available
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Add products with categories to display the graph.
              </p>

            </div>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <div className="flex h-80 min-w-[600px] items-end gap-6 border-b border-l px-8 pb-0 pt-8">

              {categories.map(([category, stock]) => {

                const height =
                  maxStock > 0
                    ? Math.max((stock / maxStock) * 100, 5)
                    : 5;

                return (
                  <div
                    key={category}
                    className="flex h-full flex-1 flex-col items-center justify-end"
                  >

                    {/* Stock value */}
                    <div className="mb-2 text-sm font-semibold text-gray-700">
                      {stock}
                    </div>

                    {/* Bar */}
                    <div
                      className="w-full max-w-20 rounded-t-lg bg-orange-500 transition-all duration-500 hover:bg-orange-600"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`${category}: ${stock} units`}
                    />

                    {/* Category */}
                    <div className="mt-3 w-full truncate text-center text-xs font-medium text-gray-600">
                      {category}
                    </div>

                  </div>
                );
              })}

            </div>

            {/* Graph label */}
            <div className="mt-4 flex justify-between text-xs text-gray-400">
              <span>Category</span>
              <span>Stock Quantity</span>
            </div>

          </div>

        )}

      </div>

      {/* Inventory Overview */}
      {products.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

          <div className="border-b p-5">
            <h2 className="font-semibold text-gray-900">
              Inventory Overview
            </h2>

            <p className="text-sm text-gray-500">
              Your currently added bakery products.
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">
                <tr>

                  <th className="px-6 py-4 text-left text-sm">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-sm">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-sm">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-sm">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y">

                {products.map((product) => {

                  const isLow =
                    product.stock <= product.reorderLevel;

                  return (
                    <tr key={product.id}>

                      <td className="px-6 py-4 font-medium">
                        {product.name}
                      </td>

                      <td className="px-6 py-4">
                        {product.category}
                      </td>

                      <td className="px-6 py-4">
                        {product.stock} {product.unit}
                      </td>

                      <td className="px-6 py-4">
                        Rs. {product.price.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">

                        {isLow ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            In Stock
                          </span>
                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* Empty state */}
      {products.length === 0 && (
        <div className="rounded-xl border bg-white py-16 text-center shadow-sm">

          <Package
            size={50}
            className="mx-auto mb-4 text-gray-300"
          />

          <h2 className="font-semibold text-gray-700">
            No Products Added
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Add products from the Products section
            to see your inventory here.
          </p>

        </div>
      )}

    </div>
  );
}


/* --------------------------------
   Statistics Card
-------------------------------- */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="mb-4 flex items-center justify-between">

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <div className="text-orange-600">
          {icon}
        </div>

      </div>

      <p className="text-2xl font-bold text-gray-900">
        {value}
      </p>

    </div>
  );
}