"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteMixtape } from "@/actions/mixtapes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Mixtape } from "@/types/mixtape";

export function MixtapeRow({ mixtape }: { mixtape: Mixtape }) {
  const { id, number, title, description, created_at, status, duration } = mixtape;

  const router = useRouter();
  const [isDeleting, startDeleting] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Delete ${number} - ${title}? Its audio and artwork are deleted too.`)) return;

    startDeleting(async () => {
      const toastId = toast.loading(`Deleting ${number} - ${title}...`);
      const result = await deleteMixtape(id);
      if (result.error) {
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success(`Deleted ${number} - ${title}`, { id: toastId });
      router.refresh();
    });
  };

  return (
    <TableRow className={isDeleting ? "pointer-events-none opacity-50" : undefined}>
      <TableCell className="font-medium">{number}</TableCell>
      <TableCell className="font-medium">{title}</TableCell>
      <TableCell className="max-w-[500px] truncate">{description}</TableCell>
      <TableCell>{new Date(created_at).toLocaleDateString()}</TableCell>
      <TableCell>{duration}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/edit/${id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
