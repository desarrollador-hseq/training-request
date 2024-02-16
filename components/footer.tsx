import React from "react";

export const Footer = () => {
  return (
    <footer className="footer h-10 w-full bg-primary flex items-center z-50 md:ms-[95px]">
      <div className="w-[70%] mx-auto flex justify-center gap-1 text-white text-sm ">
        <span>2024</span>
        <p className="text-sm">&copy; Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
