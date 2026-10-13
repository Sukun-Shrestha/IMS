import { Save } from "lucide-react";
import PageTitle from "../components/PageTitle";

export default function Settings() {
  return <main><PageTitle title="Settings" description="Manage Safal Bakery inventory system settings." />
    <div className="max-w-3xl rounded-2xl border border-[#eadfd6] bg-white p-6">
      <h2 className="font-bold">Bakery Information</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Bakery Name<input defaultValue="Safal Bakery" className="mt-2 w-full rounded-xl border border-[#e4d8cf] px-3 py-2.5 outline-none" /></label>
        <label className="text-sm font-medium">Admin Email<input defaultValue="admin@safalbakery.com" className="mt-2 w-full rounded-xl border border-[#e4d8cf] px-3 py-2.5 outline-none" /></label>
        <label className="text-sm font-medium">Phone Number<input defaultValue="01-5000000" className="mt-2 w-full rounded-xl border border-[#e4d8cf] px-3 py-2.5 outline-none" /></label>
        <label className="text-sm font-medium">Low Stock Threshold<input defaultValue="10" type="number" className="mt-2 w-full rounded-xl border border-[#e4d8cf] px-3 py-2.5 outline-none" /></label>
      </div>
      <div className="mt-6 border-t pt-5"><h2 className="font-bold">Notifications</h2>
        <label className="mt-4 flex items-center gap-3 text-sm">
          <input type="checkbox" defaultChecked /> Notify admin when stock reaches reorder level</label></div>
      <button className="mt-6 flex items-center gap-2 rounded-xl bg-[#9a5b35] px-5 py-2.5 text-sm font-semibold text-white">
        <Save size={17} /> Save Changes</button>
    </div>
  </main>;
}