import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DashboardNavbar } from "./_components/navbar/dashboard-navbar";
import { ScrollUp } from "@/components/scroll-up";
import { CollaboratorsCartProvider } from "@/components/providers/collaborators-cart-provider";
import { NotValidCompany } from "./dashboard/_components/not-valid-company";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { authOptions } from "@/lib/authOptions";
import { Footer } from "@/components/footer";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HSEQ Entrenamiento",
  description:
    "HSEQ Entrenamiento - Agendamiento y certificados en trabajo en altura en la ciudad de barranquilla",
};

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    redirect("/");
  }

  return (
    <CollaboratorsCartProvider>
      <main
        className={cn(
          "relative flex flex-col h-full min-h-screen m-0 p-0 mx-auto bg-blue-100/50",
          roboto.className
        )}
      >
        <DashboardNavbar
          isAdmin={session.user.role === "ADMIN"}
          businessName={session.user.businessName}
          canManagePermissions={session.user.canManagePermissions || false}
        />
        <div className="mt-1 md:pl-[223px] min-h-screen xl:flex justify-center items-start xl:w-full relative">
          <div className="mx-1 min-h-full mt-[56px] max-w-[1200px] w-full">
            {session.user.isValid ? (
              children
            ) : (
              <NotValidCompany email={session.user.email} />
            )}
          </div>
        </div>
        <ScrollUp />
        <Footer />
      </main>
    </CollaboratorsCartProvider>
  );
};

export default MainLayout;
