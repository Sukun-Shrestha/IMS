import {
  Package,
  Boxes,
  AlertTriangle,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardList,
} from "lucide-react";

import type { Product } from "../types";

interface DashboardProps {
  products: Product[];
}

export default function Dashboard({ products }: DashboardProps) {
  // Inventory statistics
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock) <= Number(product.reorderLevel)
  );

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) === 0
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total +
      Number(product.stock || 0) * Number(product.price || 0),
    0
  );

  const formatCurrency = (amount: number) =>
    `Rs. ${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  // Group products by category for the chart
  const categoryMap = products.reduce<Record<string, number>>(
    (categories, product) => {
      const category = product.category || "Uncategorized";

      categories[category] =
        (categories[category] || 0) +
        Number(product.stock || 0);

      return categories;
    },
    {}
  );

  const categoryData = Object.entries(categoryMap)
    .map(([name, stock]) => ({ name, stock }))
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 6);

  const maxStock = Math.max(
    ...categoryData.map((category) => category.stock),
    1
  );

  // Products with the lowest stock levels
  const recentLowStock = [...lowStockProducts]
    .sort((a, b) => Number(a.stock) - Number(b.stock))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome to Safal Bakery Inventory Management System.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#eadfd6] bg-white px-4 py-2 text-sm text-gray-600">
          <ClipboardList size={18} className="text-[#9a5b35]" />

          <span>Inventory Overview</span>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total products */}
        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {totalProducts}
              </h2>
            </div>

            <div className="rounded-xl bg-[#f5e8df] p-3">
              <Package size={23} className="text-[#9a5b35]" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp size={16} className="text-[#9a5b35]" />
            <span>Products in your inventory</span>
          </div>
        </div>

        {/* Total stock */}
        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Stock
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {totalStock.toLocaleString()}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3">
              <Boxes size={23} className="text-blue-600" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <Package size={16} className="text-blue-600" />
            <span>Total units across products</span>
          </div>
        </div>

        {/* Low stock */}
        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Low Stock Items
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {lowStockProducts.length}
              </h2>
            </div>

            <div className="rounded-xl bg-amber-50 p-3">
              <AlertTriangle
                size={23}
                className="text-amber-600"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            {outOfStockProducts.length > 0 ? (
              <>
                <ArrowDownRight
                  size={16}
                  className="text-red-500"
                />

                <span className="text-red-600">
                  {outOfStockProducts.length} out of stock
                </span>
              </>
            ) : (
              <span className="text-gray-500">
                Items at or below reorder level
              </span>
            )}
          </div>
        </div>

        {/* Inventory value */}
        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Inventory Value
              </p>

              <h2 className="mt-3 break-words text-2xl font-bold text-gray-900">
                {formatCurrency(inventoryValue)}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-3">
              <Wallet size={23} className="text-green-600" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <ArrowUpRight size={16} className="text-green-600" />
            <span>Based on current stock and price</span>
          </div>
        </div>
      </div>

      {/* Charts and low stock section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Stock chart */}
        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Stock by Category
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current stock quantity for each product category.
              </p>
            </div>

            <span className="w-fit rounded-lg bg-[#f5e8df] px-3 py-1.5 text-xs font-medium text-[#9a5b35]">
              {categoryData.length} Categories
            </span>
          </div>

          {categoryData.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[#eadfd6] px-4 text-center">
              <Boxes
                size={42}
                className="mb-3 text-gray-300"
              />

              <h3 className="font-semibold text-gray-700">
                No inventory data yet
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Add products from the Products page to display
                your stock chart here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {categoryData.map((category) => {
                const percentage =
                  (category.stock / maxStock) * 100;

                return (
                  <div key={category.name}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium text-gray-700">
                        {category.name}
                      </span>

                      <span className="shrink-0 text-sm font-semibold text-gray-900">
                        {category.stock.toLocaleString()} units
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-[#f3eee9]">
                      <div
                        className="h-full rounded-full bg-[#9a5b35] transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Chart summary */}
          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#f0e7e0] pt-5 sm:grid-cols-2">
            <div className="rounded-lg bg-[#faf7f2] p-4">
              <p className="text-sm text-gray-500">
                Categories tracked
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {Object.keys(categoryMap).length}
              </p>
            </div>

            <div className="rounded-lg bg-[#faf7f2] p-4">
              <p className="text-sm text-gray-500">
                Total inventory quantity
              </p>

              <p className="mt-1 text-xl font-bold text-[#9a5b35]">
                {totalStock.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Low stock summary */}
        <div className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Low Stock Alerts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Products requiring attention.
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-2">
              <AlertTriangle
                size={20}
                className="text-amber-600"
              />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {recentLowStock.length === 0 ? (
              <div className="rounded-lg bg-green-50 px-4 py-6 text-center">
                <Package
                  size={30}
                  className="mx-auto mb-2 text-green-600"
                />

                <p className="font-medium text-green-800">
                  All products are sufficiently stocked.
                </p>

                <p className="mt-1 text-sm text-green-700">
                  No low stock alerts at the moment.
                </p>
              </div>
            ) : (
              recentLowStock.map((product) => {
                const isOutOfStock =
                  Number(product.stock) === 0;

                return (
                  <div
                    key={product.id}
                    className="flex items-start justify-between gap-3 border-b border-[#f0e7e0] pb-4 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-800">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Reorder level: {product.reorderLevel}{" "}
                        {product.unit}
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${isOutOfStock
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                          }`}
                      >
                        {isOutOfStock
                          ? "Out of stock"
                          : "Low stock"}
                      </span>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-lg font-bold ${isOutOfStock
                            ? "text-red-600"
                            : "text-amber-600"
                          }`}
                      >
                        {product.stock}
                      </p>

                      <p className="text-xs text-gray-500">
                        {product.unit}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-5 rounded-lg bg-[#faf7f2] p-3">
            <p className="text-sm text-gray-600">
              Total items needing attention
            </p>

            <p className="mt-1 text-2xl font-bold text-[#9a5b35]">
              {lowStockProducts.length}
            </p>
          </div>
        </div>
      </div>

      {/* Inventory details table */}
      <div className="overflow-hidden rounded-xl border border-[#eadfd6] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#eadfd6] p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Inventory Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A summary of your bakery products and stock levels.
            </p>
          </div>

          <span className="w-fit rounded-lg bg-[#f5e8df] px-3 py-2 text-sm font-medium text-[#9a5b35]">
            {totalProducts} Products
          </span>
        </div>

        {products.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Package
              size={42}
              className="mx-auto mb-3 text-gray-300"
            />

            <h3 className="font-semibold text-gray-700">
              No products added
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add your bakery products to see inventory details.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-[#faf7f2] text-sm text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Product
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Category
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Current Stock
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Stock Value
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0e7e0]">
                {products.slice(0, 5).map((product) => {
                  const stock = Number(product.stock || 0);
                  const reorderLevel = Number(
                    product.reorderLevel || 0
                  );

                  const isOutOfStock = stock === 0;
                  const isLowStock = stock <= reorderLevel;

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-[#faf7f2]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {product.category}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {stock.toLocaleString()} {product.unit}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${isOutOfStock
                              ? "bg-red-100 text-red-700"
                              : isLowStock
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                            }`}
                        >
                          {isOutOfStock
                            ? "Out of Stock"
                            : isLowStock
                              ? "Low Stock"
                              : "In Stock"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right text-sm font-medium text-gray-800">
                        {formatCurrency(
                          stock * Number(product.price || 0)
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {products.length > 5 && (
          <div className="border-t border-[#eadfd6] px-5 py-3 text-sm text-gray-500">
            Showing 5 of {products.length} products.
          </div>
        )}
      </div>
    </div>
  );
}