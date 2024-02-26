"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  CalendarSearch,
  Eraser,
  X,
} from "lucide-react";
import { Company } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PickDatesProps {
  isDisallowed: boolean;
  trainingRequestId?: string;
  collaboratorId?: string;
  courseLevelName?: string | null;
  courseName?: string | null;
  collaboratorPhone?: string | null;
  collaboratorName?: string;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  date: Date | undefined;
  company?: Company | null;
  scheduledDate: Date | undefined;
  setDateUpdated: Dispatch<SetStateAction<boolean>>;
}

export const PickSuggestedDate = ({
  setDate,
  date,
  scheduledDate,
  setDateUpdated,
  isDisallowed,
}: PickDatesProps) => {
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [dateSelected, setDateSelected] = useState<Date | undefined>(
    scheduledDate || undefined
  );

  useEffect(() => {
    if (!calendarOpen) {
      setDate(dateSelected);
      setCalendarOpen(false);
    } else {
      setDate(undefined);
      setDateSelected(undefined);
      // setIsFiltering(false);
    }
  }, [calendarOpen]);


  const onOpenFiltering = () => {
    setIsFiltering(true);
    setCalendarOpen(true);
  };

  const onDateUpdated = (e: Date | undefined) => {
    setDateSelected(e);
    setDateUpdated(true);
  };

  return (
    <div className={cn("flex items-center justify-center w-full ")}>
      {isFiltering ? (
        <div className="flex items-center relative transition">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              asChild
              className=" hover:bg-blue-100 hover:text-primary"
            >
              <Button
                id="date"
                variant={"ghost"}
                className={cn(
                  "h-20 min-w-[200px] w-full justify-start text-left text-md font-normal bg-blue-50 border border-secondary text-primary",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-6 w-6 text-secondary" />
                {!!date ? (
                  <span>{format(date, "P", { locale: es })}</span>
                ) : (
                  <span>Selecciona fecha sugerida</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto mr-4" align="start">
              <Calendar
                fromDate={new Date()}
                initialFocus
                mode="single"
                defaultMonth={dateSelected ? dateSelected : new Date()}
                selected={dateSelected}
                onSelect={(e) => onDateUpdated(e)}
                numberOfMonths={2}
                locale={es}
                className="mr-6 me-6"
              />
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            disabled={isDisallowed}
            variant="secondary"
            className="text-white bg-accent"
            onClick={() => onOpenFiltering()}
          >
            <CalendarSearch className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
