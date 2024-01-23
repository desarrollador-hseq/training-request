"use client";

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

interface CartItem {
  companyId: string;
  companyName: string;
  companyEmail: string;
  collaboratorBookings: {
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

export const useCart = () => useContext(CollaboratorCartContext);

export const CollaboratorsCartProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart =
      typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    return storedCart ? JSON.parse(storedCart) : [];
  });

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
        const existingCollaboratorIndex = cartItem.collaboratorBookings.findIndex(
          (booking) => booking.collaboratorId === collaboratorId
        );
  
        if (existingCollaboratorIndex !== -1) {
          const updatedCollaboratorBooking = {
            ...cartItem.collaboratorBookings[existingCollaboratorIndex],
            ...updatedFields,
          };
  
          const updatedCollaboratorBookings = [...cartItem.collaboratorBookings];
          updatedCollaboratorBookings[existingCollaboratorIndex] = updatedCollaboratorBooking;
  
          return {
            ...cartItem,
            collaboratorBookings: updatedCollaboratorBookings,
          };
        } else {
          console.warn(`El colaborador con ID ${collaboratorId} no existe en el carrito.`);
        }
      }
      return cartItem;
    });
  };
  
  const addCartItem = (
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
      const updatedCartItems = updateCollaboratorBooking(prevCartItems, companyId, collaboratorId, {
        date,
        courseName,
        courseLevelName,
      });
  
      const index = updatedCartItems.findIndex((cart) => cart.companyId === companyId);
  
      if (index !== -1) {
        // Resto de tu lógica para agregar un nuevo ítem si no existe, similar a tu implementación actual.
        const existingCollaboratorIndex = updatedCartItems[index].collaboratorBookings.findIndex(
          (booking) => booking.collaboratorId === collaboratorId
        );
  
        if (existingCollaboratorIndex === -1) {
          updatedCartItems[index].collaboratorBookings.push({
            collaboratorId,
            collaboratorName,
            courseName,
            courseLevelName,
            courseDate: date,
          });
        }
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
        const hasCollaborator = item.collaboratorBookings.some(
          (col) => col.collaboratorId === itemId
        );

        if (hasCollaborator) {
          // Filtrar las colaboraciones del colaborador actual
          item.collaboratorBookings = item.collaboratorBookings.filter(
            (col) => col.collaboratorId !== itemId
          );

          // Si ya no hay colaboradores, eliminar el ítem completo
          if (item.collaboratorBookings.length === 0) {
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
              collaboratorBookings: { ...item.collaboratorBookings, date },
            }
          : item
      )
    );
  };

  const sendEmailToCompany = () => {
    cartItems.forEach((cartItem) => {
      const { companyId, companyName, companyEmail, collaboratorBookings } =
        cartItem;

      console.log(
        `Enviando lista de colaboradores agendados para la empresa ${companyName} (${companyEmail}):`
      );
      collaboratorBookings.forEach((collaborator) => {
        console.log(
          `- ${collaborator.collaboratorName}: ${
            collaborator?.courseDate.from &&
            format(collaborator?.courseDate?.from, "P", { locale: es })
          } a ${
            collaborator?.courseDate.to &&
            format(collaborator.courseDate.to, "P", { locale: es })
          } - ${collaborator.courseName} - ${collaborator.courseLevelName}`
        );
      });
      console.log("\n");
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
