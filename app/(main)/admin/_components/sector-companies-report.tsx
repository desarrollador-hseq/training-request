


import { Chart } from '@/components/chart';
import { Company } from '@prisma/client';
import React, { useMemo } from 'react'

export const SectorCompaniesReport = ({companies}: {companies: Company[]}) => {
    
    const countCompaniesBySector = useMemo(() => {
        const sectorCounts: any = {};
        companies.forEach((company) => {
          sectorCounts[`${company.sector}`] = (sectorCounts[`${company.sector}`] || 0) + 1;
        });
        return sectorCounts;
      }, [companies]);
    
      // Calculate total collaborators based on sector counts
      const totalCollaborators = Object.values(countCompaniesBySector).reduce(
        (total: any, count) => total + count,
        0
      );
    
      // Generate chart data based on sector counts
      const chartData = Object.entries(countCompaniesBySector).map(([sector, count]) => ({
        name: sector,
        value: count,
      }));
    
   
      const option = {
        title: {
          text: "",
          show: "false",
        },
        tooltip: {
          trigger: "item",
          show: true,
          formatter: function (params: any) {
            return `${params.name}: ${params.data.num}`;
          },
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: "estado:",
            type: "pie",
            radius: "55%",
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
    
      return <Chart option={option} title="Empresas según sector" />;
}
