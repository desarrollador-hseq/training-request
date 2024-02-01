import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
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
      {children}
    </div>
  );
};

export default AuthLayout;
