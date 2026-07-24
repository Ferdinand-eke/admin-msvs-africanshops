import { useMemo, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DataTable from 'app/shared-components/data-table/DataTable';
import { useAdminWithdrawals } from 'src/app/api/finance/useFinance';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

const STATUS_OPTIONS = ['PENDING_OTP', 'PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED'];
const STATUS_COLOR = {
	PENDING_OTP: 'bg-yellow-100 text-yellow-800',
	PROCESSING: 'bg-blue-100 text-blue-800',
	COMPLETED: 'bg-green-100 text-green-800',
	FAILED: 'bg-red-100 text-red-800',
	EXPIRED: 'bg-gray-200 text-gray-700'
};

function formatNaira(kobo) {
	return `₦${(Number(kobo || 0) / 100).toLocaleString()}`;
}

function StatusCell({ row }) {
	return (
		<Chip
			size="small"
			label={row.original.status}
			className={STATUS_COLOR[row.original.status] ?? 'bg-gray-200'}
		/>
	);
}

/**
 * Withdrawal oversight (read-only) — added 2026-07-24. Withdrawals already
 * fully auto-process end-to-end (no manual approval gate exists in the
 * money-movement flow), so this is monitoring only, not an approval action —
 * see Admin Web App tracker item 11 for why "approval UI" was the wrong frame.
 */
function WithdrawalsOversightApp() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [status, setStatus] = useState('');
	const [ownerType, setOwnerType] = useState('');

	const { data, isLoading, isFetching } = useAdminWithdrawals({
		page: page + 1,
		limit: rowsPerPage,
		status: status || undefined,
		ownerType: ownerType || undefined
	});

	const withdrawals = useMemo(() => data?.data?.data ?? [], [data]);
	const total = useMemo(() => data?.data?.total ?? 0, [data]);

	const columns = useMemo(
		() => [
			{ accessorKey: 'ownerType', header: 'Owner Type', size: 100 },
			{ accessorKey: 'ownerId', header: 'Owner ID', size: 160 },
			{
				accessorFn: (row) => formatNaira(row.amountKobo),
				id: 'amount',
				header: 'Amount',
				size: 110
			},
			{
				accessorFn: (row) => formatNaira(row.totalDebitKobo),
				id: 'totalDebit',
				header: 'Total Debit',
				size: 120
			},
			{ accessorKey: 'bankAccountName', header: 'Beneficiary', size: 160 },
			{ accessorKey: 'bankAccountNumber', header: 'Account No.', size: 130 },
			{
				accessorKey: 'status',
				header: 'Status',
				size: 130,
				Cell: StatusCell
			},
			{
				accessorFn: (row) => new Date(row.createdAt).toLocaleString(),
				id: 'createdAt',
				header: 'Created',
				size: 160
			}
		],
		[]
	);

	if (isLoading) return <FuseLoading />;

	return (
		<Root
			header={
				<div className="flex flex-1 w-full flex-col sm:flex-row sm:items-center sm:justify-between py-8 sm:py-16 px-16 md:px-24 gap-16">
					<div>
						<Typography className="text-24 md:text-32 font-extrabold tracking-tight">
							Withdrawal Oversight
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							Read-only — withdrawals already auto-process, this is monitoring only, not an approval step.
						</Typography>
					</div>
					<div className="flex gap-12">
						<FormControl
							size="small"
							className="min-w-136"
						>
							<InputLabel>Status</InputLabel>
							<Select
								label="Status"
								value={status}
								onChange={(e) => {
									setStatus(e.target.value);
									setPage(0);
								}}
							>
								<MenuItem value="">All</MenuItem>
								{STATUS_OPTIONS.map((s) => (
									<MenuItem
										key={s}
										value={s}
									>
										{s}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl
							size="small"
							className="min-w-136"
						>
							<InputLabel>Owner Type</InputLabel>
							<Select
								label="Owner Type"
								value={ownerType}
								onChange={(e) => {
									setOwnerType(e.target.value);
									setPage(0);
								}}
							>
								<MenuItem value="">All</MenuItem>
								<MenuItem value="USER">User</MenuItem>
								<MenuItem value="MERCHANT">Merchant</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>
			}
			content={
				<div className="w-full p-12 pt-16 sm:pt-24">
					<DataTable
						data={withdrawals}
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
					/>
				</div>
			}
		/>
	);
}

export default WithdrawalsOversightApp;
