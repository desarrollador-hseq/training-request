import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TitleOnPage } from "@/components/title-on-page";
import { EditProfileCompanyForm } from "./_components/edit-profile-company-form";
import { db } from "@/lib/db";

const crumbs = [{ label: "Perfil", path: "perfil" }];

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    redirect("/");
  }
  
  const company = await db.company.findUnique({
      where: {
          id: session.user.id,
          active: true
        }
    })
    
    
    if (!company) {
      redirect("/dashboard");
    }


  return (
    <div>
      <TitleOnPage text="Datos de la empresa" bcrumb={crumbs} />

      <div>
        <EditProfileCompanyForm company={company} />
      </div>

    </div>
  );
};

export default ProfilePage;
