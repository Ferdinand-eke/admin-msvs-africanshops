import { useMemo, useState } from 'react';
import {
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import DataTable from 'app/shared-components/data-table/DataTable';
import JurisdictionSelect from 'app/shared-components/jurisdiction-select/JurisdictionSelect';
import {
	useYouthTournaments,
	useYouthTournamentById,
	useCreateYouthTournament,
	useCancelYouthTournament
} from 'src/app/api/youthsports/useYouthSports';

const FORMATS = ['KNOCKOUT', 'LEAGUE', 'ROUND_ROBIN'];

const EMPTY_FORM = {
	name: '',
	sport: '',
	format: 'KNOCKOUT',
	maxTeams: 8,
	organizerId: '',
	jurisdiction: { country: '', state: '', lga: '' }
};

function CreateTournamentDialog({ open, onClose }) {
	const [form, setForm] = useState(EMPTY_FORM);
	const createTournament = useCreateYouthTournament();

	function handleSubmit() {
		createTournament.mutate(
			{ ...form, maxTeams: Number(form.maxTeams) },
			{
				onSuccess: () => {
					setForm(EMPTY_FORM);
					onClose();
				}
			}
		);
	}

	const canSubmit =
		form.name && form.sport && form.organizerId &&
		form.jurisdiction.country && form.jurisdiction.state && form.jurisdiction.lga;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle>New Tournament</DialogTitle>
			<DialogContent className="flex flex-col gap-16 pt-8">
				<TextField
					label="Name"
					fullWidth
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
				/>
				<TextField
					label="Sport"
					fullWidth
					value={form.sport}
					onChange={(e) => setForm({ ...form, sport: e.target.value })}
				/>
				<div>
					<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Format</Typography>
					<Select
						className="mt-8"
						fullWidth
						value={form.format}
						onChange={(e) => setForm({ ...form, format: e.target.value })}
					>
						{FORMATS.map((f) => (
							<MenuItem
								key={f}
								value={f}
							>
								{f}
							</MenuItem>
						))}
					</Select>
				</div>
				<TextField
					label="Max Teams"
					type="number"
					fullWidth
					value={form.maxTeams}
					onChange={(e) => setForm({ ...form, maxTeams: e.target.value })}
				/>
				<TextField
					label="Organizer User ID"
					fullWidth
					value={form.organizerId}
					onChange={(e) => setForm({ ...form, organizerId: e.target.value })}
				/>
				<JurisdictionSelect
					value={form.jurisdiction}
					onChange={(jurisdiction) => setForm({ ...form, jurisdiction })}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					variant="contained"
					color="secondary"
					disabled={!canSubmit || createTournament.isLoading}
					onClick={handleSubmit}
				>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
}

/** Read-only audit view of a tournament's teams + submitted match results — reuses the existing public GET /youth/tournaments/:id, no new endpoint. */
function MatchResultsDialog({ tournamentId, onClose }) {
	const { data, isLoading } = useYouthTournamentById(tournamentId);
	const tournament = data?.data;
	const teamNameById = useMemo(() => {
		const map = {};
		(tournament?.teams ?? []).forEach((t) => {
			map[t.id] = t.teamName;
		});
		return map;
	}, [tournament]);

	return (
		<Dialog
			open={Boolean(tournamentId)}
			onClose={onClose}
			fullWidth
			maxWidth="md"
		>
			<DialogTitle>Match Results — {tournament?.name}</DialogTitle>
			<DialogContent>
				{isLoading ? (
					<FuseLoading />
				) : (tournament?.matches ?? []).length === 0 ? (
					<Typography color="text.secondary">No matches scheduled yet.</Typography>
				) : (
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Round</TableCell>
								<TableCell>Home</TableCell>
								<TableCell>Away</TableCell>
								<TableCell>Score</TableCell>
								<TableCell>Status</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{tournament.matches.map((m) => (
								<TableRow key={m.id}>
									<TableCell>{m.round}</TableCell>
									<TableCell>{teamNameById[m.homeTeamId] ?? m.homeTeamId}</TableCell>
									<TableCell>{teamNameById[m.awayTeamId] ?? m.awayTeamId}</TableCell>
									<TableCell>
										{m.isCompleted ? `${m.homeScore} - ${m.awayScore}` : '—'}
									</TableCell>
									<TableCell>
										<Chip
											size="small"
											label={m.isCompleted ? 'Completed' : 'Pending'}
											className={m.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-200'}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}

function TournamentsPanel() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [createOpen, setCreateOpen] = useState(false);
	const [resultsTournamentId, setResultsTournamentId] = useState(null);

	const { data, isLoading, isFetching } = useYouthTournaments({ page: page + 1, limit: rowsPerPage });
	const cancelTournament = useCancelYouthTournament();

	const tournaments = useMemo(() => data?.data?.data ?? [], [data]);
	const total = useMemo(() => data?.data?.total ?? 0, [data]);

	const columns = useMemo(
		() => [
			{ accessorKey: 'name', header: 'Name', size: 200 },
			{ accessorKey: 'sport', header: 'Sport', size: 130 },
			{ accessorKey: 'format', header: 'Format', size: 130 },
			{
				accessorKey: 'status',
				header: 'Status',
				size: 110,
				Cell: ({ row }) => (
					<Chip
						size="small"
						label={row.original.status}
						className={row.original.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200'}
					/>
				)
			},
			{
				accessorFn: (row) => `${row.currentTeams}/${row.maxTeams}`,
				id: 'teams',
				header: 'Teams',
				size: 90
			},
			{ accessorKey: 'lga', header: 'LGA', size: 120 },
			{
				id: 'actions',
				header: 'Actions',
				size: 180,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center gap-4">
						<Button
							size="small"
							onClick={() => setResultsTournamentId(row.original.id)}
						>
							Results
						</Button>
						{row.original.status !== 'CANCELLED' && row.original.status !== 'COMPLETED' && (
							<IconButton
								size="small"
								title="Cancel tournament"
								onClick={() => cancelTournament.mutate(row.original.id)}
							>
								<FuseSvgIcon size={18}>heroicons-outline:x-circle</FuseSvgIcon>
							</IconButton>
						)}
					</div>
				)
			}
		],
		[cancelTournament]
	);

	if (isLoading) return <FuseLoading />;

	return (
		<div>
			<div className="flex justify-end mb-16">
				<Button
					variant="contained"
					color="secondary"
					onClick={() => setCreateOpen(true)}
				>
					<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
					<span className="mx-8">New Tournament</span>
				</Button>
			</div>

			<DataTable
				data={tournaments}
				columns={columns}
				manualPagination
				rowCount={total}
				pageCount={Math.ceil(total / rowsPerPage)}
				onPaginationChange={(updater) => {
					const next = typeof updater === 'function' ? updater({ pageIndex: page, pageSize: rowsPerPage }) : updater;
					if (next.pageIndex !== page) setPage(next.pageIndex);
					if (next.pageSize !== rowsPerPage) setRowsPerPage(next.pageSize);
				}}
				state={{ pagination: { pageIndex: page, pageSize: rowsPerPage }, isLoading: isFetching }}
				initialState={{ pagination: { pageIndex: 0, pageSize: 20 } }}
			/>

			<CreateTournamentDialog
				open={createOpen}
				onClose={() => setCreateOpen(false)}
			/>
			<MatchResultsDialog
				tournamentId={resultsTournamentId}
				onClose={() => setResultsTournamentId(null)}
			/>
		</div>
	);
}

export default TournamentsPanel;
