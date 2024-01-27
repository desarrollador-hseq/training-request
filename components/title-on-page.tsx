"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, HomeIcon } from "lucide-react";

export const TitleOnPage = ({
  text,
  bcrumb,
}: {
  text: ReactNode;
  bcrumb?: { label: string; path: string; click?: boolean }[];
}) => {
  return (
    <div className="w-full h-20 flex items-center">
      <div className="w-full flex flex-col ml-2">
        <h2 className="text-3xl font-extrabold text-primary/80">{text}</h2>

        {bcrumb && (
          <nav className="flex mt-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1">
              <li className="inline-flex items-center ">
                <Link
                  href="/"
                  className="inline-flex items-center text-xs font-medium  text-blue-500"
                >
                  <HomeIcon className="w-4 h-4 text-primary/60 mr-1" />
                  Inicio
                </Link>
              </li>

              {bcrumb?.map((crumb, index) => {
                if (crumb.label === 'inicio') return <div key={crumb.path}></div>;
                return (
                  <li key={crumb.path}>
                    <div className="flex items-center">
                      <ChevronRight className="w-5 h-5 text-primary/60" />
                      {bcrumb.length - 1 === index ? (
                        <span className="text-slate-500 text-xs">
                          {crumb.label}
                        </span>
                      ) : (
                        crumb.click === false ? (
                          <span className="text-xs font-medium text-gray-500">
                            {crumb.label}
                          </span>
                        ) : (
                          <Link href={crumb.path} className="text-xs font-medium text-blue-600">
                            {crumb.label}
                          </Link>
                        )
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
};