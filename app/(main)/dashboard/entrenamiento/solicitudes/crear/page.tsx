import React from "react";
import { db } from "@/lib/db";
import { CreateTrainingForm } from "./_components/create-training-form";
import { Card } from "@/components/ui/card";
import { TitleOnPage } from "@/components/title-on-page";

const bcrumb = [
  {label: "Solicitud", path: "/dashboard/entrenamiento/solicitudes" },
  {label: "Crear", path: "crear" },
]

const CreateTrainingPage = async () => {
  const courses = await db.course.findMany({ where: { active: true } });

  return (
    <div>
      <TitleOnPage text="Crear Solicitud" bcrumb={bcrumb} />
      <Card>
        <CreateTrainingForm courses={courses} />
      </Card>
    </div>
  );
};

export default CreateTrainingPage;
