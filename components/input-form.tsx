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
  readOnly?: boolean;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute | undefined;
}

export const InputForm: React.FC<InputFormProps<any>> = ({
  control,
  name,
  label,
  isSubmitting,
  type,
  readOnly,
  disabled,
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
              disabled={isSubmitting || disabled}
              placeholder=""
              type={type || "text"}
              readOnly={readOnly}
              {...field}
              className={`${
                disabled &&
                "bg-slate-400 text-white text-lg focus:border-none outline-none"
              }`}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
