import { ReactNode } from "react";
import { ExternalNavbar } from "./_components/external-navbar";
import { ExternalFooter } from "./_components/external-footer";



const ExternalLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative flex flex-col h-full min-h-screen m-0 p-0 mx-auto w-full ">
      <ExternalNavbar />
      <div className="mt-1 min-h-screen max-w-[1500px] w-full mx-auto mb-5 overflow-hidden">
        {children}
      </div>
      <ExternalFooter />
    </main>
  );
};

export default ExternalLayout;
