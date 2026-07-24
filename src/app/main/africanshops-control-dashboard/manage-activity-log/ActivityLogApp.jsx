import { useMemo, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DataTable from 'app/shared-components/data-table/DataTable';
import { useAdminAuditLog } from 'src/app/api/audit-log/useAuditLog';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

// Real, actioned admin events logged so far — extend as more admin actions
// are wired into AuditLogService.write(), same incremental pattern as
// @AdminAuth()'s own rollout across controllers.
const ACTIONS = [
	'KYC_VERIFY',
	'MERCHANT_SUSPEND',
	'MERCHANT_UNSUSPEND',
	'MERCHANT_BLOCK',
	'MERCHANT_UNBLOCK',
	'MERCHANT_VERIFY'
];
const TARGET_TYPES = ['USER', 'MERCHANT'];

function ActionCell({ row }) {
	return (
		<Chip
			size="small"
			label={row.original.action}
			className="bg-blue-100 text-blue-800"
		/>
	);
}

function ActivityLogApp() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [action, setAction] = useState('');
	const [targetType, setTargetType] = useState('');

	const { data, isLoading, isFetching } = useAdminAuditLog({
		page: page + 1,
		limit: rowsPerPage,
		action: action || undefined,
		targetType: targetType || undefined
	});

	const items = useMemo(() => data?.data?.items ?? [], [data]);
	const total = useMemo(() => data?.data?.total ?? 0, [data]);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'action',
				header: 'Action',
				size: 160,
				Cell: ActionCell
			},
			{ accessorKey: 'targetType', header: 'Target Type', size: 120 },
			{ accessorKey: 'targetId', header: 'Target ID', size: 200 },
			{ accessorKey: 'adminId', header: 'Admin ID', size: 200 },
			{
				accessorFn: (row) => (row.metadata ? JSON.stringify(row.metadata) : '—'),
				id: 'metadata',
				header: 'Details',
				size: 220
			},
			{
				accessorFn: (row) => new Date(row.createdAt).toLocaleString(),
				id: 'createdAt',
				header: 'When',
				size: 180
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
							Activity Log
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							Real admin actions — KYC verification and merchant moderation today, more to come.
						</Typography>
					</div>
					<div className="flex gap-12">
						<FormControl
							size="small"
							className="min-w-136"
						>
							<InputLabel>Action</InputLabel>
							<Select
								label="Action"
								value={action}
								onChange={(e) => {
									setAction(e.target.value);
									setPage(0);
								}}
							>
								<MenuItem value="">All</MenuItem>
								{ACTIONS.map((a) => (
									<MenuItem
										key={a}
										value={a}
									>
										{a}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl
							size="small"
							className="min-w-136"
						>
							<InputLabel>Target Type</InputLabel>
							<Select
								label="Target Type"
								value={targetType}
								onChange={(e) => {
									setTargetType(e.target.value);
									setPage(0);
								}}
							>
								<MenuItem value="">All</MenuItem>
								{TARGET_TYPES.map((t) => (
									<MenuItem
										key={t}
										value={t}
									>
										{t}
									</MenuItem>
								))}
							</Select>
						</FormControl>
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
					/>
				</div>
			}
		/>
	);
}

export default ActivityLogApp;
