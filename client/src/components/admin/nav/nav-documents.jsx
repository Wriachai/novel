"use client"

import {
  IconBook,
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { NavLink, Link } from "react-router-dom";

const NavDocuments = ({ items }) => {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        <NavLink to="/admin/mynovel">
          {({ isActive }) => (
            <SidebarMenuItem className="flex items-center gap-2 pb-1">
              <SidebarMenuButton
                className={`${isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                  : "hover:bg-primary/5"}`}>
                <IconBook />
                <span>MyNovel</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </NavLink>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavDocuments
