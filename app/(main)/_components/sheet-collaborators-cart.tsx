"use client";

import { Send, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCollaboratorsCart } from "@/components/providers/collaborators-cart-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SimpleModal } from "@/components/simple-modal";

export const SheetCollaboratorsCart = () => {
  const {
    cartItems,
    removeCartItem,
    removeCollaboratorItem,
    sendEmailToCompany,
  } = useCollaboratorsCart();

  const onRemoveCompany = (id: string) => {
    removeCartItem(id);
  };
  const onRemoveCollaborator = (id: string) => {
    removeCollaboratorItem(id);
  };

  const handleSendNotification = () => {
    sendEmailToCompany();
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild className="relative">
          <Button variant="primary" className="rounded-full p-3 h-auto ">
            <Send className="text-primary-foreground " />
            {cartItems.length > 0 && (
              <span className="h-5 w-5 text-xs absolute top-[-3px] left-[-3px] rounded-full bg-blue-500 p-0.5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              Lista de colaboradores agendados por empresa
            </SheetTitle>
            {/* <SheetDescription>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur,
              doloremque!
            </SheetDescription> */}
          </SheetHeader>
          <div className="w-full flex flex-col gap-2 p-2 ">
            {cartItems.map((cart) => (
              <div
                key={cart.companyId}
                className="w-full bg-secondary p-2 rounded-sm"
              >
                <div className="flex justify-between">
                  <div className="w-full">
                    <h3 className="text-lg font-bold text-white">
                      {cart.companyName}
                    </h3>
                    <span className="italic font-normal text-sm text-slate-300">
                      {cart.companyEmail}
                    </span>
                    <Separator className="w-full border-2" />
                  </div>

                  <SimpleModal
                    title="Eliminar empresa del listado de notificación"
                    large={false}
                    onAcept={() => onRemoveCompany(cart.companyId)}
                    btnClass="p-1 h-fit "
                    textBtn={
                      <span>
                        <Button
                          variant="ghost"
                          className="p-1 h-fit bg-inherit hover:bg-inherit"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </span>
                    }
                  >
                    <h2>
                      Desea eliminar la empresa:{" "}
                      <span className="font-bold">{cart.companyName}</span>
                    </h2>
                  </SimpleModal>
                </div>
                {cart.collaboratorBookings.map((col, index) => (
                  <div
                    key={col.collaboratorId + index}
                    className="flex justify-between items-center p-2 rounded-sm bg-primary/50 text-white mt-2"
                  >
                    <p className="text-base font-semibold line-clamp-1">
                      {index + 1}. {col.collaboratorName} -{" "}
                      {col.courseLevelName}
                    </p>
                    <SimpleModal
                      title="Eliminar colaborador del listado de notificación de la empresa"
                      large={false}
                      onAcept={() => onRemoveCollaborator(col.collaboratorId)}
                      btnClass="p-1 h-fit bg-inherit hover:bg-slate-400"
                      textBtn={
                        <span>
                          <Button
                            variant="ghost"
                            className="p-1 h-fit bg-inherit hover:bg-inherit"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </span>
                      }
                    >
                      <h2>
                        Desea eliminar el colaborador:{" "}
                        <span className="font-bold">
                          {col.collaboratorName}
                        </span>
                      </h2>
                    </SimpleModal>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <SheetFooter>
            <SheetClose className="">
              {/* <Button type="submit" className="bg-zinc-400 hover:bg-zinc-500">Cerrar</Button> */}
            </SheetClose>
            <div>
              <SimpleModal
                title="Notificación a empresas"
                large={false}
                onAcept={handleSendNotification}
                btnClass="p-1 h-fit bg-inherit hover:bg-slate-400"
                textBtn={
                  <span>
                    <Button
                      variant="ghost"
                      className="bg-primary hover:bg-primary/50 text-white"
                    >
                      Notificar
                    </Button>
                  </span>
                }
              >
                <h2>
                  Desea notificar a los responsables de las empresas sobre la
                  agendación de sus colaboradores
                </h2>
              </SimpleModal>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
