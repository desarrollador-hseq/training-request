"use client";

import { TrainingRequest } from "@prisma/client";
import { Chart } from "@/components/chart";

interface CollaboratorsReportsProps {
  requests: TrainingRequest[] | null;
}

export const RequestReport = ({ requests }: CollaboratorsReportsProps) => {
  const stateTranslations: { [key: string]: string } = {
    ACTIVE: "Activas",
    EXECUTED: "Ejecutadas",
    CANCELLED: "Canceladas",
  };

  const countCollaboratorsByState = () => {
    const counts = {
      ACTIVE: 0,
      EXECUTED: 0,
      CANCELLED: 0,
      // Agrega aquí otros estados necesarios
    };

    requests?.forEach((collaborator) => {
      if (collaborator.state !== "PENDING") {
        counts[collaborator.state] += 1;
      }
    });

    return counts;
  };

  const collaboratorsByState = countCollaboratorsByState();

  const totalCollaborators = Object.values(collaboratorsByState).reduce(
    (total, count) => total + count,
    0
  );

  const chartData = Object.entries(collaboratorsByState).map(
    ([state, count]) => ({
      value: ((count / totalCollaborators) * 100).toPrecision(3),
      name: stateTranslations[state],
    })
  );

  const option = {
    title: {
      text: "Solicitudes por estado",
      subtext: "",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: "false",

    },
    series: [
      {
        name: "estado:",
        type: "pie",
        radius: "65%",
        label: {
            show: true,
            fontWeight: "bold",
            formatter(param: any) {
              return param.name + " (" + param.value + "%)";
            },
          },
        data: totalCollaborators !== 0 ? chartData : [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return <Chart option={option} title="" />;
};
