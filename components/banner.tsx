import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon, Info, XCircle } from "lucide-react";
import { ReactNode } from "react";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full ",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-yellow-800",
        success: "bg-emerald-700 border-emerald-800 text-white font-semibold",
        danger: "bg-red-500 border-red-700 text-white",
        info: "bg-blue-300 border-blue-400 text-blue-900",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
  children?: ReactNode;
  className?: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
  danger: XCircle,
  info: Info,
};

export const Banner = ({
  label,
  variant,
  children,
  className,
}: BannerProps) => {
  const Icon = iconMap[variant || "warning"];
  return (
    <div
      className={cn(
        bannerVariants({ variant }),
        className,
        "flex justify-between items-center w-auto"
      )}
    >
      <span className="flex justify-center items-center">
        <Icon className="w-5 h-5 mr-2" />
        <span className="font-bold"> {label}</span>
      </span>
      <div>{children}</div>
    </div>
  );
};
