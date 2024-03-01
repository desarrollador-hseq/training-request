import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddCoachesForm } from "../_components/add-coaches-form";
import { authOptions } from "@/lib/authOptions";

const crumbs = [
  { label: "Entrenadores", path: "/admin/entrenamiento/entrenadores" },
  { label: "Editar", path: "editar" },
];

const EditCoursePage = async ({ params }: { params: { coachId: string } }) => {
  const session = await getServerSession(authOptions);
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
              Editar entrenador:{" "}
              <span className="font-semibold text-2xl">
                {coach?.fullname} - {coach.position}
              </span>
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
        <AddCoachesForm
          coach={coach}
          canManagePermissions={session?.user.canManagePermissions || false}
        />
      </div>
    </div>
  );
};

export default EditCoursePage;
