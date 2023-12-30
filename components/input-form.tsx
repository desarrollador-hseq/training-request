import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import { Control, FieldValues, UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input, InputProps } from "./ui/input";

interface InputFormProps<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "defaultValue" | "name" | "type"
    > {
  control: Control<T>;
  label: string;
  isSubmitting?: boolean;
  type?: HTMLInputTypeAttribute | undefined;
}

export const InputForm: React.FC<InputFormProps<any>> = ({
  control,
  name,
  label,
  isSubmitting,
  type,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold text-primary" htmlFor={name}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              id={name}
              disabled={isSubmitting}
              placeholder=""
              type={type || "text"}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
