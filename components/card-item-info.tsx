import { ReactNode } from "react";

export const CardItemInfo = ({
  label,
  text,
  highlight,
}: {
  label: string;
  text?: ReactNode | null;
  highlight?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col p-1 items-center bg-blue-100 min-w-fit ${
        highlight && "bg-blue-200 border-2 border-blue-500 shadow-md"
      }`}
    >
      <div>
        <h5 className="text-lg font-bold text-center ">{label}</h5>
        <p
          className={`"text-normal text-center text-sm ${
            highlight && "text-[15px]"
          }`}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
