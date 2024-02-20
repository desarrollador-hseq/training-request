import Link from "next/link";
import { redirect } from "next/navigation";
import { Ban } from "lucide-react";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AddCoachesForm } from "../_components/add-coaches-form";


const crumbs = [
  { label: "Cursos", path: "/admin/entrenamiento/cursos" },
  { label: "Editar", path: "editar" },
];

const EditCoursePage = async ({ params }: { params: { coachId: string } }) => {
  const { coachId } = params;

  const coach = await db.coach.findUnique({
    where: {
      id: coachId,
      active: true,
    },
  });

  if (!coach) {
    redirect("/admin/entrenamiento/entrenadores/");
  }

  return (
    <div className="">
      <div className="w-full flex justify-between items-center">
        <TitleOnPage
          text={
            <span>
              Editar Curso:{" "}
              <span className="font-semibold text-2xl">{coach?.fullname} - {coach.position}</span>
            </span>
          }
          bcrumb={crumbs}
        >
          <div className="flex gap-5">
            {/* <DeactivateCourse course={course} /> */}
          </div>
        </TitleOnPage>
      </div>
      <div className="w-full flex flex-col gap-3">
        <AddCoachesForm coach={coach} />  
      </div>
    </div>
  );
};

export default EditCoursePage;
