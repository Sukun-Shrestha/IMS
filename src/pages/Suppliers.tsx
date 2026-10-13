import { useEffect, useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";

import type { Supplier } from "../types";
import {
  getSuppliers,
  saveSuppliers,
} from "../data";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  // Load suppliers
  useEffect(() => {
    setSuppliers(getSuppliers());
  }, []);

  // Add supplier
  const handleAddSupplier = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.contact ||
      !form.email ||
      !form.address
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newSupplier: Supplier = {
      id: crypto.randomUUID(),
      name: form.name,
      contact: form.contact,
      email: form.email,
      address: form.address,
    };

    const updatedSuppliers = [
      ...suppliers,
      newSupplier,
    ];

    setSuppliers(updatedSuppliers);
    saveSuppliers(updatedSuppliers);

    setForm({
      name: "",
      contact: "",
      email: "",
      address: "",
    });

    setShowForm(false);
  };

  // Delete supplier
  const deleteSupplier = (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this supplier?"
      )
    ) {
      return;
    }

    const updatedSuppliers = suppliers.filter(
      (supplier) => supplier.id !== id
    );

    setSuppliers(updatedSuppliers);
    saveSuppliers(updatedSuppliers);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Suppliers
          </h1>

          <p className="text-sm text-gray-500">
            Manage your bakery suppliers.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#9a5b35]  px-4 py-2 text-white transition hover:bg-[#B5651D]"
        >
          <Plus size={18} />
          Add Supplier
        </button>
      </div>

      {/* Add Supplier Form */}
      {showForm && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">
            Add New Supplier
          </h2>

          <form
            onSubmit={handleAddSupplier}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {/* Name */}
            <input
              type="text"
              placeholder="Supplier Name *"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            {/* Contact */}
            <input
              type="text"
              placeholder="Contact Number *"
              value={form.contact}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact: e.target.value,
                })
              }
              className="rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            {/* Address */}
            <input
              type="text"
              placeholder="Address *"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              className="rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            {/* Buttons */}
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
              >
                Save Supplier
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
        </div>
      )}

      {/* Suppliers */}
      {suppliers.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center shadow-sm">
          <Users
            size={48}
            className="mx-auto mb-4 text-gray-300"
          />

          <h2 className="font-semibold text-gray-700">
            No suppliers added
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Click "Add Supplier" to add your first supplier.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              {/* Supplier Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                    <Users
                      size={21}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {supplier.name}
                    </h3>

                    <p className="text-xs text-gray-400">
                      Supplier
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    deleteSupplier(supplier.id)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Contact:</strong>{" "}
                  {supplier.contact}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {supplier.email}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {supplier.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}