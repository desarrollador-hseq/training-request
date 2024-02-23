"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Building2,
  BookOpenText,
  ClipboardCheck,
  UsersRound,
  ScrollText,
  Home,
  Contact2,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DashboardSidebarContent } from "./dashboard-sidebar-content";



const dashRoutes = [
  { icon: Home, label: "Inicio", href: "/dashboard" },
  {
    icon: ClipboardCheck,
    label: "Solicitudes",
    href: "/dashboard/entrenamiento/solicitudes",
  },
  {
    icon: ScrollText,
    label: "Certificados",
    href: "/dashboard/entrenamiento/certificados",
  },
  {
    icon: UsersRound,
    label: "Colaboradores",
    href: "/dashboard/entrenamiento/colaboradores",
  },
];
const adminRoutes = [
  { icon: Home, label: "Inicio", href: "/admin" },
  {
    icon: ClipboardCheck,
    label: "Solicitudes",
    href: "/admin/entrenamiento/solicitudes",
  },
  {
    icon: ScrollText,
    label: "Certificados",
    href: "/admin/entrenamiento/certificados",
  },
  {
    icon: UsersRound,
    label: "Colaboradores",
    href: "/admin/entrenamiento/colaboradores",
  },
  {
    icon: Building2,
    label: "Empresas",
    href: "/admin/entrenamiento/empresas",
  },
  {
    icon: BookOpenText,
    label: "Cursos",
    href: "/admin/entrenamiento/cursos",
  },
  {
    icon: Contact2,
    label: "Entrenadores",
    href: "/admin/entrenamiento/entrenadores",
  },
];

interface DashboardSidebarProps {
  openSidebar: boolean;
  isAdmin: boolean;
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
}

export const DashboardSidebar = ({
  isAdmin,
  openSidebar,
  setOpenSidebar,
}: DashboardSidebarProps) => {
  return (
    <>
      <div className="fixed left-0 top-[64px] ">
        <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
          <SheetContent side="left" className="p-0 w-56">
            <DashboardSidebarContent
              routes={isAdmin ? adminRoutes : dashRoutes}
            />
          </SheetContent>
        </Sheet>

        <div className="w-56 h-full min-h-screen hidden md:flex fixed left-0 top-[60px] z-40">
          <DashboardSidebarContent
            routes={isAdmin ? adminRoutes : dashRoutes}
          />
        </div>
      </div>
    </>
  );
};
