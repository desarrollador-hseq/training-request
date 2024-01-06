import { useState } from "react";
import { pdfjs } from "react-pdf";
import { Expand, LucideIcon, X } from "lucide-react";
import { useResizeDetector } from "react-resize-detector";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { cn } from "@/lib/utils";
import Image from "next/image";

import ModalImage from "react-modal-image";

interface ImageFullscreenProps {
  src: string;
  icon?: LucideIcon | string;
  btnClass?: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const ImageFullscreen = ({
  src,
  icon: Icon,
  btnClass,
}: ImageFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();

  const { width, height, ref } = useResizeDetector();

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <AlertDialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button
          variant="ghost"
          className={cn("gap-1.5", typeof Icon === "string" && `${btnClass}`)}
          aria-label="fullscreen"
        >
          {Icon ? (
            typeof Icon === "string" ? (
              Icon
            ) : (
              <Icon className="h-4 w-4" />
            )
          ) : (
            <Expand className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-7xl w-full overflow-y-auto">
        <div>
          <Button
            variant="ghost"
            className=" absolute top-0 right-0 p-1 mr-1 mt-1"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6 text-destructive" />
          </Button>

          <div className="min-h-[80vh] max-h-[80vh] mt-6 flex justify-center ">
            {/* <Image
              src={src}
              priority
              alt="Imagen en fullscreen"
              style={{ maxHeight: "840px", maxWidth: "1280px" }}
            /> */}
            <ModalImage
              small={src}
              large={src}
              alt="Hello World!"
            />
            ;
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
