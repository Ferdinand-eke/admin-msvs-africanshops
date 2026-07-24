import { useMemo, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import { Box, Chip, Tab, Tabs, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DataTable from 'app/shared-components/data-table/DataTable';
import {
	useAdminCivicJurisdictionTotals,
	useAdminCivicObligations,
	useAdminCivicPayments,
	useAdminJurisdictionWallets
} from 'src/app/api/civic-tax/useCivicTax';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

const koboToNaira = (kobo) => `₦${(Number(kobo || 0) / 100).toLocaleString()}`;

const STATUS_COLOR = { UNPAID: 'warning', PAID: 'success', WAIVED: 'default', OVERDUE: 'error' };

function WalletsTab() {
	const [jurisdictionKeyPrefix, setJurisdictionKeyPrefix] = useState('');
	const { data, isLoading, isFetching } = useAdminJurisdictionWallets(jurisdictionKeyPrefix || undefined);
	const items = useMemo(() => data?.data ?? [], [data]);

	const columns = useMemo(
		() => [
			{ accessorKey: 'jurisdictionKey', header: 'Jurisdiction', size: 260 },
			{
				id: 'availableBalance',
				header: 'Available Balance',
				size: 160,
				Cell: ({ row }) => koboToNaira(row.original.availableBalance)
			},
			{
				id: 'reservedBalance',
				header: 'Reserved',
				size: 130,
				Cell: ({ row }) => koboToNaira(row.original.reservedBalance)
			},
			{ accessorKey: 'currency', header: 'Currency', size: 90 },
			{
				accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
				id: 'createdAt',
				header: 'Provisioned',
				size: 130
			}
		],
		[]
	);

	return (
		<Box className="p-16">
			<TextField
				size="small"
				label="Jurisdiction prefix (COUNTRY_STATE_LGA)"
				placeholder="e.g. NIGERIA_LAGOS"
				value={jurisdictionKeyPrefix}
				onChange={(e) => setJurisdictionKeyPrefix(e.target.value)}
				className="mb-16 min-w-320"
			/>
			{isLoading ? (
				<FuseLoading />
			) : (
				<DataTable data={items} columns={columns} state={{ isLoading: isFetching }} />
			)}
		</Box>
	);
}

function ObligationsTab() {
	const [filters, setFilters] = useState({ country: '', state: '', lga: '', status: '' });

	const { data, isLoading, isFetching } = useAdminCivicObligations({
		country: filters.country || undefined,
		state: filters.state || undefined,
		lga: filters.lga || undefined,
		status: filters.status || undefined,
		limit: 50
	});

	const items = useMemo(() => data?.data?.data ?? [], [data]);

	const columns = useMemo(
		() => [
			{ accessorKey: 'obligationType', header: 'Obligation', size: 220 },
			{
				id: 'jurisdiction',
				header: 'Issuing Jurisdiction',
				size: 220,
				Cell: ({ row }) => `${row.original.lga}, ${row.original.state}, ${row.original.country}`
			},
			{ id: 'amountKobo', header: 'Amount', size: 120, Cell: ({ row }) => koboToNaira(row.original.amountKobo) },
			{ id: 'paidKobo', header: 'Paid', size: 120, Cell: ({ row }) => koboToNaira(row.original.paidKobo) },
			{
				id: 'status',
				header: 'Status',
				size: 110,
				Cell: ({ row }) => <Chip size="small" label={row.original.status} color={STATUS_COLOR[row.original.status] || 'default'} />
			},
			{
				accessorFn: (row) => new Date(row.dueDate).toLocaleDateString(),
				id: 'dueDate',
				header: 'Due',
				size: 110
			}
		],
		[]
	);

	return (
		<Box className="p-16">
			<Box className="flex flex-wrap gap-12 mb-16">
				<TextField size="small" label="Country" value={filters.country} onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))} />
				<TextField size="small" label="State" value={filters.state} onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))} />
				<TextField size="small" label="LGA" value={filters.lga} onChange={(e) => setFilters((f) => ({ ...f, lga: e.target.value }))} />
				<TextField size="small" label="Status" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} placeholder="UNPAID / PAID / WAIVED" />
			</Box>
			{isLoading ? (
				<FuseLoading />
			) : (
				<DataTable data={items} columns={columns} state={{ isLoading: isFetching }} />
			)}
		</Box>
	);
}

