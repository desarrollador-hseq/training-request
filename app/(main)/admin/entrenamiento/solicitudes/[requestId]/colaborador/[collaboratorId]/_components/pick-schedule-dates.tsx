"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
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
import { Banner } from "@/components/banner";

interface PickDatesProps {
  isDisallowed: boolean;
  trainingRequestId?: string;
  collaboratorId?: string;
  courseLevelName?: string | null;
  courseName?: string | null;
  collaboratorPhone?: string | null;
  collaboratorName?: string;
  trainingRequestCollaborator?: any;
  setDate: Dispatch<SetStateAction<DateRange | undefined>>;
  date: DateRange | undefined;
  company?: Company | null;
  scheduledDate: { to: Date | null | undefined; from: Date | null | undefined };
  canManageRequests: boolean;
  canManagePermissions: boolean;
  canManageCompanies: boolean;
  validDocuments: boolean;
}

export const PickScheduleDates = ({
  trainingRequestCollaborator,
  setDate,
  date,
  scheduledDate,
  isDisallowed,
  canManageRequests,
  canManagePermissions,
  canManageCompanies,
  validDocuments,
}: PickDatesProps) => {
  // const { date, setDate } = useDashboard();

  const [calendarOpen, setCalendarOpen] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [dateSelected, setDateSelected] = useState<DateRange | undefined>({
    from: scheduledDate.from || undefined,
    to: scheduledDate.to || undefined,
  });

  useEffect(() => {
    if (!calendarOpen) {
      if (dateSelected?.from !== undefined && dateSelected.to !== undefined) {
        setDate(dateSelected);
      } else {
        setDate(undefined);
        setDateSelected({ to: undefined, from: undefined });
        setIsFiltering(false);
      }
    }
  }, [calendarOpen]);

  const handleClearInputCalendar = () => {
    setCalendarOpen(false);
    setDateSelected({ to: undefined, from: undefined });
    setDate(undefined);
  };

  useEffect(() => {
    setIsFiltering(!!dateSelected);
    setCalendarOpen(false);
  }, []);

  const onOpenFiltering = () => {
    setIsFiltering(true);
    setCalendarOpen(true);
  };

  return (
    <div className={cn("flex items-center justify-center w-full ")}>
      {isFiltering ? (
        <div className="flex items-center relative transition">
          {!!scheduledDate && (
            <Button
              onClick={handleClearInputCalendar}
              variant="default"
              className={cn(
                `absolute top-2 right-1 w-7 h-7 p-0 rounded-md`,
                !!date && "hidden"
              )}
            >
              <Eraser className="w-5 h-4" />
            </Button>
          )}
          <span className="text-white text-sm text-right mx-2 leading-3">
            {/* {date ? "" : ""} */}
          </span>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              asChild
              className=" hover:bg-blue-100 hover:text-primary"
            >
              <Button
                id="date"
                variant={"ghost"}
                className={cn(
                  "h-16 w-full justify-start text-left text-md font-normal bg-blue-50 border border-secondary text-primary",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-6 w-6 text-secondary" />
                {date?.from ? (
                  date.to ? (
                    <span className="font-bold text-secondary text-xl">
                      <span className="text-emerald-600 text-base">
                        {" "}
                        {format(date.from, "dd LLLL y", {
                          locale: es,
                        })}{" "}
                      </span>
                      |{" "}
                      <span className="text-red-600 text-base">
                        {format(date.to, "dd LLLL y", { locale: es })}
                      </span>
                    </span>
                  ) : (
                    format(date.from, "dd LLLL y", { locale: es })
                  )
                ) : (
                  <span>Selecciona un rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto mr-4" align="start">
              <Calendar
                disabled={
                  isDisallowed ||
                  !!!scheduledDate ||
                  !((canManageCompanies && canManageRequests) || canManagePermissions)
                }
                initialFocus
                mode="range"
                defaultMonth={dateSelected ? dateSelected.to : new Date()}
                selected={dateSelected}
                onSelect={setDateSelected}
                numberOfMonths={2}
                locale={es}
                className="mr-6 me-6"
              />
            </PopoverContent>
          </Popover>
         
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {validDocuments ? (
            <Button
              disabled={
                isDisallowed || !((canManageCompanies && canManageRequests) || canManagePermissions)
              }
              variant="secondary"
              className="text-white bg-accent w-full"
              onClick={() => onOpenFiltering()}
            >
              <CalendarSearch className="w-5 h-5" />
            </Button>
          ) : (
            <Banner label="Documentos sin validar"></Banner>
          )}
        </div>
      )}
    </div>
  );
};
