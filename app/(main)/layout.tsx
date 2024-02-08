"use server";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Ban } from "lucide-react";
import { DashboardNavbar } from "./_components/navbar/dashboard-navbar";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { ScrollUp } from "@/components/scroll-up";
import { CollaboratorsCartProvider } from "@/components/providers/collaborators-cart-provider";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    redirect("/");
  }

  return (
    <CollaboratorsCartProvider>
      <main className="relative flex flex-col h-full min-h-screen m-0 p-0 mx-auto bg-blue-100/50">
        <DashboardNavbar
          isAdmin={session.user.role === "ADMIN"}
          businessName={session.user.businessName}
        />
        <div className="mt-1 md:pl-[223px] min-h-screen xl:flex justify-center items-start xl:w-full relative">
          <div className="mx-1 min-h-full mt-[56px] max-w-[1200px] w-full">
            {session.user.isValid ? children : <NotValidCompany />}
          </div>
        </div>
        <ScrollUp />
      </main>
    </CollaboratorsCartProvider>
  );
};

const NotValidCompany = () => {
  return (
    <div className="w-full min-h-screen h-full">
      <div className="gap-3 bg-red-700 flex justify-center items-center p-10 border-2 border-red-500 shadow-lg rounded-md">
        <Ban className="w-14 h-14 text-white" />
        <h2 className="text-white text-xl">
          La empresa se encuentra en proceso de verificación y por eso no puede
          acceder actualmente, cuando sea verificada se le notificará al correo
          de registro
        </h2>
      </div>
    </div>
  );
};

export default MainLayout;
