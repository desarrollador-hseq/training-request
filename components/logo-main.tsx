"use client"

import { useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const LogoMain = ({
  goRoot,
  className,
  height = 44,
  width = 140,
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
          "cursor-pointer"
      )}
    >
      <Image
        className={cn("inline", goRoot && "cursor-pointer", className)}
        src="/hseq-entrenamiento-white.png"
        alt="logo de Hseq entrenamiento - GrupoHSEQ"
        height={height}
        width={width}
        style={{
          width: width,
          height: "auto",
        }}
        priority
      />
    </div>
  );
};
