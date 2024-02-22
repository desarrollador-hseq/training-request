import { LogoGHseq } from "@/components/logo-ghseq";
import { LogoMain } from "@/components/logo-main";

export const ExternalNavbar = () => {
  return (
    <nav className="h-[78px] w-full bg-primary flex justify-center items-center text-white mx-auto p-1">
      <div className="flex justify-between items-center w-full  max-w-[1500px]">
        <LogoMain />
        <div className="flex gap-2">
          <span className="font-thin text-sm">by</span>{" "}
          <LogoGHseq goRoot width={85} />
        </div>
      </div>
    </nav>
  );
};
