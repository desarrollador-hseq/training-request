import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon, XCircle } from "lucide-react";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full ",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
        danger: "bg-red-500 border-red-700 text-white",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
  danger: XCircle,
};

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];
  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="w-5 h-5 mr-2" />
      <span className="font-bold"> {label}</span>
    </div>
  );
};
