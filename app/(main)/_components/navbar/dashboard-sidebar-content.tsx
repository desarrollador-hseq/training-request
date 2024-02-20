import { LucideIcon } from "lucide-react";
import { DashboardSidebarItems } from "./dashboard-sidebar-items";
import { LogoMain } from "@/components/logo-main";
import { LogoGHseq } from "@/components/logo-ghseq";

interface DashboardSidebarContentProps {
  routes: { href: string; icon: LucideIcon; label: string }[];
}

export const DashboardSidebarContent = ({
  routes,
}: DashboardSidebarContentProps) => (
  <div className="h-full w-full border-r flex flex-col overflow-y-auto bg-primary ">
    <div className="flex flex-col w-full h-full max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-140px)]">
      <div className="md:hidden flex justify-start items-center pl-7 h-14">
      <LogoMain />
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
   <div className="w-full flex justify-center">
   <LogoGHseq />
   </div>
  </div>
);
