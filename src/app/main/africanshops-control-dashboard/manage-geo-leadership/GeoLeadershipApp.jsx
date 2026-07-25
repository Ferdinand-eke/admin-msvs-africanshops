import { useMemo, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	TextField,
	Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DataTable from 'app/shared-components/data-table/DataTable';
import {
	useAdminCivicJurisdictionTotals,
	useAdminCivicObligations,
	useAdminJurisdictionWallets
} from 'src/app/api/civic-tax/useCivicTax';
import { useAdminsByJurisdiction, useRecruitGeoCoAdminMutation } from 'src/app/api/admin-users/useAdmins';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

const koboToNaira = (kobo) => `₦${(Number(kobo || 0) / 100).toLocaleString()}`;
const STATUS_COLOR = { UNPAID: 'warning', PAID: 'success', WAIVED: 'default', OVERDUE: 'error' };
const GEO_LEVELS = ['COUNTRY', 'STATE', 'LGA', 'WARD', 'MARKET'];

// Maps an admin's GEO_ASSET geoLevel to the civic-tax obligation/payment
// filter field it corresponds to. WARD/MARKET have no civic-tax filter
// equivalent (obligations are only issued at country/state/lga granularity),
// so those two levels only affect the co-administrator panel below, not the
// obligations/wallet sections — a real, known scope gap for this screen,
// not an oversight.
const CIVIC_TAX_FILTER_FIELD = { COUNTRY: 'country', STATE: 'state', LGA: 'lga' };

function StatusChip({ status }) {
	return (
		<Chip
			size="small"
			label={status}
			color={STATUS_COLOR[status] || 'default'}
		/>
	);
}

function InviteCoAdminDialog({ open, onClose, geoLevel, geoRefId }) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const { mutate, isLoading } = useRecruitGeoCoAdminMutation();

	const handleSubmit = () => {
		mutate(
			{ name, email },
			{
				onSuccess: (data) => {
					if (data?.data?.success) {
						setName('');
						setEmail('');
						onClose();
					}
				}
			}
		);
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="xs"
			fullWidth
		>
			<DialogTitle>Invite Co-Administrator</DialogTitle>
			<DialogContent className="flex flex-col gap-16 pt-8">
				<Typography
					variant="caption"
					color="text.secondary"
				>
					The invited admin inherits YOUR OWN jurisdiction assignment, not necessarily the{' '}
					{geoLevel?.toLowerCase()}({geoRefId || '—'}) shown above — this only works if you are that
					jurisdiction's own geo-asset admin. A super-admin browsing another jurisdiction will get a clear
					error on submit rather than a silently wrong invite.
				</Typography>
				<TextField
					label="Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					fullWidth
					autoFocus
				/>
				<TextField
					label="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					variant="contained"
					disabled={!name || !email || isLoading}
					onClick={handleSubmit}
				>
					Send Invite
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function CoAdministratorsPanel({ geoLevel, geoRefId }) {
	const [inviteOpen, setInviteOpen] = useState(false);
	const { data, isLoading, isFetching, error } = useAdminsByJurisdiction({ geoLevel, geoRefId });
	const admins = useMemo(() => data?.data?.admins ?? [], [data]);

	const columns = useMemo(
		() => [
			{ accessorKey: 'name', header: 'Name', size: 200 },
			{ accessorKey: 'email', header: 'Email', size: 240 },
			{
				accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
				id: 'createdAt',
				header: 'Added',
				size: 130
			}
		],
		[]
	);

	if (!geoLevel || !geoRefId) {
		return (
			<Typography
				variant="body2"
				color="text.secondary"
				className="p-16"
			>
				Select a jurisdiction above to see its co-administrators.
			</Typography>
		);
	}

	// A 403 here means the viewer isn't this jurisdiction's own admin and
	// isn't a super-admin either — expected, not a bug, per the backend's
	// listAdminsByJurisdiction scoping (item 28).
	if (error) {
		return (
			<Typography
				variant="body2"
				color="text.secondary"
				className="p-16"
			>
				You can only view co-administrators for your own jurisdiction, unless you're a super-admin.
			</Typography>
		);
	}

	return (
		<Box className="p-16">
			<Box className="flex items-center justify-between mb-16">
				<Typography variant="subtitle1">Co-Administrators</Typography>
				<Button
					variant="outlined"
					size="small"
					onClick={() => setInviteOpen(true)}
				>
					Invite Co-Admin
				</Button>
			</Box>
			{isLoading ? (
				<FuseLoading />
			) : (
				<DataTable
					data={admins}
					columns={columns}
					state={{ isLoading: isFetching }}
				/>
			)}
			<InviteCoAdminDialog
				open={inviteOpen}
				onClose={() => setInviteOpen(false)}
				geoLevel={geoLevel}
				geoRefId={geoRefId}
			/>
		</Box>
	);
}

function WalletSummary({ geoRefId }) {
	// Wallets are keyed COUNTRY_STATE_LGA (see zxfx-ledger-service's
	// getOrCreateJurisdictionPoolWallet) — a single-level admin jurisdiction
	// (e.g. just a STATE name) is used here as a prefix narrowing, same as
	// the existing Civic Tax screen's Wallets tab, not an exact key match.
	const { data, isLoading } = useAdminJurisdictionWallets(geoRefId || undefined);
	const items = useMemo(() => data?.data?.data ?? [], [data]);

	if (!geoRefId) return null;

	if (isLoading) return <FuseLoading />;

	if (!items.length) {
		return (
			<Typography
				variant="body2"
				color="text.secondary"
			>
				No jurisdiction pool wallet found matching "{geoRefId}".
			</Typography>
		);
	}

	return (
		<Box className="flex flex-wrap gap-12">
			{items.map((w) => (
				<Chip
					key={w.jurisdictionKey}
					label={`${w.jurisdictionKey}: ${koboToNaira(w.availableBalance)} available`}
					color="secondary"
					variant="outlined"
				/>
			))}
		</Box>
	);
}

function ObligationsSummary({ geoLevel, geoRefId }) {
	const filterField = CIVIC_TAX_FILTER_FIELD[geoLevel];
	const { data, isLoading, isFetching } = useAdminCivicObligations({
		[filterField]: filterField ? geoRefId : undefined,
		limit: 50
	});
	const { data: totalsData } = useAdminCivicJurisdictionTotals({ [filterField]: filterField ? geoRefId : undefined });

	const items = useMemo(() => data?.data?.data ?? [], [data]);
	const totals = useMemo(() => totalsData?.data ?? [], [totalsData]);

	const columns = useMemo(
		() => [
			{ accessorKey: 'obligationType', header: 'Obligation', size: 200 },
			{ id: 'amountKobo', header: 'Amount', size: 110, Cell: ({ row }) => koboToNaira(row.original.amountKobo) },
			{ id: 'paidKobo', header: 'Paid', size: 110, Cell: ({ row }) => koboToNaira(row.original.paidKobo) },
			{
				id: 'status',
				header: 'Status',
				size: 110,
				Cell: ({ row }) => <StatusChip status={row.original.status} />
			}
		],
		[]
	);

	if (!filterField) {
		return (
			<Typography
				variant="body2"
				color="text.secondary"
			>
				Obligations/wallet data isn't available at WARD/MARKET granularity — only co-administrator visibility
				applies at this level.
			</Typography>
		);
	}

	return (
		<Box className="flex flex-col gap-16">
			{totals.length > 0 && (
				<Box className="flex flex-wrap gap-12">
					{totals.map((t) => (
						<Chip
							key={`${t.country}-${t.state}-${t.lga}`}
							label={`${t.lga}, ${t.state}: ${koboToNaira(t.totalCollectedKobo)} collected`}
							color="primary"
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

function GeoLeadershipApp() {
	const [geoLevel, setGeoLevel] = useState('STATE');
	const [geoRefId, setGeoRefId] = useState('');
	const [appliedGeoRefId, setAppliedGeoRefId] = useState('');

	return (
		<Root
			header={
				<div className="flex flex-1 w-full flex-col py-8 sm:py-16 px-16 md:px-24">
					<Typography className="text-24 md:text-32 font-extrabold tracking-tight">
						Geo-Leadership Dashboard
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Tax-only scope for now — jurisdiction wallet balance, obligations, and co-administrators, one
						jurisdiction at a time. Governance stays Coming-Soon-gated and is not part of this screen.
					</Typography>
					<Box className="flex flex-wrap items-end gap-12 mt-16">
						<TextField
							select
							size="small"
							label="Level"
							value={geoLevel}
							onChange={(e) => setGeoLevel(e.target.value)}
							className="min-w-140"
						>
							{GEO_LEVELS.map((lvl) => (
								<MenuItem
									key={lvl}
									value={lvl}
								>
									{lvl}
								</MenuItem>
							))}
						</TextField>
						<TextField
							size="small"
							label="Jurisdiction name"
							placeholder="e.g. Lagos"
							value={geoRefId}
							onChange={(e) => setGeoRefId(e.target.value)}
							className="min-w-240"
						/>
						<Button
							variant="contained"
							onClick={() => setAppliedGeoRefId(geoRefId.trim())}
						>
							View
						</Button>
					</Box>
				</div>
			}
			content={
				appliedGeoRefId ? (
					<div className="w-full flex flex-col gap-24 p-16">
						<Box>
							<Typography
								variant="subtitle1"
								className="mb-8"
							>
								Jurisdiction Pool Wallet
							</Typography>
							<WalletSummary geoRefId={appliedGeoRefId} />
						</Box>
						<Box>
							<Typography
								variant="subtitle1"
								className="mb-8"
							>
								Obligations
							</Typography>
							<ObligationsSummary
								geoLevel={geoLevel}
								geoRefId={appliedGeoRefId}
							/>
						</Box>
						<Box>
							<CoAdministratorsPanel
								geoLevel={geoLevel}
								geoRefId={appliedGeoRefId}
							/>
						</Box>
					</div>
				) : (
					<Typography
						variant="body2"
						color="text.secondary"
						className="p-16"
					>
						Select a level and jurisdiction name above, then click "View".
					</Typography>
				)
			}
		/>
	);
}

export default GeoLeadershipApp;
