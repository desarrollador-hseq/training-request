import Image from "next/image";
import { VideoPlayer } from "@/components/video-player";
import { Play, Shield, Users, Award, CheckCircle } from "lucide-react";
import Link from "next/link";

export const NoticesContainer = () => {
  return (
    <div className="relative overflow-hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary/90 to-secondary justify-center items-start hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Círculos decorativos con animaciones */}
      <div className="absolute -top-20 -right-20 w-96 h-96 border-2 border-white/20 rounded-full animate-pulse"></div>
      <div className="absolute -top-16 -right-32 w-80 h-80 border-2 border-white/15 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute -bottom-24 -left-32 w-96 h-96 border-2 border-white/20 rounded-full animate-pulse delay-500"></div>
      <div className="absolute -bottom-32 -left-16 w-80 h-80 border-2 border-white/15 rounded-full animate-pulse delay-1500"></div>

      {/* Contenido principal */}
      <div className="flex flex-col items-start justify-start gap-8 h-full max-h-[800px] px-8 relative z-10">
        {/* Logo principal */}
        <div className="text-center space-y-4 flex  items-center justify-center gap-4">
     
            <Link href="https://grupohseq.com/" target="_blank">
              <Image
                priority
                style={{ width: 80, height: 80 }}
                src={"/hseq.png"}
                width={80}
                height={80}
                alt="Logo de grupo HSEQ"
                className="z-30 bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg"
              />
            </Link>
           
         
          <Image
            priority
            style={{ width: 300, height: 110 }}
            src={"/hseq-entrenamiento-white.png"}
            width={320}
            height={110}
            alt="Logo de grupo HSEQ"
            className="z-30 bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-2xl"
          />
          {/* <h2 className="text-2xl font-bold text-white/90 tracking-wide">
            Software de Entrenamiento
          </h2> */}
      
        </div>

        {/* Video tutorial */}
        <div className="w-full max-w-md space-y-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-white/90">
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">
              Tutorial de Registro y uso del software
            </span>
          </div>
          <div className="relative group">
            <VideoPlayer
              url={
                "https://grupohseq.sfo2.cdn.digitaloceanspaces.com/entrenamiento/tutoriales/VIDEO-INSTRUCTIVO_SOFTWARE-DE-ENTRENAMIENTO.mp4"
              }
            />
          </div>
        </div>

        {/* Características principales */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-md">
          <div className="flex items-center gap-3 text-white/90">
            <div className="p-2 bg-white/20 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Seguridad</span>
          </div>

          <div className="flex items-center gap-3 text-white/90">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Colaboración</span>
          </div>

          <div className="flex items-center gap-3 text-white/90">
            <div className="p-2 bg-white/20 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Certificación</span>
          </div>

          <div className="flex items-center gap-3 text-white/90">
            <div className="p-2 bg-white/20 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Calidad</span>
          </div>
        </div>
      </div>

      {/* Partículas flotantes */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white/35 rounded-full animate-bounce delay-500"></div>
    </div>
  );
};
