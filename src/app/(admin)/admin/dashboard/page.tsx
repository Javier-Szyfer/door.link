// COMPONENTS
import Link from "next/link";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { MixtapeRow } from "@/components/dashboard/mixtape-row";

// ACTIONS
import { getAllMixtapes } from "@/actions/mixtapes";

export default async function Dashboard() {
	const { mixtapes, error } = await getAllMixtapes();

	if (error) return <p>Error fetching mixtapes :/</p>;
	if (!mixtapes) return <p>No mixtapes found</p>;

	return (
		<div className="flex flex-col gap-12">
			<h1 className="text-2xl font-medium">Dashboard</h1>
			<Link href="/admin/upload-mixtape">Upload Mixtape</Link>
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[200px]">Title</TableHead>
							<TableHead className="w-[500px]">Description</TableHead>
							<TableHead className="w-[150px]">Publish Date</TableHead>
							<TableHead className="w-[100px]">Status</TableHead>
							<TableHead className="w-[100px] text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{mixtapes.map((mixtape) => (
							<MixtapeRow key={mixtape.id} mixtape={mixtape} />
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
