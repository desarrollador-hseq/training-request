import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ScrollUp } from "@/components/scroll-up";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="relative flex flex-col h-full min-h-screen m-0 p-0 mx-auto">
      <div className="mt-1 min-h-screen max-w-[1500px] w-auto">
        <div className="">{children}</div>
      </div>
      <ScrollUp />
    </main>
  );
};

export default AdminLayout;
