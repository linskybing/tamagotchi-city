import { Home, BarChart3 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "首頁", url: "/", icon: Home },
  { title: "Status", url: "/status", icon: BarChart3 },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar
      className="border-r"
      style={{ borderColor: 'var(--tp-grayscale-200)', ["--sidebar-width" as any]: "100vw" } as any}
    >
      <SidebarContent className="relative" style={{ backgroundColor: '#EDF8FA' }}>
        <SidebarGroup>
          <SidebarGroupLabel className="tp-h3-semibold" style={{ color: 'var(--tp-grayscale-700)' }}>
            選單
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="tp-body-regular hover:bg-opacity-50"
                      style={{ color: 'var(--tp-grayscale-700)' }}
                      activeClassName="font-semibold"
                      activeStyle={{
                        backgroundColor: 'var(--tp-primary-100)',
                        color: 'var(--tp-primary-700)'
                      }}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
