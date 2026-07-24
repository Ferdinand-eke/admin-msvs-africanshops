import { useMemo, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DataTable from 'app/shared-components/data-table/DataTable';
import { useAdminPendingKyc, useApproveKyc } from 'src/app/api/kyc/useKyc';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

/**
 * KYC review (approve-only), 2026-07-24 — see Admin Web App tracker item 12.
 * No reject action exists on the backend at all (only a "verify" route that
 * always approves), so this is scoped to what's real: view the submitted ID
 * photo, approve. Rejecting a submission needs a real backend action first.
 */
function ReviewDialog({ submission, onClose }) {
	const [notes, setNotes] = useState('');
	const approve = useApproveKyc();

	if (!submission) return null;

	const record = submission.kycRecord ?? {};

	function handleApprove() {
		approve.mutate({ userId: submission.id, notes: notes || undefined }, { onSuccess: onClose });
	}

	return (
		<Dialog
			open={Boolean(submission)}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle>Review KYC — {submission.name}</DialogTitle>
			<DialogContent className="flex flex-col gap-16 pt-8">
				<div>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Account name
					</Typography>
					<Typography>{submission.name}</Typography>
				</div>
				<div>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Email
					</Typography>
					<Typography>{submission.email}</Typography>
				</div>
				<div>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Legal name on document
					</Typography>
					<Typography>{record.legalName || '—'}</Typography>
				</div>
				<div>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Document type
					</Typography>
					<Typography>{record.documentType || '—'}</Typography>
				</div>
				{record.documentImageUrl ? (
					<img
						src={record.documentImageUrl}
						alt="Submitted ID document"
						className="w-full rounded border"
					/>
				) : (
					<Typography color="text.secondary">No document image on file.</Typography>
				)}
				<TextField
					label="Review notes (optional)"
					fullWidth
					multiline
					minRows={2}
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					variant="contained"
					color="secondary"
					disabled={approve.isLoading}
					onClick={handleApprove}
				>
					Approve
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function ReviewActionCell({ row, table }) {
	return (
		<Button
			size="small"
			variant="outlined"
			onClick={() => table.options.meta.onReview(row.original)}
		>
			Review
		</Button>
	);
}

function KycReviewApp() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [reviewing, setReviewing] = useState(null);

	const { data, isLoading, isFetching } = useAdminPendingKyc({ page: page + 1, limit: rowsPerPage });

	const items = useMemo(() => data?.data?.items ?? [], [data]);
	const total = useMemo(() => data?.data?.total ?? 0, [data]);

	const columns = useMemo(
		() => [
			{ accessorKey: 'name', header: 'Name', size: 160 },
			{ accessorKey: 'email', header: 'Email', size: 200 },
			{
				accessorFn: (row) => row.kycRecord?.legalName || '—',
				id: 'legalName',
				header: 'Legal Name (ID)',
				size: 160
			},
			{
				accessorFn: (row) => row.kycRecord?.documentType || '—',
				id: 'documentType',
				header: 'Document Type',
				size: 140
			},
			{
				accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
				id: 'createdAt',
				header: 'Submitted',
				size: 120
			},
			{
				id: 'actions',
				header: 'Actions',
				size: 120,
				enableSorting: false,
				Cell: ReviewActionCell
			}
		],
		[]
	);

	if (isLoading) return <FuseLoading />;

	return (
		<Root
			header={
				<div className="flex flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
					<div>
						<Typography className="text-24 md:text-32 font-extrabold tracking-tight">KYC Review</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							Pending submissions — approve-only, no reject action exists on the backend yet.
						</Typography>
					</div>
				</div>
			}
			content={
				<div className="w-full p-12 pt-16 sm:pt-24">
					<DataTable
						data={items}
						columns={columns}
						manualPagination
						rowCount={total}
						pageCount={Math.ceil(total / rowsPerPage) || 1}
						onPaginationChange={(updater) => {
							const next =
								typeof updater === 'function'
									? updater({ pageIndex: page, pageSize: rowsPerPage })
									: updater;

							if (next.pageIndex !== page) setPage(next.pageIndex);

							if (next.pageSize !== rowsPerPage) setRowsPerPage(next.pageSize);
						}}
						state={{ pagination: { pageIndex: page, pageSize: rowsPerPage }, isLoading: isFetching }}
						initialState={{ pagination: { pageIndex: 0, pageSize: 20 } }}
						meta={{ onReview: setReviewing }}
					/>

					<ReviewDialog
						submission={reviewing}
						onClose={() => setReviewing(null)}
					/>
				</div>
			}
		/>
	);
}

export default KycReviewApp;
