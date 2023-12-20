import { ReactNode } from "react";
import { CollapsibleContent } from "./ui/collapsible";
import { TableCell, TableRow } from "./ui/table";
import { cn } from "@/lib/utils";

export const CollapsibleContentTable = ({
  children,
  colSpan,
  openCollapsible
}: {
  children: ReactNode;
  colSpan: number;
  openCollapsible: boolean;
}) => {
  return (
    <CollapsibleContent asChild className="CollapsibleContent w-full">
      <TableRow className={cn( openCollapsible && "bg-slate-100 hover:bg-slate-100")}>
        <TableCell className="animation" colSpan={colSpan}>{children}</TableCell>
      </TableRow>
    </CollapsibleContent>
  );
};
