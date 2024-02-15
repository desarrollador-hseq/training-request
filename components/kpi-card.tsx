import React from "react";
import { Card } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  icon: LucideIcon;
  title: string;
  color: string;
  number: number | string;
}

export const KpiCard = ({ icon: Icon, title, number, color }: KpiCardProps) => {
  return (
    <Card className="p-3 flex justify-center">
      <div className="flex items-center space-x-4 h-[150px] lg:flex-row flex-col">
        <div
          className={`flex items-center justify-center rounded-full bg-${color}-50 text-${color}-400 p-2`}
        >
          <Icon className=" w-10 h-10 " />
        </div>
        <div className="flex flex-col justify-around  h-24">
          <div className="text-gray-700 font-bold text-2xl">{title}</div>
          <div className="text-3xl font-bold text-secondary text-center">
            {number}
          </div>
        </div>
      </div>
    </Card>
  );
};
