import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const formatDateOf = (date: Date) => {
  return format(date, "PPP", { locale: es });
};

export const formatDateSm = (date: Date) => {
  return format(date, "P", { locale: es });
};
export const formatDateCert = (date: Date) => {
  let formattedDate = format(date, "d 'días' 'del mes de' MMMM 'de' yyyy", {
    locale: es,
  });

  if (date.getDate() === 1) {
    formattedDate = formattedDate.replace("días", "día");
  }
  return formattedDate;
};
export const capitalize = (sentence: string) => {
  // Verificar si la oración contiene más de una palabra
  if (sentence.includes(" ")) {
    const words = sentence.split(" ");

    for (let i = 0; i < words.length; i++) {
      // Verificar si la palabra actual no está vacía
      if (words[i].length > 0) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }
    }

    return words.join(" ");
  } else {
    // Si solo hay una palabra, capitalizarla directamente
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }
};

export const removeSpecialChars = (str: string) => {
  // Define un mapa de caracteres especiales y sus equivalentes sin acentos
  const specialCharsMap: { [key: string]: string } = {
    "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
    "ñ": "n", "ü": "u", "Á": "A", "É": "E", "Í": "I",
    "Ó": "O", "Ú": "U", "Ñ": "N", "Ü": "U"
  };
  // Utiliza una expresión regular para buscar caracteres especiales y reemplazarlos
  return str.replace(/[áéíóúñüÁÉÍÓÚÑÜ]/g, (match) => specialCharsMap[match]);
};