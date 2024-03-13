"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, HomeIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

export const TitleOnPage = ({
  text,
  bcrumb,
  children,
  className,
}: {
  text: ReactNode;
  bcrumb?: { label: string; path: string; click?: boolean }[];
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <Card
      className={cn(
        "w-full min-h-20 h-fit flex items-center justify-between my-2 bg-gradient-to-b from-secondary/80 to-secondary",
        className
      )}
    >
      <CardContent className="w-full min-h-20 flex items-center justify-between p-3 flex-col md:flex-row">
        <div className="w-full flex flex-col ml-2">
          <h2 className="text-3xl font-semibold text-white">{text}</h2>

          {bcrumb && (
            <nav className="flex mt-1" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1">
                <li className="inline-flex items-start ">
                  <Link
                    href="/"
                    className="inline-flex items-center text-xs font-medium  text-sky-400"
                  >
                    <HomeIcon className="w-4 h-4 text-white mr-1" />
                    Inicio
                  </Link>
                </li>

                {bcrumb.length > 0 &&
                  bcrumb?.map((crumb, index) => {
                    if (crumb.label === "inicio")
                      return <div key={crumb.path}></div>;
                    return (
                      <li key={crumb.path}>
                        <div className="flex items-center">
                          <ChevronRight className="w-5 h-5 text-white" />
                          {bcrumb.length - 1 === index ? (
                            <span className="text-slate-300 text-xs">
                              {crumb.label}
                            </span>
                          ) : crumb.click === false ? (
                            <span className="text-xs  text-slate-300">
                              {crumb.label}
                            </span>
                          ) : (
                            <Link
                              href={crumb.path}
                              className="text-xs font-medium text-sky-400"
                            >
                              {crumb.label}
                            </Link>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ol>
            </nav>
          )}
        </div>
        <div>{children}</div>
      </CardContent>
    </Card>
  );
};
