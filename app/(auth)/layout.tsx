import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { AuthNavbar } from "./_components/auth-navbar";

export const metadata: Metadata = {
  title: "HSEQ Entrenamiento",
  description:
    "HSEQ Entrenamiento - Agendamiento y certificados en trabajo en altura en la ciudad de barranquilla",
};

export const AuthLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === "ADMIN") {
      redirect("/admin/");
    } else if (session.user.role === "COMPANY") {
      redirect("/dashboard/");
    } else {
      redirect("/logout");
    }
  }
  return (
    <div>
      <AuthNavbar />
      <div className="h-screen md:flex">
        <div className="relative overflow-hidden lg:flex  w-1/2 bg-gradient-to-tr from-primary to-secondary justify-around items-center hidden">

          <Image priority style={{width: "auto", height: "auto"}} src={"/hseq.png"} width={250} height={300} alt="Logo de grupo hseq" />

        
          <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 border-opacity-30 border-"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 border-opacity-30 border-"></div>
          
          <div className="absolute -top-36 -right-4 w-80 h-80 border-4 border-opacity-30"></div>
          <div className="absolute -top-28 -right-20 w-80 h-80 border-4 border-opacity-30 border-t-"></div>
        </div>
        <div className="flex md:w-1/2 w-full justify-center py-10 items-center bg-white ">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
