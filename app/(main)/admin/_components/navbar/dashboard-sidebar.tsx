"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Clipboard,
  ClipboardCheck,
  LucideIcon,
  Menu,
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
    icon: ClipboardCheck,
    label: "Empresas",
    href: "/admin/entrenamiento/empresas",
  },
];

export const DashboardSidebar = () => {
  const { status, data: session } = useSession();
  const [routes, setRoutes] = useState<
    { icon: LucideIcon; label: string; href: string }[]
  >([]);

  useEffect(() => {
    if (status !== "loading") {
      if (status === "authenticated") {
        if (session) {
          setRoutes(session.user.role === "ADMIN" ? adminRoutes : dashRoutes);
        }
      }
    }
  }, [status, session]);

  return (
    <>
      <div>
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
      </div>
    </>
  );
};
