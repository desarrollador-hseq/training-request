"use client";

import { useState } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { CourseLevel } from "@prisma/client";

interface CollaboratorCourseLevelProps {
  getValue: any;
  row: any;
  column: any;
  table: any;
  courseLevels: any;
  courseId: string;
}

export const CollaboratorCourseLevel = ({
  row,
  column,
  table,
  courseId,
}: CollaboratorCourseLevelProps) => {
  // row.original.name;
  const [levelsCourse, setLevelCourses] = useState<CourseLevel[] | null>();
  const [name, setName] = useState<string | null>();



  const { updateData } = table.options.meta;
  const [selectedCourseLevel, setSelectedCourseLevel] =
    useState<CourseLevel | null>();

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>{name}</MenubarTrigger>
        <MenubarContent>
          {levelsCourse &&
            levelsCourse.map((courseLevel) => (
              <MenubarItem
                onClick={() => {
                  setSelectedCourseLevel(courseLevel);
                  updateData(column.id, courseLevel);
                }}
                key={courseLevel.id}
              >
                {courseLevel.name}
              </MenubarItem>
            ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