function PaymentsTab() {
	const [filters, setFilters] = useState({ country: '', state: '', lga: '' });

	const { data, isLoading, isFetching } = useAdminCivicPayments({
		country: filters.country || undefined,
		state: filters.state || undefined,
		lga: filters.lga || undefined,
		limit: 50
	});
	const { data: totalsData } = useAdminCivicJurisdictionTotals({
		country: filters.country || undefined,
		state: filters.state || undefined,
		lga: filters.lga || undefined
	});

	const items = useMemo(() => data?.data?.data ?? [], [data]);
	const totals = useMemo(() => totalsData?.data ?? [], [totalsData]);

	const columns = useMemo(
		() => [
			{ accessorFn: (row) => row.obligation?.obligationType, id: 'obligationType', header: 'Obligation', size: 200 },
			{ id: 'amountKobo', header: 'Amount', size: 110, Cell: ({ row }) => koboToNaira(row.original.amountKobo) },
			{
				id: 'splitBreakdown',
				header: 'Split — where the money actually went',
				size: 420,
				enableSorting: false,
				Cell: ({ row }) => {
					const splits = row.original.splitBreakdown;
					if (!splits?.length) return '—';
					return (
						<Box className="flex flex-col gap-2">
							{splits.map((s, i) => (
								<Typography key={i} variant="caption">
									{s.label}: {koboToNaira(s.amountKobo)} → {s.jurisdiction?.lga}, {s.jurisdiction?.state}
								</Typography>
							))}
						</Box>
					);
				}
			},
			{
				accessorFn: (row) => new Date(row.createdAt).toLocaleString(),
				id: 'createdAt',
				header: 'Paid',
				size: 160
			}
		],
		[]
	);

	return (
		<Box className="p-16">
			<Box className="flex flex-wrap gap-12 mb-16">
				<TextField size="small" label="Country" value={filters.country} onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))} />
				<TextField size="small" label="State" value={filters.state} onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))} />
				<TextField size="small" label="LGA" value={filters.lga} onChange={(e) => setFilters((f) => ({ ...f, lga: e.target.value }))} />
			</Box>

			{totals.length > 0 && (
				<Box className="flex flex-wrap gap-12 mb-16">
					{totals.map((t) => (
						<Chip
							key={`${t.country}-${t.state}-${t.lga}`}
							label={`${t.lga}, ${t.state}: ${koboToNaira(t.totalCollectedKobo)} across ${t.obligationCount} obligation(s)`}
							color="secondary"
							variant="outlined"
						/>
					))}
				</Box>
			)}

			{isLoading ? (
				<FuseLoading />
			) : (
				<DataTable
					data={items}
					columns={columns}
					state={{ isLoading: isFetching }}
					initialState={{ pagination: { pageIndex: 0, pageSize: 20 } }}
				/>
			)}
		</Box>
	);
}

function CivicTaxApp() {
	const [tab, setTab] = useState(0);

	return (
		<Root
			header={
				<div className="flex flex-1 w-full flex-col py-8 sm:py-16 px-16 md:px-24">
					<Typography className="text-24 md:text-32 font-extrabold tracking-tight">Civic Tax</Typography>
					<Typography variant="caption" color="text.secondary">
						Jurisdiction pool wallets, obligations, and payments — where issued vs. where the money actually lands.
					</Typography>
					<Tabs value={tab} onChange={(_e, v) => setTab(v)} className="mt-8">
						<Tab label="Jurisdiction Wallets" />
						<Tab label="Obligations" />
						<Tab label="Payments" />
					</Tabs>
				</div>
			}
			content={
				<div className="w-full">
					{tab === 0 && <WalletsTab />}
					{tab === 1 && <ObligationsTab />}
					{tab === 2 && <PaymentsTab />}
				</div>
			}
		/>
	);
}

export default CivicTaxApp;
