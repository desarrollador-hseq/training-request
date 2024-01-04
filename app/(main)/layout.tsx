"use server";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Ban } from "lucide-react";
import { DashboardNavbar } from "./_components/navbar/dashboard-navbar";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { ScrollUp } from "@/components/scroll-up";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    redirect("/");
  }

  return (
    <main className="relative flex flex-col h-full min-h-screen m-0 p-0 mx-auto">
      <DashboardNavbar />
      <div className="mt-1 md:ml-[223px] min-h-screen max-w-[1500px] w-auto">
        <div className="mx-1 min-h-full">
          {session.user.isValid ? children : <NotValidCompany />}
        </div>
      </div>
      <ScrollUp />
    </main>
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

export default DashboardLayout;
