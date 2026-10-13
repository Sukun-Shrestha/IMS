import { useEffect, useState } from "react";
import { BarChart3, Package, AlertTriangle } from "lucide-react";

import type { Product } from "../types";
import { getProducts } from "../data";

export default function Reports() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    setProducts(getProducts());
  };

  // Total stock
  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  // Total inventory value
  const totalValue = products.reduce(
    (total, product) =>
      total + product.stock * product.price,
    0
  );

  // Low stock products
  const lowStockProducts = products.filter(
    (product) =>
      product.stock <= product.reorderLevel
  );

  // Category summary
  const categoryData = products.reduce(
    (result, product) => {
      if (!result[product.category]) {
        result[product.category] = {
          quantity: 0,
          value: 0,
        };
      }

      result[product.category].quantity += product.stock;

      result[product.category].value +=
        product.stock * product.price;

      return result;
    },
    {} as Record<
      string,
      {
        quantity: number;
        value: number;
      }
    >
  );

  const categories = Object.entries(categoryData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Reports
        </h1>

        <p className="text-sm text-gray-500">
          View reports and analysis of your inventory.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <Package
              size={22}
              className="text-blue-600"
            />

            <p className="text-sm text-gray-500">
              Total Stock
            </p>
          </div>

          <p className="text-2xl font-bold">
            {totalStock}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <BarChart3
              size={22}
              className="text-green-600"
            />

            <p className="text-sm text-gray-500">
              Inventory Value
            </p>
          </div>

          <p className="text-2xl font-bold">
            Rs. {totalValue.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <AlertTriangle
              size={22}
              className="text-red-600"
            />

            <p className="text-sm text-gray-500">
              Low Stock Items
            </p>
          </div>

          <p className="text-2xl font-bold">
            {lowStockProducts.length}
          </p>
        </div>
      </div>

      {/* No Data */}
      {products.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center">
          <BarChart3
            size={45}
            className="mx-auto mb-3 text-gray-300"
          />

          <h2 className="font-semibold text-gray-700">
            No report data available
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Add products first to generate reports.
          </p>
        </div>
      ) : (
        <>
          {/* Category Report */}
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="font-semibold text-gray-900">
                Stock by Category
              </h2>

              <p className="text-sm text-gray-500">
                Inventory distribution across categories.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm">
                      Quantity
                    </th>

                    <th className="px-6 py-4 text-left text-sm">
                      Inventory Value
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {categories.map(
                    ([category, data]) => (
                      <tr key={category}>
                        <td className="px-6 py-4 font-medium">
                          {category}
                        </td>

                        <td className="px-6 py-4">
                          {data.quantity}
                        </td>

                        <td className="px-6 py-4">
                          Rs.{" "}
                          {data.value.toLocaleString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Report */}
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="font-semibold text-gray-900">
                Low Stock Report
              </h2>

              <p className="text-sm text-gray-500">
                Products that need to be restocked.
              </p>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="p-8 text-center text-sm text-green-600">
                ✓ All products have sufficient stock.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm">
                        Product
                      </th>

                      <th className="px-6 py-4 text-left text-sm">
                        Current Stock
                      </th>

                      <th className="px-6 py-4 text-left text-sm">
                        Reorder Level
                      </th>

                      <th className="px-6 py-4 text-left text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {lowStockProducts.map(
                      (product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 font-medium">
                            {product.name}
                          </td>

                          <td className="px-6 py-4">
                            {product.stock}{" "}
                            {product.unit}
                          </td>

                          <td className="px-6 py-4">
                            {product.reorderLevel}{" "}
                            {product.unit}
                          </td>

                          <td className="px-6 py-4">
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                              Restock Required
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}