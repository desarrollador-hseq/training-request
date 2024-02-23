
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AuthNavbar } from "./_components/auth-navbar";
import { authOptions } from "@/lib/authOptions";
import { NoticesContainer } from "./_components/notices-container";

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
      {/* <AuthNavbar /> */}
      <div className="min-h-screen md:flex">
        <NoticesContainer />
        <div className="flex lg:w-1/2 w-full items-center bg-white ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
