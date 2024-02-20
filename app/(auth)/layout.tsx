import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AuthNavbar } from "./_components/auth-navbar";
import { authOptions } from "@/lib/authOptions";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
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
      <div className="min-h-screen md:flex">
        <div className="relative overflow-hidden lg:flex  w-1/2 bg-gradient-to-tr from-primary to-secondary justify-around items-center hidden">
          <Image
            priority
            style={{ width: "auto", height: "auto" }}
            src={"/hseq.png"}
            width={250}
            height={300}
            alt="Logo de grupo hseq"
          />

          <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 border-opacity-30 border-"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 border-opacity-30 border-"></div>

          <div className="absolute -top-36 -right-4 w-80 h-80 border-4 border-opacity-30"></div>
          <div className="absolute -top-28 -right-20 w-80 h-80 border-4 border-opacity-30 border-t-"></div>
        </div>
        <div className="flex md:w-1/2 w-full items-center bg-white ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;