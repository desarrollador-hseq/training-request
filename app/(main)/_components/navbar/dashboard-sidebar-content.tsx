import { LucideIcon } from "lucide-react";
import { DashboardSidebarItems } from "./dashboard-sidebar-items";

interface DashboardSidebarContentProps {
  routes: { href: string; icon: LucideIcon; label: string }[];
}

export const DashboardSidebarContent = ({
  routes,
}: DashboardSidebarContentProps) => (
  <div className="h-full w-full border-r flex flex-col overflow-y-auto bg-primary ">
    <div className="flex flex-col w-full h-full max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-120px)]">
      <div className="md:hidden flex justify-start items-center pl-7 ">
        logo
      </div>
      {routes.map((route) => (
    
        <DashboardSidebarItems
          key={route.href}
          href={route.href}
          icon={route.icon}
          label={route.label}
        />
      
      
      ))}
    </div>
  </div>
);
