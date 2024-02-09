import { InputHTMLAttributes } from "react";
import { Control, FieldValues, UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SelectFormProps<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<InputHTMLAttributes<HTMLSelectElement>, "defaultValue" | "name"> {
  control: Control<T>;
  label: string;
  isSubmitting?: boolean;
  options: {
    value: string;
    label: string;
  }[];
}

export const SelectForm: React.FC<SelectFormProps<any>> = ({
  control,
  name,
  label,
  isSubmitting,
  options,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-slate-100 border-slate-300">
                <SelectValue
                  className="text-red-500"
                  placeholder="Selecciona una opción"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option, index) => (
                <SelectItem  key={option.value + index} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="ml-6 text-[0.8rem] text-red-500 font-medium" />
        </FormItem>
      )}
    />
  );
};
