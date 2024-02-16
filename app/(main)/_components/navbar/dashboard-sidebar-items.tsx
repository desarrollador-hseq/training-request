"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Link from "next/link";

export const DashboardSidebarItems = ({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = useMemo(
    () =>
      pathname === href ||
      (href !== "/dashboard" &&
        pathname?.startsWith(`${href}`) &&
        href !== "/admin" &&
        pathname?.startsWith(`${href}`)),
    [pathname, href]
  );

  const onClick = () => {
    router.push(href);
  };

  const isAdmin = href.includes("admin");

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full">
        <button
          onClick={onClick}
          type="button"
          className={cn(
            "w-full h-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
            isActive &&
              "text-blue-950 bg-sky-200/20 hover:bg-sky-200/20 hover:text-blue-950"
          )}
        >
          <div className="flex items-center gap-x-2 py-4">
            <Icon
              size={22}
              className={cn("text-slate-400", isActive && "text-slate-200")}
            />

            <span
              className={cn("text-slate-400", isActive && "text-slate-200")}
            >
              {label}
            </span>
          </div>
          <div
            className={cn(
              "ml-auto opacity-0 border-2 border-secondary h-full transition-all animate-in",
              isActive && "opacity-100"
            )}
          />
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-full h-full">
        {!isAdmin && href !== "/dashboard" && href !== "/dashboard/entrenamiento/certificados" && (
          <ContextMenuItem asChild className="bg-slate-100 hover:bg-slate-200">
            <Link href={`${href}/crear`} >
              Crear
            </Link>
          </ContextMenuItem>
        )}
        <ContextMenuItem className="bg-slate-100 hover:bg-slate-200">
          <a target="_blank" href={href} rel="noopener noreferrer">
            Abrir en otra pestaña
          </a>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
