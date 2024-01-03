"use client";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
// import { LogoGrupoHseq } from "@/components/logo-grupo-hseq";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const DashboardNavbar = () => {
  const { status, data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    if (status !== "loading") {
      if (status === "authenticated") {
        if (session) {
          setIsAdmin(session.user.role === "ADMIN");
        }
      }
    }
  }, [status, session]);
  return (
    <div className="relative p-1 border-b min-h-[50px] max-h-[60px] text-white w-full bg-primary shadow-sm flex items-center">
      <div className="mx-auto w-full max-w-[1500px] mt-1">
        <div className="mx-3 flex items-center justify-between">
          <div className="p-2 flex gap-1">
            <DashboardSidebar />
            {/* <LogoGrupoHseq goRoot className="flex" /> */}
            logo
            {/* <LogoClaro goRoot className="flex" /> */}
          </div>

          {
            isAdmin && (
              <span>Admin</span>
            )
          }

          <Link href="/logout" className="w-fit h-full flex items-center">
            <Button variant="ghost" className="bg-slate-500 gap-2">
              Salir
              <LogOut className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
