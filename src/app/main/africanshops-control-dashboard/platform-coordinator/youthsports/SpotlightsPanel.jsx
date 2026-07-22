import { useMemo, useState } from 'react';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import DataTable from 'app/shared-components/data-table/DataTable';
import JurisdictionSelect from 'app/shared-components/jurisdiction-select/JurisdictionSelect';
import { useYouthSpotlightsForAdmin, useCreateYouthSpotlight, useVerifyYouthSpotlight } from 'src/app/api/youthsports/useYouthSports';

const EMPTY_FORM = {
	userId: '',
	displayName: '',
	sport: '',
	bio: '',
	jurisdiction: { country: '', state: '', lga: '' }
};

function CreateSpotlightDialog({ open, onClose }) {
	const [form, setForm] = useState(EMPTY_FORM);
	const createSpotlight = useCreateYouthSpotlight();

	function handleSubmit() {
		createSpotlight.mutate(form, {
			onSuccess: () => {
				setForm(EMPTY_FORM);
				onClose();
			}
		});
	}

	const canSubmit =
		form.userId && form.displayName && form.sport && form.bio &&
		form.jurisdiction.country && form.jurisdiction.state && form.jurisdiction.lga;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle>New Talent Spotlight</DialogTitle>
			<DialogContent className="flex flex-col gap-16 pt-8">
				<TextField
					label="User ID"
					fullWidth
					value={form.userId}
					onChange={(e) => setForm({ ...form, userId: e.target.value })}
				/>
				<TextField
					label="Display Name"
					fullWidth
					value={form.displayName}
					onChange={(e) => setForm({ ...form, displayName: e.target.value })}
				/>
				<TextField
					label="Sport"
					fullWidth
					value={form.sport}
					onChange={(e) => setForm({ ...form, sport: e.target.value })}
				/>
				<TextField
					label="Bio"
					fullWidth
					multiline
					minRows={2}
					value={form.bio}
					onChange={(e) => setForm({ ...form, bio: e.target.value })}
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
					disabled={!canSubmit || createSpotlight.isLoading}
					onClick={handleSubmit}
				>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function SpotlightsPanel() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [createOpen, setCreateOpen] = useState(false);

	const { data, isLoading, isFetching } = useYouthSpotlightsForAdmin({ page: page + 1, limit: rowsPerPage });
	const verifySpotlight = useVerifyYouthSpotlight();

	const spotlights = useMemo(() => data?.data?.data ?? [], [data]);
	const total = useMemo(() => data?.data?.total ?? 0, [data]);

	const columns = useMemo(
		() => [
			{ accessorKey: 'displayName', header: 'Name', size: 180 },
			{ accessorKey: 'sport', header: 'Sport', size: 130 },
			{ accessorKey: 'lga', header: 'LGA', size: 120 },
			{
				accessorKey: 'isVerified',
				header: 'Status',
				size: 140,
				Cell: ({ row }) => (
					<Chip
						size="small"
						label={row.original.isVerified ? 'Featured' : 'Awaiting Review'}
						className={row.original.isVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}
					/>
				)
			},
			{
				id: 'actions',
				header: 'Actions',
				size: 140,
				enableSorting: false,
				Cell: ({ row }) =>
					!row.original.isVerified && (
						<Button
							size="small"
							variant="outlined"
							color="secondary"
							onClick={() => verifySpotlight.mutate(row.original.id)}
						>
							<FuseSvgIcon size={16}>heroicons-outline:star</FuseSvgIcon>
							<span className="mx-4">Feature</span>
						</Button>
					)
			}
		],
		[verifySpotlight]
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
					<span className="mx-8">New Spotlight</span>
				</Button>
			</div>

			<DataTable
				data={spotlights}
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

			<CreateSpotlightDialog
				open={createOpen}
				onClose={() => setCreateOpen(false)}
			/>
		</div>
	);
}

export default SpotlightsPanel;
