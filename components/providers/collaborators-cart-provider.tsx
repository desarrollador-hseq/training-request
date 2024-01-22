"use client";

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
    const storedCart =  typeof window !== 'undefined' ? localStorage.getItem('cart') : null
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addCartItem = (
    companyId: string,
    companyName: string,
    companyEmail: string,
    collaboratorId: string,
    collaboratorName: string,
    date: DateRange
  ) => {
    setCartItems((prevCartItems) => {
      const index = prevCartItems.findIndex(
        (cart) => cart.companyId === companyId
      );
  
      if (index !== -1) {
        const existingCollaboratorIndex = prevCartItems[index].collaboratorBookings.findIndex(
          (booking) => booking.collaboratorId === collaboratorId
        );
  
        if (existingCollaboratorIndex !== -1) {
          // El colaborador ya existe, verifica si la fecha es diferente antes de actualizar.
          if (prevCartItems[index].collaboratorBookings[existingCollaboratorIndex].courseDate !== date) {
            const updatedCartItems = [...prevCartItems];
            updatedCartItems[index].collaboratorBookings[existingCollaboratorIndex].courseDate = date;
            return updatedCartItems;
          } else {
            // La fecha es la misma, no es necesario realizar cambios.
            console.warn(`El colaborador ${collaboratorName} ya está en el carrito con la misma fecha.`);
            return prevCartItems;
          }
        }
  
        // El colaborador no existe, agrégalo al carrito.
        const updatedCartItems = [...prevCartItems];
        updatedCartItems[index].collaboratorBookings.push({
          collaboratorId,
          collaboratorName,
          courseDate: date,
        });
        return updatedCartItems;
      } else {
        // La empresa no existe en el carrito, crea un nuevo ítem.
        const newCartItem: CartItem = {
          companyId,
          companyName,
          companyEmail,
          collaboratorBookings: [
            { collaboratorId, collaboratorName, courseDate: date },
          ],
        };
        return [...prevCartItems, newCartItem];
      }
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
        const hasCollaborator = item.collaboratorBookings.some((col) => col.collaboratorId === itemId);
  
        if (hasCollaborator) {
          // Filtrar las colaboraciones del colaborador actual
          item.collaboratorBookings = item.collaboratorBookings.filter((col) => col.collaboratorId !== itemId);
  
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
    
      const { companyId, companyName, companyEmail, collaboratorBookings } = cartItem;

      console.log(`Enviando lista de colaboradores agendados para la empresa ${companyName} (${companyEmail}):`);
      collaboratorBookings.forEach((collaborator) => {
        console.log(`- ${collaborator.collaboratorName}: ${collaborator.courseDate.from} a ${collaborator.courseDate.to}`);
      });
      console.log('\n');
    });
  }

  return (
    <CollaboratorCartContext.Provider
      value={{ cartItems, addCartItem, removeCartItem, removeCollaboratorItem, updateCartItemDate, sendEmailToCompany }}
    >
      {children}
    </CollaboratorCartContext.Provider>
  );
};

export const useCollaboratorsCart = () => useContext(CollaboratorCartContext);
