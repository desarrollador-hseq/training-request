"use client";

import React, { ReactNode } from "react";
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
    <Card className="p-4 border border-secondary/50 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-md relative">
      <CardHeader className="p-0 space-y-4">
        <div className="flex items-start justify-between">
          <div
            className={`rounded-lg bg-${color}-50 p-3 flex justify-center items-center`}
          >
            {Icon}
          </div>
          {btnStatistics && (
            <div className="text-gray-500 hover:text-gray-700 transition-colors">
              {btnStatistics}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {number}
          </p>
        </div>
      </CardHeader>
    </Card>
  );
};
