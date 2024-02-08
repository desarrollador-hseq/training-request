"use client";

import { Send, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SimpleModal } from "@/components/simple-modal";
import { useEffect, useState } from "react";
import { useLoading } from "@/components/providers/loading-provider";
import { useCollaboratorsCart } from "@/components/providers/collaborators-cart-provider";

export const SheetCollaboratorsCart = () => {
  const {
    cartItems,
    removeCartItem,
    removeCollaboratorItem,
    sendEmailToCompany,
    
  } = useCollaboratorsCart();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<number>(0);
  const {setLoadingApp} = useLoading()


  const onRemoveCompany = (id: string) => {
    removeCartItem(id);
  };
  const onRemoveCollaborator = (id: string) => {
    removeCollaboratorItem(id);
  };

  const handleSendNotification =  () => {
     sendEmailToCompany();

  };

  useEffect(() => {
    setItems(cartItems.length);
  }, [cartItems]);

  return (
    <div className="">
      <Sheet open={open} onOpenChange={setOpen}>
        <Button
          onClick={() => setOpen(true)}
          className="relative rounded-full p-2 h-auto border-2 border-white"
        >
          <Send className="text-primary-foreground " />
          {items > 0 && (
            <span className="h-4 w-4 text-[9px] absolute top-[-3px] left-[-3px] rounded-full bg-blue-700 p-0.5 flex items-center justify-center animate-bounce">
              {items}
            </span>
          )}
        </Button>
        <SheetContent className="p-2 max-h-screen  h-full bg-primary">
          <SheetHeader>
            <SheetTitle className="text-primary-foreground">
              Lista de colaboradores agendados por empresa
            </SheetTitle>
            {/* <SheetDescription>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur,
              doloremque!
            </SheetDescription> */}
          </SheetHeader>
          <div className="w-full flex flex-col gap-2 p-2 h-[85%] ">
            {cartItems.map((cart) => (
              <div
                key={cart.companyId}
                className="w-full bg-secondary p-2 rounded-sm"
              >
                <div className="flex justify-between">
                  <div className="w-full p-0">
                    <h3 className="text-lg font-bold text-white p-0 m-0" >
                      {cart.companyName}
                    </h3>
                    <span className="italic font-normal text-sm text-slate-300">
                      {cart.companyEmail}
                    </span>
                    <Separator className="w-full border" />
                  </div>

                  <SimpleModal
                    title="Eliminar empresa del listado de notificación"
                    large={false}
                    onAcept={() => onRemoveCompany(cart.companyId)}
                    btnClass="p-1 h-fit "
                    textBtn={
                      <Button
                        variant="ghost"
                        className="p-1 h-fit bg-inherit hover:bg-inherit"
                      >
                        <X className="w-5 h-5 p-1 text-red-600 bg-white rounded-full" />
                      </Button>
                    }
                  >
                    <h2>
                      Desea eliminar la empresa:{" "}
                      <span className="font-bold">{cart.companyName}</span>
                    </h2>
                  </SimpleModal>
                </div>
                {cart.collaborators.map((col, index) => (
                  <div
                    key={col.collaboratorId + index}
                    className="flex justify-between items-center p-2 rounded-sm bg-primary/50 text-white mt-2"
                  >
                    <p className="text-xs font-normal line-clamp-1">
                      {index + 1}. {col.collaboratorName} -{" "}
                      {col.courseLevelName}
                    </p>
                    <SimpleModal
                      title="Eliminar colaborador del listado de notificación de la empresa"
                      large={false}
                      onAcept={() => onRemoveCollaborator(col.collaboratorId)}
                      btnClass="p-1 h-fit bg-inherit hover:bg-slate-400"
                      textBtn={
                        <Button
                          variant="ghost"
                          className="p-1 h-fit bg-inherit hover:bg-inherit"
                        >
                          <X className="w-4 h-4" />
                        </Button>
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
          <SheetFooter className=" w-full">
            {/* <SheetClose className="">
               <Button type="submit" className="bg-zinc-400 hover:bg-zinc-500">Cerrar</Button> 
            </SheetClose> */}
            <div className=" w-full">
              <SimpleModal
              btnDisabled={items <=0}
                title="Notificación a empresas"
                large={false}
                onAcept={handleSendNotification}
                btnClass="p-1 h-fit bg-inherit hover:bg-slate-400 w-full"
                textBtn={
                  <Button
                    variant="ghost"
                    className="bg-accent hover:bg-accent/80 text-white h-[60px] w-full"
                  >
                    Notificar
                  </Button>
                }
              >
                <h2>
                ¿Desea notificar a los responsables de las empresas sobre la programación de sus colaboradores?
                </h2>
              </SimpleModal>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
