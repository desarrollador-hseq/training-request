"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./_components/login-form";
// import { LogoGrupoHseq } from "@/components/logo-grupo-hseq";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterForm } from "./_components/register-form";
import { ModalWaitValidation } from "./_components/modal-wait-validation";
export default function LoginPage() {
  const { data: session, status } = useSession();
  const [tabSelected, setTabSelected] = useState("login");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (session) {
        if (session.user.role === "ADMIN") {
          redirect("/admin");
        } else if (session.user.role === "COMPANY") {
          redirect("/dashboard");
        }
      }
    }
  }, [status, session]);

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-40px)]">
      <div className="relative p-1 border-b h-[55px] max-h-[70px] w-full bg-primary shadow-sm flex items-center">
        <div className="mx-auto w-full max-w-[1500px] mt-1">
          <div className="mx-3 flex items-center justify-between">
            <div className="p-2 flex gap-1 text-white">
              {/* <LogoGrupoHseq  /> */}
              LOGO
            </div>
          </div>
        </div>
      </div>
      <div className="container w-full flex items-start justify-center pt-14 h-fit">
        <Tabs
          value={tabSelected}
          onValueChange={setTabSelected}
          className="w-[800px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Registrar Empresa</TabsTrigger>
          </TabsList>
          {/* --------login-------- */}
          <TabsContent value="login">
            <Card className="">
              <CardHeader>
                <CardTitle className="text-2xl font-bold leading-tight tracking-tight text-slate-500 text-center">
                  Ingresar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <LoginForm />
              </CardContent>
            </Card>
          </TabsContent>
          {/* --------register-------- */}
          <TabsContent value="register">
            <Card className="">
              <CardHeader>
                <CardTitle className="text-2xl font-bold leading-tight tracking-tight text-slate-500 text-center">
                  Registrar Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 md:space-y-1">
                <RegisterForm
                  setTabSelected={setTabSelected}
                  setShowModal={setShowModal}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {showModal && <ModalWaitValidation />}
    </div>
  );
}
