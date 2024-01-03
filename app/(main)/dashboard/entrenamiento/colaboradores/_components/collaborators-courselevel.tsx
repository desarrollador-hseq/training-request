"use client";

import { useEffect, useState } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import axios from "axios";
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

  useEffect(() => {
    if (courseId) {
      const getCourseLevel = async () => {
        const res = await axios.get(`/api/courses/${courseId}/course-levels`);
        setLevelCourses(res.data);
      };
      getCourseLevel();
    }
  }, []);

  useEffect(() => {
    const name = levelsCourse
      ?.filter((fil) => {
        return fil.id == row.original.courseLevelId;
      })
      .map((map) => map.name);
    setName(name);
  }, [levelsCourse]);

  const { updateData } = table.options.meta;
  const [selectedCourseLevel, setSelectedCourseLevel] = useState<CourseLevel | null>();

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
