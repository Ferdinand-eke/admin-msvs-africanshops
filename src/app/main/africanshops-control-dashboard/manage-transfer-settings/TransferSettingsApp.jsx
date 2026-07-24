import { useEffect, useMemo, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useApplicationSettings, { useUpdateTransferSettings } from 'src/app/api/application-settings/useSettings';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

// Real enum (Prisma `PaymentProviderStatus`, shared with
// paystackPaymentStatus/flutterwavePaymentStatus/directPayStatus) —
// MAINTENANCE, not TESTING.
const STATUS_OPTIONS = ['ACTIVE', 'DISABLED', 'MAINTENANCE'];

const STATUS_COLOR = {
	ACTIVE: 'success',
	DISABLED: 'error',
	MAINTENANCE: 'warning'
};

const SWITCHES = [
	{
		field: 'internalTransferStatus',
		label: 'Internal Transfers',
		description: 'Wallet-to-wallet transfers between AfricanShops accounts.'
	},
	{
		field: 'externalTransferStatus',
		label: 'External Transfers',
		description: 'Withdrawals and transfers out to external bank accounts.'
	}
];

/**
 * Finance kill-switches (2026-07-24) — Admin Web App item 26. Toggles
 * internalTransferStatus/externalTransferStatus, enforced server-side in
 * zxfx-fintech-service (item 25) at initiateTransfer/initiateExternalPayout.
 * Mirrors the Payment Providers section of the generic application-settings
 * drawer (same Select-per-field pattern, same underlying model) but as its
 * own super-admin-gated screen, since this can halt real money movement
 * platform-wide rather than just toggle a payment-provider integration.
 */
function TransferSettingsApp() {
	const { data: settingsResponse, isLoading } = useApplicationSettings();
	const updateMutation = useUpdateTransferSettings();

	// Reads the CONTROLPANEL row specifically (2026-07-24 rework), matching
	// auth-service's getPublicSettings/updateTransferSettings — not `isActive`,
	// which is ambiguous once more than one of the 3 portal rows is active.
	const activeSettings = useMemo(() => {
		const rows = settingsResponse?.data?.payload ?? [];
		return rows.find((row) => row.appActivatedOn === 'CONTROLPANEL') ?? null;
	}, [settingsResponse]);

	const [internalTransferStatus, setInternalTransferStatus] = useState('ACTIVE');
	const [externalTransferStatus, setExternalTransferStatus] = useState('ACTIVE');
	const [confirmField, setConfirmField] = useState(null); // { field, label, nextValue } | null

	useEffect(() => {
		if (!activeSettings) return;

		setInternalTransferStatus(activeSettings.internalTransferStatus ?? 'ACTIVE');
		setExternalTransferStatus(activeSettings.externalTransferStatus ?? 'ACTIVE');
	}, [activeSettings]);

	const current = { internalTransferStatus, externalTransferStatus };
	const setters = {
		internalTransferStatus: setInternalTransferStatus,
		externalTransferStatus: setExternalTransferStatus
	};

	const isDirty =
		activeSettings != null &&
		(internalTransferStatus !== (activeSettings.internalTransferStatus ?? 'ACTIVE') ||
			externalTransferStatus !== (activeSettings.externalTransferStatus ?? 'ACTIVE'));

	function handleSelectChange(field, label) {
		return (event) => {
			const nextValue = event.target.value;

			// Disruptive change (suspends real money movement) — confirm first.
			if (nextValue !== 'ACTIVE') {
				setConfirmField({ field, label, nextValue });
				return;
			}

			setters[field](nextValue);
		};
	}

	function applyConfirmedChange() {
		if (!confirmField) return;

		setters[confirmField.field](confirmField.nextValue);
		setConfirmField(null);
	}

	function handleSave() {
		updateMutation.mutate({ internalTransferStatus, externalTransferStatus });
	}

	function handleReset() {
		if (!activeSettings) return;

		setInternalTransferStatus(activeSettings.internalTransferStatus ?? 'ACTIVE');
		setExternalTransferStatus(activeSettings.externalTransferStatus ?? 'ACTIVE');
	}

	if (isLoading) return <FuseLoading />;

	return (
		<>
			<Root
				header={
					<div className="flex flex-1 w-full flex-col sm:flex-row sm:items-center sm:justify-between py-8 sm:py-16 px-16 md:px-24 gap-16">
						<div>
							<Typography className="text-24 md:text-32 font-extrabold tracking-tight">
								Finance Kill-Switches
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Suspends internal or external money movement platform-wide. Changes apply within 30
								seconds.
							</Typography>
						</div>
						<div className="flex gap-8">
							<Chip
								size="small"
								label={`Internal: ${activeSettings?.internalTransferStatus ?? '—'}`}
								color={STATUS_COLOR[activeSettings?.internalTransferStatus] ?? 'default'}
							/>
							<Chip
								size="small"
								label={`External: ${activeSettings?.externalTransferStatus ?? '—'}`}
								color={STATUS_COLOR[activeSettings?.externalTransferStatus] ?? 'default'}
							/>
						</div>
					</div>
				}
				content={
					<div className="w-full p-12 pt-16 sm:pt-24 max-w-3xl">
						{!activeSettings ? (
							<Typography color="text.secondary">
								No CONTROLPANEL application settings row found — settings must be initialized before
								transfer kill-switches can be configured.
							</Typography>
						) : (
							<Paper className="p-24">
								<Grid
									container
									spacing={3}
								>
									{SWITCHES.map(({ field, label, description }) => (
										<Grid
											item
											xs={12}
											sm={6}
											key={field}
										>
											<FormControl fullWidth>
												<InputLabel>{label}</InputLabel>
												<Select
													value={current[field]}
													onChange={handleSelectChange(field, label)}
													label={label}
												>
													{STATUS_OPTIONS.map((status) => (
														<MenuItem
															key={status}
															value={status}
														>
															{status}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<Typography
												variant="caption"
												color="text.secondary"
												className="block mt-4"
											>
												{description}
											</Typography>
										</Grid>
									))}
								</Grid>

								{activeSettings.updatedAt && (
									<Typography
										variant="caption"
										color="text.secondary"
										className="block mt-24"
									>
										Last updated {new Date(activeSettings.updatedAt).toLocaleString()}
									</Typography>
								)}

								<div className="flex gap-12 mt-24">
									<Button
										variant="contained"
										color="primary"
										disabled={!isDirty || updateMutation.isLoading}
										onClick={handleSave}
										startIcon={<FuseSvgIcon size={18}>heroicons-outline:check</FuseSvgIcon>}
									>
										Save Changes
									</Button>
									<Button
										variant="outlined"
										disabled={!isDirty || updateMutation.isLoading}
										onClick={handleReset}
									>
										Reset
									</Button>
								</div>
							</Paper>
						)}
					</div>
				}
			/>

			<Dialog
				open={Boolean(confirmField)}
				onClose={() => setConfirmField(null)}
			>
				<DialogTitle>Confirm {confirmField?.nextValue}</DialogTitle>
				<DialogContent>
					<Typography>
						Set <strong>{confirmField?.label}</strong> to <strong>{confirmField?.nextValue}</strong>? This
						will block{' '}
						{confirmField?.field === 'internalTransferStatus'
							? 'wallet-to-wallet transfers'
							: 'withdrawals and external transfers'}{' '}
						platform-wide until it's set back to ACTIVE. Click "Save Changes" afterward to apply it.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmField(null)}>Cancel</Button>
					<Button
						onClick={applyConfirmedChange}
						color="error"
						variant="contained"
					>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default TransferSettingsApp;
