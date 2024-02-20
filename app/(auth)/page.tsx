"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./_components/login-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterForm } from "./_components/register-form";
import { ModalWaitValidation } from "./_components/modal-wait-validation";
export default function LoginPage() {
  const [tabSelected, setTabSelected] = useState("login");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-blue-50 min-h-screen  w-full ">
      <div className="w-full flex items-start min-w-full max-h-fit ">
        <Tabs
          value={tabSelected}
          onValueChange={setTabSelected}
          className="max-w-full w-full mx-10 flex justify-center flex-col items-center mt-3"
        >
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Registrar Empresa</TabsTrigger>
          </TabsList>
          {/* --------login-------- */}
          <TabsContent value="login" className="min-w-[400px]">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold leading-tight tracking-tight text-slate-500 text-center">
                  Ingresar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-1">
                <LoginForm />
              </CardContent>
            </Card>
          </TabsContent>
          {/* --------register-------- */}
          <TabsContent value="register" className="">
            <Card className="">
              <CardHeader className="p-3">
                <CardTitle className="text-2xl font-bold leading-tight tracking-tight text-slate-500 text-center">
                  Registrar Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 md:space-y-1 ">
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
