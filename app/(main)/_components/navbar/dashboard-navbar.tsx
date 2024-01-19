"use client";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
// import { LogoGrupoHseq } from "@/components/logo-grupo-hseq";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
export const DashboardNavbar = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { status, data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const memoizedCompany = useMemo(() => {
    if (status !== "loading" && status === "authenticated" && session) {
      return session.user;
    }
    return null;
  }, [status, session]);

  return (
    <div
      className={`fixed top-0 z-40 p-1 border-b min-h-[60px] max-h-[60px] text-white w-full bg-primary shadow-sm flex items-center ${
        memoizedCompany?.role === "ADMIN" && "bg-red-500"
      }`}
    >
      <div className="mx-auto w-full max-w-[1500px] mt-1">
        <div className="mx-3 flex items-center justify-between">
          <div className="p-2 flex gap-1 relative">
            <Button variant="ghost" onClick={(e) => setOpenSidebar(!openSidebar)}>
              <Menu className="md:hidden" />
            </Button>
            <DashboardSidebar
              openSidebar={openSidebar}
              setOpenSidebar={setOpenSidebar}
            />
            {/* <LogoGrupoHseq goRoot className="flex" /> */}
            logo
            {/* <LogoClaro goRoot className="flex" /> */}
          </div>

          {memoizedCompany?.role === "ADMIN" && <span>Admin</span>}

          <span className="text-white">{memoizedCompany?.businessName}</span>

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
