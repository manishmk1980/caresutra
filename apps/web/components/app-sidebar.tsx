"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import {
  ActivityIcon,
  CalendarClockIcon,
  CircleHelpIcon,
  ClipboardListIcon,
  FileChartColumnIcon,
  FileTextIcon,
  HeartPulseIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  SearchIcon,
  Settings2Icon,
  ShieldCheckIcon,
  UploadCloudIcon,
  UsersIcon,
} from "lucide-react"

const data = {
  user: {
    name: "CareSutra Admin",
    email: "admin@caresutra.in",
    avatar: "/brand/emblem.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Customer Records",
      url: "/admin/customer-records",
      icon: <UsersIcon />,
    },
    {
      title: "New Customer",
      url: "/admin/customer-records/new",
      icon: <ClipboardListIcon />,
    },
    {
      title: "Activity",
      url: "/admin/activity",
      icon: <ActivityIcon />,
    },
    {
      title: "Appointments",
      url: "/admin/appointments",
      icon: <CalendarClockIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
  documents: [
    {
      name: "Documents",
      url: "/admin/documents",
      icon: <FileTextIcon />,
    },
    {
      name: "Uploads",
      url: "/admin/uploads",
      icon: <UploadCloudIcon />,
    },
    {
      name: "Reports",
      url: "/admin/reports",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Insurance",
      url: "/admin/services/insurance",
      icon: <ShieldCheckIcon />,
    },
    {
      name: "Loans",
      url: "/admin/services/loans",
      icon: <LandmarkIcon />,
    },
    {
      name: "Health Services",
      url: "/admin/services/health",
      icon: <HeartPulseIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/admin">
                <img
                  src="/brand/emblem.png"
                  alt="CareSutra"
                  className="size-6 rounded-md object-contain"
                />
                <span className="text-base font-semibold">CareSutra Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
