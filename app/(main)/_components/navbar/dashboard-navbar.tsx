"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { SheetCollaboratorsCart } from "../sheet-collaborators-cart";
import { ModalLogout } from "@/app/(auth)/_components/modal-logout";
import { LogoMain } from "@/components/logo-main";
import { cn } from "@/lib/utils";

export const DashboardNavbar = ({
  businessName,
  isAdmin,
}: {
  isAdmin: boolean;
  businessName?: string;
}) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div
      className={cn(
        `fixed top-0 z-40 p-1 border-b min-h-[60px] max-h-[60px] text-white w-full bg-primary shadow-sm flex items-center`,
        isAdmin && "bg-emerald-600"
      )}
    >
      <div className="mx-auto w-full mt-1">
        <div className="mx-3 flex items-center justify-between">
          <div className="p-2 flex gap-1 relative">
            <Button
              className="md:hidden"
              variant="ghost"
              onClick={(e) => setOpenSidebar(!openSidebar)}
            >
              <Menu />
            </Button>
            <DashboardSidebar
              isAdmin={isAdmin}
              openSidebar={openSidebar}
              setOpenSidebar={setOpenSidebar}
            />

            <LogoMain goRoot />
          </div>

          {isAdmin && <span>Admin</span>}
          {!isAdmin && <span className="text-white">{businessName}</span>}
          {isAdmin && <SheetCollaboratorsCart />}

          <ModalLogout />
        </div>
      </div>
    </div>
  );
};
