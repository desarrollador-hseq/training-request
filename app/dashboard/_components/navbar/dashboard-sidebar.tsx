"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Clipboard, ClipboardCheck, Menu, Users } from "lucide-react";
import { DashboardSidebarContent } from "./dashboard-sidebar-content";

const routes = [
  { icon: Clipboard, label: "Inicio", href: "/dashboard" },
  { icon: ClipboardCheck, label: "Solicitudes", href: "/dashboard/entrenamiento/solicitudes" },
  { icon: Users, label: "Certificados", href: "/dashboard/entrenamiento/certificados" },
  { icon: ClipboardCheck, label: "Colaboradores", href: "/dashboard/entrenamiento/colaboradores" },
];

export const DashboardSidebar = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger
          defaultChecked
          className="md:hidden pr-4 hover:opacity-75 transition"
        >
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-56">
          <DashboardSidebarContent routes={routes} />
        </SheetContent>
      </Sheet>

      <div className="w-56 h-full min-h-screen hidden md:flex absolute left-0 top-[52px]">
        <DashboardSidebarContent routes={routes} />
      </div>
    </>
  );
};
