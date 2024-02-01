"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Building2,
  Clipboard,
  ClipboardCheck,
  HardHat,
  LucideIcon,
  Users,
} from "lucide-react";
import { DashboardSidebarContent } from "./dashboard-sidebar-content";
import { useLoading } from "@/components/providers/loading-provider";

const dashRoutes = [
  { icon: Clipboard, label: "Inicio", href: "/dashboard" },
  {
    icon: ClipboardCheck,
    label: "Solicitudes",
    href: "/dashboard/entrenamiento/solicitudes",
  },
  {
    icon: Users,
    label: "Certificados",
    href: "/dashboard/entrenamiento/certificados",
  },
  {
    icon: ClipboardCheck,
    label: "Colaboradores",
    href: "/dashboard/entrenamiento/colaboradores",
  },
];
const adminRoutes = [
  { icon: Clipboard, label: "Inicio", href: "/admin" },
  {
    icon: ClipboardCheck,
    label: "Solicitudes",
    href: "/admin/entrenamiento/solicitudes",
  },
  {
    icon: Users,
    label: "Certificados",
    href: "/admin/entrenamiento/certificados",
  },
  {
    icon: ClipboardCheck,
    label: "Colaboradores",
    href: "/admin/entrenamiento/colaboradores",
  },
  {
    icon: Building2,
    label: "Empresas",
    href: "/admin/entrenamiento/empresas",
  },
  {
    icon: HardHat,
    label: "Cursos",
    href: "/admin/entrenamiento/cursos",
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
      <div className="fixed left-0 top-[64px]">
        <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
          <SheetContent side="left" className="p-0 w-56">
            <DashboardSidebarContent
              routes={isAdmin ? adminRoutes : dashRoutes}
            />
          </SheetContent>
        </Sheet>

        <div className="w-56 h-full min-h-screen hidden md:flex fixed left-0 top-[59px]">
          <DashboardSidebarContent
            routes={isAdmin ? adminRoutes : dashRoutes}
          />
        </div>
      </div>
    </>
  );
};
