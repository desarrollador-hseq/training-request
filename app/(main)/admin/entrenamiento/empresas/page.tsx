import { TitleOnPage } from "@/components/title-on-page";
import { TabsCompanies } from "./_components/tabs-companies";
import { db } from "@/lib/db";

const crumbs = [{ label: "empresas", path: "empresas" }];

const CompaniesPage = async () => {
  const companies = await db.company.findMany({
    orderBy: {
      businessName: "desc",
    },
  });
  return (
    <div>
      <TitleOnPage text="Empresas" bcrumb={crumbs} />

      <TabsCompanies companies={companies} />
    </div>
  );
};

export default CompaniesPage;
