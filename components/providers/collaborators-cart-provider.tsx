"use client";

import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  createContext,
  useContext,
  PropsWithChildren,
  useState,
  useEffect,
} from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useLoading } from "./loading-provider";

interface CartItem {
  companyId: string;
  companyName: string;
  companyEmail: string;
  collaborators: {
    collaboratorId: string;
    courseDate: DateRange;
    collaboratorName: string;
    courseName: string;
    courseLevelName: string;
  }[];
}

interface CollaboratorCartContextValue {
  cartItems: CartItem[];
  addCartItem: (
    companyId: string,
    companyName: string,
    companyEmail: string,
    collaboratorId: string,
    collaboratorName: string,
    courseName: string,
    courseLevelName: string,
    date: DateRange
  ) => void;
  removeCartItem: (itemId: string) => void;
  removeCollaboratorItem: (itemId: string) => void;
  updateCartItemDate: (itemId: string, date: DateRange) => void;
  sendEmailToCompany: () => void;
}

const CollaboratorCartContext = createContext<CollaboratorCartContextValue>({
  cartItems: [],
  addCartItem: () => {},
  removeCartItem: () => {},
  removeCollaboratorItem: () => {},
  updateCartItemDate: () => {},
  sendEmailToCompany: () => {},
});

//  export const useCart = () => useContext(CollaboratorCartContext);

export const CollaboratorsCartProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart =
      typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const { setLoadingApp } = useLoading();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const updateCollaboratorBooking = (
    cartItems: CartItem[],
    companyId: string,
    collaboratorId: string,
    updatedFields: {
      date?: DateRange;
      courseName?: string;
      courseLevelName?: string;
    }
  ) => {
    return cartItems.map((cartItem) => {
      if (cartItem.companyId === companyId) {
        const existingCollaboratorIndex = cartItem.collaborators.findIndex(
          (booking) => booking.collaboratorId === collaboratorId
        );

        if (existingCollaboratorIndex !== -1) {
          // Actualizar el elemento existente si se encuentra
          return {
            ...cartItem,
            collaborators: cartItem.collaborators.map((booking, index) => {
              if (index === existingCollaboratorIndex) {
                return {
                  ...booking,
                  ...updatedFields,
                };
              }
              return booking;
            }),
          };
        } else {
          console.warn(
            `El colaborador con ID ${collaboratorId} no existe en el carrito.`
          );
        }
      }
      return cartItem;
    });
  };

  const addCartItem = async (
    companyId: string,
    companyName: string,
    companyEmail: string,
    collaboratorId: string,
    collaboratorName: string,
    courseName: string,
    courseLevelName: string,
    date: DateRange
  ) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = updateCollaboratorBooking(
        prevCartItems,
        companyId,
        collaboratorId,
        {
          date,
          courseName,
          courseLevelName,
        }
      );

      // Asegurarse de que el elemento actualizado exista en el array actualizado
      const existingIndex = updatedCartItems.findIndex(
        (cart) => cart.companyId === companyId
      );
      if (existingIndex === -1) {
        // Si no existe, agregar un nuevo elemento al array actualizado
        updatedCartItems.push({
          companyId,
          companyName,
          companyEmail,
          collaborators: [
            {
              collaboratorId,
              collaboratorName,
              courseName,
              courseLevelName,
              courseDate: date,
            },
          ],
        });
      }

      return updatedCartItems;
    });
  };
  // setCartItems((prevCartItems) => [...prevCartItems, item]);

  const removeCartItem = (itemId: string) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.companyId !== itemId)
    );
  };
  const removeCollaboratorItem = (itemId: string) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => {
        const hasCollaborator = item.collaborators.some(
          (col) => col.collaboratorId === itemId
        );

        if (hasCollaborator) {
          // Filtrar las colaboraciones del colaborador actual
          item.collaborators = item.collaborators.filter(
            (col) => col.collaboratorId !== itemId
          );

          // Si ya no hay colaboradores, eliminar el ítem completo
          if (item.collaborators.length === 0) {
            return false; // No incluir en el nuevo array
          }
        }

        return true; // Incluir en el nuevo array
      })
    );
  };

  const updateCartItemDate = (companyId: string, date: DateRange) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.companyId === companyId
          ? {
              ...item,
              collaborators: { ...item.collaborators, date },
            }
          : item
      )
    );
  };

  const sendEmailToCompany = async () => {
    setLoadingApp(true);
    let countMail = 0;
    cartItems.forEach(async (cartItem) => {
      // const { companyId, companyName, companyEmail, collaborators } =
      //   cartItem;
      try {
        await axios.post(`/api/mail/company-list-collaborator-programmed`, {
          cartItem,
        });
        countMail++;
      } catch (error) {
        console.log("Error al notificar por correo a la empresa: ", error);
      } finally {
        setLoadingApp(false);
        setCartItems([]);
        toast.success(
          `Correos enviado correctamente.  (${countMail} /${cartItems.length})`
        );
      }
      // console.log(
      //   `Enviando lista de colaboradores agendados para la empresa ${companyName} (${companyEmail}):`
      // );
      // collaborators.forEach((collaborator) => {
      //   console.log(
      //     `- ${collaborator.collaboratorName}: ${
      //       collaborator?.courseDate.from &&
      //       format(collaborator?.courseDate?.from, "P", { locale: es })
      //     } a ${
      //       collaborator?.courseDate.to &&
      //       format(collaborator.courseDate.to, "P", { locale: es })
      //     } - ${collaborator.courseName} - ${collaborator.courseLevelName}`
      //   );
      // });
      // console.log("\n");
    });
  };

  return (
    <CollaboratorCartContext.Provider
      value={{
        cartItems,
        addCartItem,
        removeCartItem,
        removeCollaboratorItem,
        updateCartItemDate,
        sendEmailToCompany,
      }}
    >
      {children}
    </CollaboratorCartContext.Provider>
  );
};

export const useCollaboratorsCart = () => useContext(CollaboratorCartContext);
