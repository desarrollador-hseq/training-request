"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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

interface DashboardSidebarProps {
  openSidebar: boolean;
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
}

export const DashboardSidebar = ({
  openSidebar,
  setOpenSidebar,
}: DashboardSidebarProps) => {
  const { status, data: session } = useSession();
  const { setLoadingApp } = useLoading();

  const [routes, setRoutes] = useState<
    { icon: LucideIcon; label: string; href: string }[]
  >([]);

  useEffect(() => {
    setLoadingApp(true);
    const loadNavbarItems = async () => {
      if (status !== "loading") {
        if (status === "authenticated") {
          if (session) {
            await setRoutes(
              session.user.role === "ADMIN" ? adminRoutes : dashRoutes
            );
          }
        }
      }
    };
    loadNavbarItems();

    setLoadingApp(false);
  }, [status, session]);

  return (
    <>
      <div className="fixed left-0 top-[64px]">
        <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
          <SheetContent side="left" className="p-0 w-56">
            <DashboardSidebarContent routes={routes} />
          </SheetContent>
        </Sheet>

        <div className="w-56 h-full min-h-screen hidden md:flex fixed left-0 top-[59px]">
          <DashboardSidebarContent routes={routes} />
        </div>
      </div>
    </>
  );
};
