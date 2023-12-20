import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
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
        <div className="mx-1">{children}</div>
      </div>
      <ScrollUp />
    </main>
  );
};

export default DashboardLayout;
