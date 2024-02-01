import React from "react";
import { ForgotPasswordForm } from "../_components/forgot-password-form";
import { AuthNavbar } from "../_components/auth-navbar";

const RecoverPasswordPage = () => {

  
  return (
    <div className="min-h-[calc(100vh-40px)]">
      <div className="container w-full flex items-center justify-center h-fit pt-10">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
