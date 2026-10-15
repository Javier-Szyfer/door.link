"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
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
import type { Database } from "@/types/database.types";

type Mixtape = Database["public"]["Tables"]["mixtapes"]["Row"];

export function MixtapeRow({ mixtape }: { mixtape: Mixtape }) {
  const { id, number, title, description, created_at, status, duration } = mixtape;

  // The action revalidates, which refreshes this page's data on its own.
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this mixtape?")) return;

    const result = await deleteMixtape(id);
    if (result.error) toast.error(result.error);
    else toast.success(`Deleted ${number} - ${title}`);
  };

  return (
    <TableRow>
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
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
