"use client";

// COMPONENTS
import { TableCell, TableRow } from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

// HOOKS
import { useRouter } from "next/navigation";

// ACTIONS
import { deleteMixtape } from "@/actions/mixtapes";

// TYPES
import type { Database } from "@/types/database.types";

type Mixtape = Database["public"]["Tables"]["mixtapes"]["Row"];

interface MixtapeRowProps {
	mixtape: Mixtape;
}

export function MixtapeRow({ mixtape }: MixtapeRowProps) {
	const { id, title, description, created_at, status } = mixtape;
	const router = useRouter();

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this mixtape?")) return;

		try {
			const result = await deleteMixtape(id);
			if (result.error) {
				console.error(result.error);
				return;
			}
			// Force a hard refresh of the page data
			router.refresh();
			// Also reload the page to ensure we get fresh data
			window.location.reload();
		} catch (error) {
			console.error("Error deleting mixtape:", error);
		}
	};

	return (
		<TableRow>
			<TableCell className="font-medium">{title}</TableCell>
			<TableCell className="max-w-[500px] truncate">{description}</TableCell>
			<TableCell>{new Date(created_at).toLocaleDateString()}</TableCell>
			<TableCell>{status}</TableCell>
			<TableCell className="text-right">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Link href={`/admin/edit/${id}`}>Edit</Link>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
