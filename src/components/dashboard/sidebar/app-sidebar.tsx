import { useState, useEffect } from "react";
import { Home, Code, GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavUser } from "./user-info";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    requiresBuyer: true
  },
  {
    title: "Script",
    url: "/dashboard/script",
    icon: Code,
    requiresBuyer: true
  },
  {
    title: "Updates",
    url: "/dashboard/updates",
    icon: GalleryVerticalEnd,
    requiresBuyer: true
  },
];

export function AppSidebar() {
  const [user, setUser] = useState({
    name: "Loading...",
    avatar: "",
    id: "Loading...",
    buyer: false,
  });

  useEffect(() => {
    // Fetch user data after the sidebar is rendered
    fetch("/api/user/info")
      .then((response) => response.json())
      .then((data) => {
        const discordAvatar = data.discordAvatar || "";
        const discordName = data.discordUsername || "Unknown User";
        const discordId = data.discordId || "Unknown ID";
        const buyer = data.hasRole || false;
        setUser({ name: discordName, avatar: discordAvatar, id: discordId, buyer: buyer  });
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        setUser({ name: "Error", avatar: "", id: "", buyer: false }); // Fallback in case of error
      });
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
