import { useMemo, useState } from "react";
import {
  BarChart3,
  Package,
  Boxes,
  AlertTriangle,
  Wallet,
  Download,
  Printer,
  Search,
  FileText,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import type { Product } from "../types";

interface ReportsProps {
  products: Product[];
}

type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";

export default function Reports({ products }: ReportsProps) {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const inventoryValue = products.reduce(
    (total, product) => total + product.stock * product.price,
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      product.stock > 0 && product.stock <= product.reorderLevel
  );

  const outOfStockProducts = products.filter(
    (product) => product.stock <= 0
  );

  const inStockProducts = products.filter(
    (product) => product.stock > product.reorderLevel
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 2,
    }).format(amount);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      let matchesStatus = true;

      if (stockFilter === "in-stock") {
        matchesStatus = product.stock > product.reorderLevel;
      } else if (stockFilter === "low-stock") {
        matchesStatus =
          product.stock > 0 && product.stock <= product.reorderLevel;
      } else if (stockFilter === "out-of-stock") {
        matchesStatus = product.stock <= 0;
      }

      return matchesSearch && matchesStatus;
    });
  }, [products, search, stockFilter]);

  const categoryData = useMemo(() => {
    const categories = new Map<
      string,
      { count: number; quantity: number; value: number }
    >();

    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      const current = categories.get(category) ?? {
        count: 0,
        quantity: 0,
        value: 0,
      };

      current.count += 1;
      current.quantity += product.stock;
      current.value += product.stock * product.price;

      categories.set(category, current);
    });

    return Array.from(categories.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.value - a.value);
  }, [products]);

  const maxCategoryValue = Math.max(
    ...categoryData.map((category) => category.value),
    0
  );

  const getStatus = (product: Product) => {
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

  const exportCSV = () => {
    const headers = [
      "Product Name",
      "Category",
      "Current Stock",
      "Unit",
      "Reorder Level",
      "Unit Price (NPR)",
      "Total Value (NPR)",
      "Stock Status",
    ];

    const rows = filteredProducts.map((product) => [
      product.name,
      product.category,
      product.stock,
      product.unit,
      product.reorderLevel,
      product.price,
      product.stock * product.price,
      getStatus(product).label,
    ]);

    const escapeCSV = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    // UTF-8 BOM helps spreadsheet applications display text correctly.
    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `safal-bakery-inventory-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review inventory performance and generate bakery stock reports.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Report date:{" "}
            {new Date().toLocaleDateString("en-NP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#eadfd6] bg-white px-4 py-2.5 text-sm font-semibold text-[#9a5b35] transition hover:bg-[#f3e5db]"
          >
            <Printer size={17} />
            Print
          </button>

          <button
            type="button"
            onClick={exportCSV}
            disabled={filteredProducts.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9a5b35] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#814a2b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          subtitle="Registered products"
          icon={<Package size={23} />}
          iconClass="bg-[#f3e5db] text-[#9a5b35]"
        />

        <SummaryCard
          title="Total Stock"
          value={totalStock.toLocaleString()}
          subtitle="Combined stock quantities"
          icon={<Boxes size={23} />}
          iconClass="bg-blue-100 text-blue-700"
        />

        <SummaryCard
          title="Inventory Value"
          value={formatCurrency(inventoryValue)}
          subtitle="Based on stock × unit price"
          icon={<Wallet size={23} />}
          iconClass="bg-green-100 text-green-700"
        />

        <SummaryCard
          title="Low Stock Items"
          value={lowStockProducts.length.toLocaleString()}
          subtitle={`${outOfStockProducts.length} currently out of stock`}
          icon={<AlertTriangle size={23} />}
          iconClass="bg-amber-100 text-amber-700"
        />
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Stock Status */}
        <section className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#f3e5db] p-2.5 text-[#9a5b35]">
              <BarChart3 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Stock Status Overview
              </h2>
              <p className="text-sm text-gray-500">
                Distribution of registered products
              </p>
            </div>
          </div>

          {totalProducts === 0 ? (
            <EmptyChartMessage />
          ) : (
            <div className="mt-6 space-y-5">
              <StockStatusBar
                label="In Stock"
                count={inStockProducts.length}
                total={totalProducts}
                barClass="bg-green-500"
                textClass="text-green-700"
              />

              <StockStatusBar
                label="Low Stock"
                count={lowStockProducts.length}
                total={totalProducts}
                barClass="bg-amber-500"
                textClass="text-amber-700"
              />

              <StockStatusBar
                label="Out of Stock"
                count={outOfStockProducts.length}
                total={totalProducts}
                barClass="bg-red-500"
                textClass="text-red-700"
              />
            </div>
          )}

          <div className="mt-6 rounded-lg bg-[#faf7f2] p-4">
            <p className="text-sm text-gray-500">
              Products requiring attention
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {lowStockProducts.length + outOfStockProducts.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Low-stock and out-of-stock products combined
            </p>
          </div>
        </section>

        {/* Category Report */}
        <section className="rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#f3e5db] p-2.5 text-[#9a5b35]">
              <TrendingUp size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Inventory Value by Category
              </h2>
              <p className="text-sm text-gray-500">
                Estimated value of each product category
              </p>
            </div>
          </div>

          {categoryData.length === 0 ? (
            <EmptyChartMessage />
          ) : (
            <div className="mt-6 space-y-5">
              {categoryData.map((item) => {
                const percentage =
                  maxCategoryValue > 0
                    ? (item.value / maxCategoryValue) * 100
                    : 0;

                return (
                  <div key={item.category}>
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {item.category}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {item.count} product{item.count !== 1 ? "s" : ""} ·{" "}
                          {item.quantity} units
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-gray-900">
                        {formatCurrency(item.value)}
                      </p>
                    </div>

                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-gray-100"
                      role="progressbar"
                      aria-label={`${item.category} inventory value`}
                      aria-valuemin={0}
                      aria-valuemax={maxCategoryValue}
                      aria-valuenow={item.value}
                    >
                      <div
                        className="h-full rounded-full bg-[#9a5b35] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Detailed Report */}
      <section className="overflow-hidden rounded-xl border border-[#eadfd6] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-[#eadfd6] p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#f3e5db] p-2.5 text-[#9a5b35]">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Detailed Inventory Report
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} displayed
              </p>
            </div>
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
                placeholder="Search product or category..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20 sm:w-64"
              />
            </div>

            <select
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(event.target.value as StockFilter)
              }
              aria-label="Filter inventory report by stock status"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#9a5b35] focus:ring-2 focus:ring-[#9a5b35]/20"
            >
              <option value="all">All Statuses</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
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
                <th className="px-5 py-4 font-semibold">Total Value</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const status = getStatus(product);

                return (
                  <tr
                    key={product.id}
                    className="transition hover:bg-[#faf7f2]/70"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">
                        {product.name}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        ID: {product.id.slice(0, 8)}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      {product.stock} {product.unit}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {product.reorderLevel} {product.unit}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatCurrency(product.price)}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatCurrency(product.stock * product.price)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e5db] text-[#9a5b35]">
                      <FileText size={25} />
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-900">
                      {products.length === 0
                        ? "No inventory data available"
                        : "No matching products"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {products.length === 0
                        ? "Add products to generate inventory reports."
                        : "Try changing your search or status filter."}
                    </p>

                    {(search || stockFilter !== "all") && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#9a5b35] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#814a2b]"
                      >
                        <RefreshCw size={16} />
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>

            {filteredProducts.length > 0 && (
              <tfoot className="border-t-2 border-[#eadfd6] bg-[#faf7f2]">
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-4 text-right font-semibold text-gray-700"
                  >
                    Total Inventory Value
                  </td>
                  <td className="px-5 py-4 font-bold text-[#9a5b35]">
                    {formatCurrency(
                      filteredProducts.reduce(
                        (total, product) =>
                          total + product.stock * product.price,
                        0
                      )
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {filteredProducts.length} items
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>

      {/* Report Footer */}
      <div className="flex flex-col justify-between gap-2 text-xs text-gray-500 sm:flex-row sm:items-center">
        <p>Safal Bakery · Inventory Management System</p>
        <p>
          Generated on{" "}
          {new Date().toLocaleString("en-NP", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }

          aside,
          nav,
          header,
          button,
          input,
          select {
            display: none !important;
          }

          .min-h-screen {
            min-height: 0 !important;
          }

          section,
          .rounded-xl {
            break-inside: avoid;
            box-shadow: none !important;
          }

          .overflow-x-auto {
            overflow: visible !important;
          }

          table {
            width: 100% !important;
            min-width: 0 !important;
            font-size: 10px !important;
          }

          th,
          td {
            padding: 6px !important;
          }
        }
      `}</style>
    </div>
  );
}

/* Summary card component */
interface SummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}: SummaryCardProps) {
  return (
    <div className="min-w-0 rounded-xl border border-[#eadfd6] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="mt-2 break-words text-xl font-bold text-gray-900 sm:text-2xl">
            {value}
          </h2>
        </div>

        <div className={`shrink-0 rounded-lg p-3 ${iconClass}`}>
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

/* Stock status progress bar */
interface StockStatusBarProps {
  label: string;
  count: number;
  total: number;
  barClass: string;
  textClass: string;
}

function StockStatusBar({
  label,
  count,
  total,
  barClass,
  textClass,
}: StockStatusBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-semibold ${textClass}`}>
          {count} ({percentage.toFixed(1)}%)
        </span>
      </div>

      <div
        className="h-3 overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={count}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${barClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* Empty chart state */
function EmptyChartMessage() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center text-center">
      <div className="rounded-full bg-[#f3e5db] p-4 text-[#9a5b35]">
        <BarChart3 size={28} />
      </div>
      <p className="mt-3 font-semibold text-gray-800">
        No data to display
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Add products to see inventory analytics here.
      </p>
    </div>
  );
}
