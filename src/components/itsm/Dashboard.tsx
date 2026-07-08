import React from "react"
import { LayoutDashboard, Users, BarChart3, Puzzle, Wrench } from "lucide-react"

type Ticket = {
  id: string
  subject: string
  assignedTo: string
  group?: string
  status: string
}

const SAMPLE_TICKETS: Ticket[] = [
  { id: "1312312", subject: "Unable to browse", assignedTo: "Howard Stern", group: "Network", status: "Pending" },
  { id: "1312313", subject: "Blue screen occurred", assignedTo: "Administrator", group: "Network", status: "Resolved" },
  { id: "1312314", subject: "Upgrade to IE Browser", assignedTo: "Thufail", group: "", status: "Pending" },
  { id: "1312315", subject: "Request with Conversation", assignedTo: "Network tech", group: "", status: "Assigned" },
  { id: "1312316", subject: "Add success", assignedTo: "Administrator", group: "Network", status: "Resolved" },
]

function TopBar() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
      <div className="flex items-center gap-6">
        <div className="text-blue-600 font-semibold">Dashboard</div>
        <nav className="text-sm text-slate-600 flex gap-4">
          <a className="flex items-center gap-1.5 hover:underline">
            <LayoutDashboard size={16} /> Dashboard
          </a>
          <a className="flex items-center gap-1.5 hover:underline">
            <Users size={16} /> Teams
          </a>
          <a className="flex items-center gap-1.5 hover:underline">
            <BarChart3 size={16} /> Reports
          </a>
          <a className="flex items-center gap-1.5 hover:underline">
            <Puzzle size={16} /> Modules
          </a>
          <a className="flex items-center gap-1.5 hover:underline">
            <Wrench size={16} /> Tools
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <input placeholder="Search Request ID" className="border rounded px-3 py-1 text-sm" />
        <div className="w-8 h-8 bg-slate-100 rounded-full" />
      </div>
    </div>
  )
}

function TicketTable({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center text-sm text-slate-600">
            <button className="text-blue-600">Actions</button>
            <button className="text-slate-500">Select Technicians</button>
            <button className="text-slate-500">Assign</button>
          </div>
          <div className="text-slate-500 text-xs">Total tickets <span className="font-medium">312</span></div>
        </div>
      </div>
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3"><input type="checkbox" /></th>
            <th className="px-4 py-3">Ticket ID</th>
            <th className="px-4 py-3">Subjects</th>
            <th className="px-4 py-3">Assigned to</th>
            <th className="px-4 py-3">Group</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} className="border-b last:border-b-0 hover:bg-slate-50">
              <td className="px-4 py-3"><input type="checkbox" /></td>
              <td className="px-4 py-3 text-slate-700">{t.id}</td>
              <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">{t.subject}</td>
              <td className="px-4 py-3">{t.assignedTo}</td>
              <td className="px-4 py-3">{t.group || "-"}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  t.status === "Resolved" ? "bg-green-100 text-green-700" : t.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-sky-100 text-sky-700"
                }`}>{t.status}</span>
              </td>
              <td className="px-4 py-3 text-slate-500">✉ ✎ ⌖</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 text-sm text-slate-500">Showing 1-5 of 312</div>
    </div>
  )
}

function RightPanel() {
  return (
    <aside className="w-80 pl-6">
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <h3 className="text-sm font-medium mb-2">Create New Ticket (Quick)</h3>
        <div className="space-y-2">
          <input placeholder="Requester name" className="w-full border px-2 py-1 rounded text-sm" />
          <select className="w-full border px-2 py-1 rounded text-sm">
            <option>Site - associate to</option>
          </select>
          <textarea placeholder="Description" className="w-full border px-2 py-1 rounded text-sm" rows={3} />
          <button className="w-full bg-blue-600 text-white py-2 rounded">+ Create Ticket</button>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="text-sm font-medium mb-2">Recent Items</h4>
        <ul className="space-y-2 text-slate-600 text-sm">
          <li className="flex items-center justify-between"><span>file_nameEU_2913</span><span className="text-xs text-slate-400">5.32 mb</span></li>
          <li className="flex items-center justify-between"><span>file_nameEU_2913</span><span className="text-xs text-slate-400">5.32 mb</span></li>
          <li className="flex items-center justify-between"><span>file_nameEU_2913</span><span className="text-xs text-slate-400">5.32 mb</span></li>
        </ul>
      </div>
    </aside>
  )
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="max-w-full mx-auto">
        <TopBar />
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-600">All tasks</div>
                <button className="text-blue-600 text-sm">Import request</button>
                <button className="text-slate-600 text-sm">Settings</button>
              </div>
              <div className="text-sm text-slate-500">Help & Support</div>
            </div>
            <TicketTable tickets={SAMPLE_TICKETS} />
          </div>
          <RightPanel />
        </div>
      </div>
    </div>
  )
}
