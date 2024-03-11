import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { TabsCollaborators } from "./_components/tabs-collaborators";

const crumbs = [{ label: "colaboradores", path: "colaboradores" }];

const AdminCollaboratorPage = async () => {
  const trainingRequestCollaborator = await db.trainingRequestCollaborator.findMany({
    where: {
      isScheduled: true,
      trainingRequest: {
        NOT: {
          state: "CANCELLED",
        },
      },
    },
    include: {
      courseLevel: {
        select: {
          name: true,
          course: {
            select: {
              shortName: true
            }
          }
        },
      },
      collaborator: {
        include: {
          company: {
            select: {
              nit: true,
            },
          },
          certificates: {
            include: {
              courseLevel: {
                include: {
                  course: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });


  return (
    <div>
      <TitleOnPage text="Colaboradores" bcrumb={crumbs} />

      <TabsCollaborators trainingRequestCollaborator={trainingRequestCollaborator} />
    </div>
  );
};

export default AdminCollaboratorPage;
