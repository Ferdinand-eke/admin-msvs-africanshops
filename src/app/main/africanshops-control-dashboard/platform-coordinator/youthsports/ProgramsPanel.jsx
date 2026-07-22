import { useMemo, useState } from 'react';
import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	MenuItem,
	Select,
	TextField,
	Typography
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import DataTable from 'app/shared-components/data-table/DataTable';
import JurisdictionSelect from 'app/shared-components/jurisdiction-select/JurisdictionSelect';
import {
	useYouthPrograms,
	useCreateYouthProgram,
	useCloseYouthProgram,
	useYouthProgramEnrollments,
	useDeactivateYouthEnrollment,
	useReactivateYouthEnrollment
} from 'src/app/api/youthsports/useYouthSports';

const CATEGORIES = ['SPORTS', 'VOCATIONAL', 'ENTREPRENEURSHIP', 'ARTS', 'TECH', 'OTHER'];

const EMPTY_FORM = {
	title: '',
	description: '',
	category: 'SPORTS',
	sport: '',
	ageGroup: '',
	maxSlots: 20,
	coordinatorId: '',
	jurisdiction: { country: '', state: '', lga: '' }
};

function CreateProgramDialog({ open, onClose }) {
	const [form, setForm] = useState(EMPTY_FORM);
	const createProgram = useCreateYouthProgram();

	function handleSubmit() {
		createProgram.mutate(
			{ ...form, maxSlots: Number(form.maxSlots) },
			{
				onSuccess: () => {
					setForm(EMPTY_FORM);
					onClose();
				}
			}
		);
	}

	const canSubmit =
		form.title && form.description && form.ageGroup && form.coordinatorId &&
		form.jurisdiction.country && form.jurisdiction.state && form.jurisdiction.lga;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle>New Youth Program</DialogTitle>
			<DialogContent className="flex flex-col gap-16 pt-8">
				<TextField
					label="Title"
					fullWidth
					value={form.title}
					onChange={(e) => setForm({ ...form, title: e.target.value })}
				/>
				<TextField
					label="Description"
					fullWidth
					multiline
					minRows={2}
					value={form.description}
					onChange={(e) => setForm({ ...form, description: e.target.value })}
				/>
				<div>
					<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Category</Typography>
					<Select
						className="mt-8"
						fullWidth
						value={form.category}
						onChange={(e) => setForm({ ...form, category: e.target.value })}
					>
						{CATEGORIES.map((c) => (
							<MenuItem
								key={c}
								value={c}
							>
								{c}
							</MenuItem>
						))}
					</Select>
				</div>
				<TextField
					label="Sport (if applicable)"
					fullWidth
					value={form.sport}
					onChange={(e) => setForm({ ...form, sport: e.target.value })}
				/>
				<TextField
					label="Age Group (e.g. U15, U18, 18-25, OPEN)"
					fullWidth
					value={form.ageGroup}
					onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
				/>
				<TextField
					label="Max Slots"
					type="number"
					fullWidth
					value={form.maxSlots}
					onChange={(e) => setForm({ ...form, maxSlots: e.target.value })}
				/>
				<TextField
					label="Coordinator User ID"
					fullWidth
					value={form.coordinatorId}
					onChange={(e) => setForm({ ...form, coordinatorId: e.target.value })}
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
					disabled={!canSubmit || createProgram.isLoading}
					onClick={handleSubmit}
				>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function EnrollmentsDialog({ program, onClose }) {
	const { data, isLoading } = useYouthProgramEnrollments(program?.id);
	const deactivate = useDeactivateYouthEnrollment();
	const reactivate = useReactivateYouthEnrollment();
	const enrollments = data?.data ?? [];

	return (
		<Dialog
			open={Boolean(program)}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle>Enrollments — {program?.title}</DialogTitle>
			<DialogContent>
				{isLoading ? (
					<FuseLoading />
				) : enrollments.length === 0 ? (
					<Typography color="text.secondary">No enrollments yet.</Typography>
				) : (
					<div className="flex flex-col gap-8">
						{enrollments.map((e) => (
							<Box
								key={e.id}
								className="flex items-center justify-between p-8 border rounded"
							>
								<div>
									<Typography className="font-medium">{e.userId}</Typography>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										Enrolled {new Date(e.enrolledAt).toLocaleDateString()}
									</Typography>
								</div>
								<Chip
									label={e.isActive ? 'Active' : 'Inactive'}
									size="small"
									className={e.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200'}
									onClick={() =>
										e.isActive ? deactivate.mutate(e.id) : reactivate.mutate(e.id)
									}
								/>
							</Box>
						))}
					</div>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}

function ProgramsPanel() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [createOpen, setCreateOpen] = useState(false);
	const [enrollmentsProgram, setEnrollmentsProgram] = useState(null);

	const { data, isLoading, isFetching } = useYouthPrograms({ page: page + 1, limit: rowsPerPage });
	const closeProgram = useCloseYouthProgram();

	const programs = useMemo(() => data?.data?.data ?? [], [data]);
	const total = useMemo(() => data?.data?.total ?? 0, [data]);

	const columns = useMemo(
		() => [
			{ accessorKey: 'title', header: 'Title', size: 200 },
			{ accessorKey: 'category', header: 'Category', size: 130 },
			{ accessorKey: 'ageGroup', header: 'Age Group', size: 100 },
			{
				accessorKey: 'status',
				header: 'Status',
				size: 110,
				Cell: ({ row }) => (
					<Chip
						size="small"
						label={row.original.status}
						className={row.original.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-200'}
					/>
				)
			},
			{
				accessorFn: (row) => `${row.enrolledCount}/${row.maxSlots}`,
				id: 'slots',
				header: 'Enrolled',
				size: 90
			},
			{ accessorKey: 'lga', header: 'LGA', size: 120 },
			{
				id: 'actions',
				header: 'Actions',
				size: 160,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center gap-4">
						<Button
							size="small"
							onClick={() => setEnrollmentsProgram(row.original)}
						>
							Enrollments
						</Button>
						{row.original.status !== 'CLOSED' && (
							<IconButton
								size="small"
								title="Close program"
								onClick={() => closeProgram.mutate(row.original.id)}
							>
								<FuseSvgIcon size={18}>heroicons-outline:lock-closed</FuseSvgIcon>
							</IconButton>
						)}
					</div>
				)
			}
		],
		[closeProgram]
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
					<span className="mx-8">New Program</span>
				</Button>
			</div>

			<DataTable
				data={programs}
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

			<CreateProgramDialog
				open={createOpen}
				onClose={() => setCreateOpen(false)}
			/>
			<EnrollmentsDialog
				program={enrollmentsProgram}
				onClose={() => setEnrollmentsProgram(null)}
			/>
		</div>
	);
}

export default ProgramsPanel;
