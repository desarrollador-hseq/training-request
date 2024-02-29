import Image from "next/image";
import { VideoPlayer } from "@/components/video-player";

export const NoticesContainer = () => {
  return (
    <div className="relative overflow-hidden lg:flex  w-1/2 bg-gradient-to-tr from-primary to-secondary justify-around items-center hidden ">
      <div className="flex flex-col items-center gap-5 h-full max-h-[700px]">
        {/* <h4 className="text-3xl font-bold text-white bg-slate-700/70 p-2 rounded-md z-30">
          Software de entrenamiento
        </h4> */}
        <Image
          priority
          style={{ width: 300, height: 100 }}
          src={"/hseq-entrenamiento-white.png"}
          width={300}
          height={100}
          alt="Logo de grupo hseq"
          className="z-30 bg-primary/40 rounded-md"
        />

        <VideoPlayer
          url={
            "https://grupohseq.sfo2.cdn.digitaloceanspaces.com/entrenamiento/tutoriales/VIDEO-INSTRUCTIVO_SOFTWARE-DE-ENTRENAMIENTO.mp4"
          }
          
        />
        <Image
          priority
          style={{ width: 120, height: 60 }}
          src={"/hseq.png"}
          width={120}
          height={60}
          alt="Logo de grupo hseq"
          className="z-30"
        />
      </div>

      <div className="absolute -top-36 -right-4 w-80 h-80 border-4 border-opacity-30 "></div>
      <div className="absolute -top-28 -right-20 w-80 h-80 border-4 border-opacity-30 "></div>

      <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 border-opacity-30 "></div>
      <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 border-opacity-30 "></div>
    </div>
  );
};
