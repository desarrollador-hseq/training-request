"use client"

import { useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const LogoMain = ({
  goRoot,
  className,
  height = 70,
  width = 90,
}: {
  goRoot?: boolean;
  height?: number;
  width?: number;
  className?: string;
}) => {
  const pathname = usePathname();
  const isDashboard = useMemo(() => pathname.includes("dashboard"), [pathname]);
  const router = useRouter();

  const navigate = () => {
    if (!goRoot) return;

    router.push(!isDashboard ? "/admin" : "/dashboard");
  };
  return (
    <div
      onClick={navigate}
      className={cn(
        "inline",
        goRoot &&
          "cursor-pointer flex flex-col justify-center items-center bg-blue-100 p-1 rounded-sm shadow-md"
      )}
    >
      <Image
        className={cn("inline", goRoot && "cursor-pointer", className)}
        src="/hseq-entrenamiento.png"
        alt="logo de Claro"
        height={height}
        width={width}
        style={{
          width: "auto",
          height: "auto",
        }}
      />

      <span className="text-[10px] text-secondary font-semibold self-end">
        by Grupo HSEQ
      </span>
    </div>
  );
};
