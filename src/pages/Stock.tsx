import { useEffect, useState } from "react";
import { RefreshCw, Plus, Minus, Package } from "lucide-react";
import type { Product } from "../types";
import { getProducts, saveProducts } from "../data";

export default function Stock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = () => {
    setProducts(getProducts());
  };

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      loadStock();
      setRefreshing(false);
    }, 500);
  };

  const changeStock = (
    id: string,
    amount: number
  ) => {
    const updated = products.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          stock: Math.max(0, product.stock + amount),
        };
      }

      return product;
    });

    setProducts(updated);
    saveProducts(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Stock Management
          </h1>

          <p className="text-sm text-gray-500">
            Manage your current inventory.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-lg bg-[#9a5b35]   px-4 py-2 text-white hover:bg-[#B5651D] disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Empty */}
      {products.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center">
          <Package
            size={45}
            className="mx-auto mb-3 text-gray-300"
          />

          <h2 className="font-semibold text-gray-700">
            No stock available
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Add products from the Products section first.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center">
                    Update
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {products.map((product) => {
                  const low =
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
                        <strong>{product.stock}</strong>{" "}
                        {product.unit}
                      </td>

                      <td className="px-6 py-4">
                        {low ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                            In Stock
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              changeStock(product.id, -1)
                            }
                            className="rounded-lg border p-2 hover:bg-red-50"
                          >
                            <Minus size={16} />
                          </button>

                          <button
                            onClick={() =>
                              changeStock(product.id, 1)
                            }
                            className="rounded-lg border p-2 hover:bg-green-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}