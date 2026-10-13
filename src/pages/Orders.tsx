import { useEffect, useState } from "react";
import { Plus, Trash2, ShoppingCart } from "lucide-react";

import type { Order, Supplier } from "../types";
import {
  getOrders,
  saveOrders,
  getSuppliers,
} from "../data";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    supplier: "",
    date: new Date().toISOString().split("T")[0],
    items: "",
    total: "",
  });

  // Load data
  useEffect(() => {
    setOrders(getOrders());
    setSuppliers(getSuppliers());
  }, []);

  // Add order
  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.supplier ||
      !form.date ||
      !form.items ||
      !form.total
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newOrder: Order = {
      id: `PO-${Date.now()}`,
      supplier: form.supplier,
      date: form.date,
      items: Number(form.items),
      total: Number(form.total),
      status: "Pending",
    };

    const updatedOrders = [
      ...orders,
      newOrder,
    ];

    setOrders(updatedOrders);
    saveOrders(updatedOrders);

    setForm({
      supplier: "",
      date: new Date()
        .toISOString()
        .split("T")[0],
      items: "",
      total: "",
    });

    setShowForm(false);
  };

  // Delete order
  const deleteOrder = (id: string) => {
    if (!confirm("Delete this order?")) {
      return;
    }

    const updatedOrders = orders.filter(
      (order) => order.id !== id
    );

    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  };

  // Change order status
  const changeStatus = (
    id: string,
    status: Order["status"]
  ) => {
    const updatedOrders = orders.map((order) =>
      order.id === id
        ? { ...order, status }
        : order
    );

    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const receivedOrders = orders.filter(
    (order) => order.status === "Received"
  ).length;

  const totalAmount = orders.reduce(
    (total, order) => total + order.total,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Purchase Orders
          </h1>

          <p className="text-sm text-gray-500">
            Create and manage your bakery purchase orders.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#9a5b35] px-4 py-2 text-white hover:bg-[#B5651D]"
        >
          <Plus size={18} />
          New Order
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <SummaryCard
          title="Total Orders"
          value={totalOrders}
        />

        <SummaryCard
          title="Pending"
          value={pendingOrders}
        />

        <SummaryCard
          title="Received"
          value={receivedOrders}
        />

        <SummaryCard
          title="Total Amount"
          value={`Rs. ${totalAmount.toLocaleString()}`}
        />
      </div>

      {/* Add Order Form */}
      {showForm && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">
            Create Purchase Order
          </h2>

          <form
            onSubmit={handleAddOrder}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {/* Supplier */}
            <select
              value={form.supplier}
              onChange={(e) =>
                setForm({
                  ...form,
                  supplier: e.target.value,
                })
              }
              className="rounded-lg border p-3"
            >
              <option value="">
                Select Supplier
              </option>

              {suppliers.map((supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.name}
                >
                  {supplier.name}
                </option>
              ))}
            </select>

            {/* Date */}
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
              className="rounded-lg border p-3"
            />

            {/* Items */}
            <input
              type="number"
              min="1"
              placeholder="Number of Items"
              value={form.items}
              onChange={(e) =>
                setForm({
                  ...form,
                  items: e.target.value,
                })
              }
              className="rounded-lg border p-3"
            />

            {/* Total */}
            <input
              type="number"
              min="0"
              placeholder="Total Amount"
              value={form.total}
              onChange={(e) =>
                setForm({
                  ...form,
                  total: e.target.value,
                })
              }
              className="rounded-lg border p-3"
            />

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
              >
                Create Order
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-lg border px-5 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>

          {suppliers.length === 0 && (
            <p className="mt-4 text-sm text-orange-600">
              No suppliers available. Add a supplier first
              from the Suppliers section.
            </p>
          )}
        </div>
      )}

      {/* Orders */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingCart
              size={45}
              className="mx-auto mb-3 text-gray-300"
            />

            <h2 className="font-semibold text-gray-700">
              No purchase orders
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Click "New Order" to create your first purchase
              order.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm">
                    Order ID
                  </th>

                  <th className="px-6 py-4 text-left text-sm">
                    Supplier
                  </th>

                  <th className="px-6 py-4 text-left text-sm">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm">
                    Items
                  </th>

                  <th className="px-6 py-4 text-left text-sm">
                    Total
                  </th>

                  <th className="px-6 py-4 text-left text-sm">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-sm">
                    Delete
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 font-medium">
                      {order.id}
                    </td>

                    <td className="px-6 py-4">
                      {order.supplier}
                    </td>

                    <td className="px-6 py-4">
                      {order.date}
                    </td>

                    <td className="px-6 py-4">
                      {order.items}
                    </td>

                    <td className="px-6 py-4">
                      Rs.{" "}
                      {order.total.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          changeStatus(
                            order.id,
                            e.target
                              .value as Order["status"]
                          )
                        }
                        className={`rounded-full border-0 px-3 py-1 text-xs font-medium ${order.status === "Received"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Received">
                          Received
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          deleteOrder(order.id)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}