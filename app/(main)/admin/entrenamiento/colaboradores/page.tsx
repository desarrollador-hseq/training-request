import { TitleOnPage } from "@/components/title-on-page";
// import { TabsCompanies } from "./_components/tabs-companies";
import { db } from "@/lib/db";
import { TabsCollaborators } from "./_components/tabs-collaborators";
// import { TabsCertificates } from "./_components/tabs-certificates";

const crumbs = [{ label: "colaboradores", path: "colaboradores" }];

const AdminCollaboratorPage = async () => {
  const collaborators = await db.trainingRequestCollaborator.findMany({
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
              name: true
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
  // const collaborators = await db.collaborator.findMany({
  //   include: {
  //     certificates: true,
  //     trainingRequestsCollaborators: {
  //       where: {
  //         isScheduled: true,
  //       },
  //     },
  //   },
  // });

  console.log({
    collaboratorSchedule: collaborators.map((co) => co.courseLevel?.name),
  });

  return (
    <div>
      <TitleOnPage text="Colaboradores" bcrumb={crumbs} />

      <TabsCollaborators collaborators={collaborators.map((co) => co)} />
    </div>
  );
};

export default AdminCollaboratorPage;
