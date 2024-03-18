"use client";

import React, { ReactNode, useState } from "react";
import { Card, CardHeader } from "./ui/card";

interface KpiCardProps {
  icon: ReactNode;
  btnStatistics?: ReactNode;
  title: string;
  color: string;
  number: number | string;
}

export const KpiCard = ({ number, title, color, icon: Icon, btnStatistics }: KpiCardProps) => {
  
  return (
    <Card className="p-1 flex flex-col justify-center  border-secondary rounded-xl">
      <CardHeader className="p-2">
        <div className="grid grid-cols-3 grid-rows-2 gap-2 place-content-center place-items-center">
          <div
            className={`row-span-2 rounded-xl bg-${color}-50 p-1 flex justify-center items-center w-20 h-20`}
          >
            {Icon}
          </div>

          <div className="text-gray-700 font-bold text-xl md:text-2xl col-span-2 row-span-2 flex flex-col ">
            {title}
            <div className="flex flex-col justify-around  h-14">
              <div className="text-3xl font-bold text-secondary text-center">
                {number}
              </div>

              {btnStatistics}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
