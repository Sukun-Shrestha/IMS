import { NavLink } from "react-router-dom";

import {
  BarChart3,
  Boxes,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Wheat,
  X,
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const navigation = [
  {
    title: "OVERVIEW",
    items: [
      {
        to: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "INVENTORY",
    items: [
      {
        to: "/products",
        label: "Products",
        icon: Package,
      },
      {
        to: "/stock",
        label: "Stock Management",
        icon: Boxes,
      },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      {
        to: "/orders",
        label: "Orders",
        icon: ShoppingCart,
      },
      {
        to: "/suppliers",
        label: "Suppliers",
        icon: Truck,
      },
      {
        to: "/reports",
        label: "Reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "PREFERENCES",
    items: [
      {
        to: "/settings",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col
          overflow-y-auto
          border-r border-stone-800
          bg-stone-900 text-white
          shadow-2xl shadow-stone-950/20
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-24 shrink-0 items-center justify-between border-b border-stone-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-700 text-white shadow-lg shadow-black/20">
              <Wheat size={25} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Safal Bakery
              </h1>

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                Inventory System
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-800 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 px-3 py-6">
          {navigation.map((group) => (
            <div key={group.title}>
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-stone-500">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-all duration-200 ${isActive
                        ? "bg-amber-700 text-white shadow-md shadow-black/10"
                        : "text-stone-300 hover:bg-stone-800 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-amber-200" />
                        )}

                        <Icon
                          size={19}
                          strokeWidth={isActive ? 2.2 : 1.8}
                          className={
                            isActive
                              ? "shrink-0 text-white"
                              : "shrink-0 text-stone-400 transition group-hover:text-white"
                          }
                        />

                        <span className="flex-1">{label}</span>

                        {isActive && (
                          <ChevronRight
                            size={15}
                            className="text-amber-100"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bakery information card */}
        <div className="px-3 pb-4">
          <div className="relative overflow-hidden rounded-2xl border border-stone-700 bg-stone-800 p-4">
            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-amber-700/20 blur-xl" />

            <div className="relative">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-700/20 text-amber-300">
                <Wheat size={19} />
              </div>

              <h3 className="text-sm font-semibold text-white">
                Fresh every day
              </h3>

              <p className="mt-1 text-xs leading-5 text-stone-400">
                Keep your bakery organized and your inventory under control.
              </p>
            </div>
          </div>
        </div>

        {/* Admin profile */}
        <div className="shrink-0 border-t border-stone-800 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-stone-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-700 text-sm font-bold text-white">
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                Admin
              </p>

              <p className="mt-1 truncate text-xs text-stone-400">
                Bakery Administrator
              </p>
            </div>

            <span
              className="h-2 w-2 shrink-0 rounded-full bg-emerald-400"
              title="Online"
            />
          </div>
        </div>
      </aside>
    </>
  );
}