import React, { useState } from "react"
import { LayoutDashboard, Users, BarChart3, Puzzle, Wrench, Search, Plus, Settings2, UserCheck, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    <div className="flex items-center justify-between border-b pb-4 mb-4">
      <div className="flex items-center gap-6">
        <div className="text-primary font-semibold">Dashboard</div>
        <nav className="text-sm flex gap-4">
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
        <div className="relative">
          <Search size={16} className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input placeholder="Search Request ID" className="pl-8 w-64" />
        </div>
        <Avatar>
          <AvatarFallback className="bg-muted text-muted-foreground">JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

function TicketTable({ tickets }: { tickets: Ticket[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Settings2 className="mr-2 h-4 w-4" /> Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>New Action 1</DropdownMenuItem>
              <DropdownMenuItem>New Action 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <UserCheck className="mr-2 h-4 w-4" /> Select Technicians
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>New Select 1</DropdownMenuItem>
              <DropdownMenuItem>New Select 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <UserPlus className="mr-2 h-4 w-4" /> Assign
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>New Assign 1</DropdownMenuItem>
              <DropdownMenuItem>New Assign 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-sm text-muted-foreground">
          Total tickets <span className="font-medium">312</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Input type="checkbox" className="h-4 w-4" /></TableHead>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Assigned to</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id} className="hover:bg-muted/50">
                <TableCell><Input type="checkbox" className="h-4 w-4" /></TableCell>
                <TableCell className="text-slate-700">{t.id}</TableCell>
                <TableCell className="text-primary hover:underline cursor-pointer">{t.subject}</TableCell>
                <TableCell>{t.assignedTo}</TableCell>
                <TableCell>{t.group || "-"}</TableCell>
                <TableCell>
                  <Badge variant={t.status === "Resolved" ? "default" : t.status === "Pending" ? "secondary" : "outline"}>
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">✉ ✎ ⌖</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 text-sm text-muted-foreground border-t">Showing 1-5 of 312</div>
      </CardContent>
    </Card>
  )
}

function RightPanel() {
  return (
    <aside className="w-80 pl-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create New Ticket (Quick)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Requester name" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Site - associate to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="site">Site A</SelectItem>
            </SelectContent>
          </Select>
          <textarea placeholder="Description" className="w-full border rounded px-2 py-1.5 text-sm min-h-[80px]" />
          <Button className="w-full">
            <Plus size={16} className="mr-2" />
            Create Ticket
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>file_nameEU_2913</span>
              <span className="text-xs text-muted-foreground">5.32 mb</span>
            </li>
            <li className="flex items-center justify-between">
              <span>file_nameEU_2913</span>
              <span className="text-xs text-muted-foreground">5.32 mb</span>
            </li>
            <li className="flex items-center justify-between">
              <span>file_nameEU_2913</span>
              <span className="text-xs text-muted-foreground">5.32 mb</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  )
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-full mx-auto">
        <TopBar />
        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All tasks</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="link" size="sm" className="h-auto p-0">Import request</Button>
                <Button variant="link" size="sm" className="h-auto p-0">Settings</Button>
              </div>
              <div className="text-sm text-muted-foreground">Help & Support</div>
            </div>
            <TicketTable tickets={SAMPLE_TICKETS} />
          </div>
          <RightPanel />
        </div>
      </div>
    </div>
  )
}
