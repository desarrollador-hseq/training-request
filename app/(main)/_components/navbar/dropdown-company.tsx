"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModalLogout } from "@/app/(auth)/_components/modal-logout";

export function DropdownCompany({ companyName }: { companyName?: string }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="border-2 border-white">
          <AvatarImage
            src="/company.png"
            alt="icono de casco"
            width={50}
            height={50}
          />
          <AvatarFallback>
            <Loader2 className="text-slate-200 w-10 h-10 animate-spin" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit max-w-[150px]">
        <DropdownMenuLabel>{companyName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer border-none hover:bg-secondary hover:text-white"
          onClick={() => router.push(`/dashboard/perfil/`)}
        >
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ModalLogout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
