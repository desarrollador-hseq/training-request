"use server";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Ban } from "lucide-react";
import { ScrollUp } from "@/components/scroll-up";
import { DashboardNavbar } from "../_components/navbar/dashboard-navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CollaboratorsCartProvider } from "@/components/providers/collaborators-cart-provider";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    redirect("/");
  }

  return (
    <CollaboratorsCartProvider>
      <main className="relative flex flex-col h-full min-h-screen m-0 p-0 mx-auto">
        <DashboardNavbar role={session.user?.role} />
        <div className="mt-1 min-h-screen max-w-[1500px] w-auto">
          <div className="">{children}</div>
        </div>
        <ScrollUp />
      </main>
    </CollaboratorsCartProvider>
  );
};

export default AdminLayout;
