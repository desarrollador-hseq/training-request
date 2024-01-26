"use client";
import { cn } from "@/lib/utils";
import { CollapsibleContent } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SubtitleSeparator } from "@/components/subtitle-separator";
import { CourseLevel } from "@prisma/client";
import { MoreHorizontal, Pencil } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AdminSimpleCourselevels } from "./admin-simple-courselevels";

type CollaboratorTableCollapsibleContentProps = {
  openCollapsible: boolean;
  courseLevels: CourseLevel[];
  courseId: string;
};

export const AdminCoursesTableCollapsibleContent = ({
  openCollapsible,
  courseLevels,
  courseId,
}: CollaboratorTableCollapsibleContentProps) => {
  return (
    <CollapsibleContent asChild className="CollapsibleContent w-full">
      <TableRow
        className={cn(openCollapsible && "bg-slate-100 hover:bg-slate-100")}
      >
        <TableCell className="animation" colSpan={12}>
          <AdminSimpleCourselevels  courseLevels={courseLevels} courseId={courseId} />
        </TableCell>
      </TableRow>
    </CollapsibleContent>
  );
};
