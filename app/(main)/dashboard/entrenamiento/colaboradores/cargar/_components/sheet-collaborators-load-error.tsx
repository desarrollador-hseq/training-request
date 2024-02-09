import { Dispatch, SetStateAction } from "react";
import { ArrowBigDownDash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
//   import { useReactToPrint } from "react-to-print";

export const SheetCollaboratorsLoadError = ({
  failedInserts,
  wasError,
  setWasError,
}: {
  failedInserts: any;
  wasError: boolean;
  setWasError: Dispatch<SetStateAction<boolean>>;
}) => {

  return (
    <Sheet open={wasError} onOpenChange={setWasError}>
      {/* <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger> */}
      <Button
        className="absolute top-1/2  right-0 z-30 p-0 w-[40px] h-[20px] bg-red-500 rotate-90 "
        onClick={() => setWasError(true)}
        variant="outline"
      >
        <ArrowBigDownDash className="text-white w-4 h-4 animate-bounce rotate-180" />
      </Button>
      <SheetContent className="w-[400px] sm:w-[700px] md:w-fit  sm:max-w-none ">
        <SheetHeader>
          <SheetTitle>Error al añadir</SheetTitle>
          <SheetDescription>
            Lista de usuarios que no se añadieron
          </SheetDescription>
        </SheetHeader>
        <div className="h-[90%] w-full overflow-auto">
          <Table className="border border-slate-500  overflow-hidden w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="w-fit"># Documento</TableHead>
                <TableHead className="w-fit ">Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {failedInserts.map(({ data, error }: any, index: number) => (
                <TableRow className="max-h-6" key={index}>
                  <TableCell className="text-xs max-h-6">
                    {data.fullname}
                  </TableCell>
                  <TableCell className="text-xs max-h-6">
                    {data.numDoc}
                  </TableCell>
                  <TableCell className="text-xs max-h-6 line-clamp-2">
                    {error}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter></TableFooter>
          </Table>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <div className="flex gap-2">
              <Button type="submit">cerrar</Button>
            </div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
