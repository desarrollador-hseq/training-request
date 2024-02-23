"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { SheetCollaboratorsCart } from "../sheet-collaborators-cart";
import { LogoMain } from "@/components/logo-main";
import { cn } from "@/lib/utils";
import { DropdownCompany } from "./dropdown-company";

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
        `fixed top-0 z-50 p-1 border-b border-secondary min-h-[60px] max-h-[60px] text-white w-full bg-primary shadow-sm flex items-center`,
        isAdmin && "bg-secondary"
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

          <div className="flex gap-5 items-center">
            {isAdmin && <span>Administrador</span>}
            <DropdownCompany companyName={businessName} />
            {isAdmin && <SheetCollaboratorsCart />}
          </div>
        </div>
      </div>
    </div>
  );
};
