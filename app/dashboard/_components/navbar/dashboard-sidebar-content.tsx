import { LucideIcon } from "lucide-react";
// import { LogoGrupoHseq } from "@/components/logo-grupo-hseq";
import { DashboardSidebarItems } from "./dashboard-sidebar-items";
// import { LogoClaro } from "@/components/logo-claro";

interface DashboardSidebarContentProps {
  routes: { href: string; icon: LucideIcon; label: string }[];
}

export const DashboardSidebarContent = ({ routes }: DashboardSidebarContentProps) => (
  <div className="h-full w-full border-r flex flex-col overflow-y-auto bg-primary">
    <div className="flex flex-col w-full">
      <div className="md:hidden h-14 flex justify-start items-center pl-7">
        {/* <LogoGrupoHseq goRoot className="flex" /> */}
        {/* <LogoClaro goRoot className="flex" /> */}
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
