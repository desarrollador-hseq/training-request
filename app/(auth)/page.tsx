"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./_components/login-form";
// import { LogoGrupoHseq } from "@/components/logo-grupo-hseq";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterForm } from "./_components/register-form";
import { ModalWaitValidation } from "./_components/modal-wait-validation";
export default function LoginPage() {
  const [tabSelected, setTabSelected] = useState("login");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-40px)]">
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
