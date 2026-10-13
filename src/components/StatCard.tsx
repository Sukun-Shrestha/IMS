import type { LucideIcon } from "lucide-react";

export default function StatCard({ title, value, note, icon: Icon, alert = false }: { title: string; value: string; note: string; icon: LucideIcon; alert?: boolean }) {
  return (
    <div className="rounded-2xl border border-[#eadfd6] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#806d5e]">{title}</p>
          <p className="mt-2 text-2xl font-bold text-[#24170f]">{value}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-xl ${alert ? "bg-red-50 text-red-500" : "bg-[#f8eadf] text-[#9a5b35]"}`}><Icon size={23}/></div>
      </div>
      <p className={`mt-3 text-xs font-medium ${alert ? "text-red-500" : "text-emerald-600"}`}>{note}</p>
    </div>
  );
}