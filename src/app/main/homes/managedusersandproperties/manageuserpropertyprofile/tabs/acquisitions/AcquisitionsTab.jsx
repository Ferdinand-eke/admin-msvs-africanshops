import { useState, useMemo } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Chip,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	CircularProgress,
	LinearProgress,
	Paper,
	Avatar,
	Divider,
	Grid,
	Drawer
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from 'app/shared-components/data-table/DataTable';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
} from 'chart.js';
import useAdminAcquisitions, {
	useVerifyAcquisitionPayment,
	useRejectAcquisitionPayment,
	useVerifyAcquisitionDocuments,
	useRejectAcquisitionDocuments,
	useCompleteAcquisition,
	useCancelAcquisition
} from '../../../../../../api/real-estate-acquisitions/useAcquisitions';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function AcquisitionsTab({ propertyId }) {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
	const [selectedAcquisition, setSelectedAcquisition] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [actionDialogOpen, setActionDialogOpen] = useState(false);
	const [actionType, setActionType] = useState('');
	const [actionNotes, setActionNotes] = useState('');

	const offset = pagination.pageIndex * pagination.pageSize;
	const limit = pagination.pageSize;

	const {
		data: acquisitionsData,
		isLoading,
		isFetching
	} = useAdminAcquisitions({
		limit,
		offset
	});

	const verifyPaymentMutation = useVerifyAcquisitionPayment();
	const rejectPaymentMutation = useRejectAcquisitionPayment();
	const verifyDocumentsMutation = useVerifyAcquisitionDocuments();
	const rejectDocumentsMutation = useRejectAcquisitionDocuments();
	const completeAcquisitionMutation = useCompleteAcquisition();
	const cancelAcquisitionMutation = useCancelAcquisition();

	const acquisitions = acquisitionsData?.data?.acquisitions || [];
	const paginationInfo = acquisitionsData?.data?.pagination || {
		total: 0,
		limit: pagination.pageSize,
		offset: 0
	};
	console.log('ADMIN_VIEW_ACQUISITIONS', acquisitions);

	// Mock chart data - Replace with actual historical data
	const chartData = {
		labels: ['Jan 2024', 'Apr 2024', 'Jul 2024', 'Oct 2024', 'Jan 2025'],
		datasets: [
			{
				label: 'Property Value',
				data: [350000, 365000, 380000, 390000, 405000],
				borderColor: 'rgb(59, 130, 246)',
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
				fill: true,
				tension: 0.4
			}
		]
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false
			},
			tooltip: {
				mode: 'index',
				intersect: false,
				callbacks: {
					label: (context) => `Value: $${context.parsed.y.toLocaleString()}`
				}
			}
		},
		scales: {
			y: {
				beginAtZero: false,
				ticks: {
					callback: (value) => `$${value.toLocaleString()}`
				}
			}
		},
		onClick: (event, elements) => {
			if (elements.length > 0) {
				const { index } = elements[0];
				// Handle chart point click - can open modal with acquisition details
				console.log('Clicked on point:', index);
			}
		}
	};

	const handleMenuOpen = (event, acquisition) => {
		setAnchorEl(event.currentTarget);
		setSelectedAcquisition(acquisition);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleViewDetails = (acquisition) => {
		setSelectedAcquisition(acquisition);
		setDetailsDrawerOpen(true);
		handleMenuClose();
	};

	const handleActionClick = (action) => {
		setActionType(action);
		setActionDialogOpen(true);
		handleMenuClose();
	};

	const handleActionConfirm = () => {
		if (!selectedAcquisition) return;

		const acquisitionId = selectedAcquisition.id;

		switch (actionType) {
			case 'verifyPayment':
				verifyPaymentMutation.mutate(
					{ acquisitionId, adminNotes: actionNotes },
					{ onSuccess: () => handleActionSuccess() }
				);
				break;
			case 'rejectPayment':
				rejectPaymentMutation.mutate(
					{ acquisitionId, rejectionReason: actionNotes },
					{ onSuccess: () => handleActionSuccess() }
				);
				break;
			case 'verifyDocuments':
				verifyDocumentsMutation.mutate(
					{ acquisitionId, adminNotes: actionNotes },
					{ onSuccess: () => handleActionSuccess() }
				);
				break;
			case 'rejectDocuments':
				rejectDocumentsMutation.mutate(
					{ acquisitionId, rejectionReason: actionNotes },
					{ onSuccess: () => handleActionSuccess() }
				);
				break;
			case 'complete':
				completeAcquisitionMutation.mutate(
					{ acquisitionId, adminNotes: actionNotes },
					{ onSuccess: () => handleActionSuccess() }
				);
				break;
			case 'cancel':
				cancelAcquisitionMutation.mutate(
					{ acquisitionId, cancellationReason: actionNotes },
					{ onSuccess: () => handleActionSuccess() }
				);
				break;
			default:
				break;
		}
	};

	const handleActionSuccess = () => {
		setActionDialogOpen(false);
		setActionNotes('');
		setSelectedAcquisition(null);
	};

	const getStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case 'pending':
				return 'warning';
			case 'payment_verified':
				return 'info';
			case 'documents_verified':
				return 'info';
			case 'completed':
				return 'success';
			case 'cancelled':
			case 'rejected':
				return 'error';
			default:
				return 'default';
		}
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'buyer',
				header: 'Buyer',
				Cell: ({ row }) => (
					<Box className="flex items-center gap-12">
						<Avatar
							src={row.original.buyer?.avatar}
							alt={row.original.buyer?.name}
							className="w-32 h-32"
						>
							{row.original.buyer?.name?.charAt(0) || 'B'}
						</Avatar>
						<Box>
							<Typography
								variant="body2"
								className="font-semibold"
							>
								{row.original.buyer?.name || 'Unknown'}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{row.original.buyer?.email || 'N/A'}
							</Typography>
						</Box>
					</Box>
				)
			},
			{
				accessorKey: 'acquisitionType',
				header: 'Type',
				Cell: ({ row }) => (
					<Chip
						label={row.original.acquisitionType || 'N/A'}
						size="small"
						variant="outlined"
						className="text-11"
					/>
				)
			},
			{
				accessorKey: 'totalAmountPaid',
				header: 'Amount',
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="font-semibold text-green-600"
					>
						N{row.original.totalAmountPaid?.toLocaleString() || '0'}
					</Typography>
				)
			},
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ row }) => (
					<Chip
						label={row.original.status || 'pending'}
						size="small"
						color={getStatusColor(row.original.status)}
						className="text-11"
					/>
				)
			},
			{
				accessorKey: 'createdAt',
				header: 'Date',
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						color="text.secondary"
					>
						{row.original.createdAt ? format(new Date(row.original.createdAt), 'MMM dd, yyyy') : 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				Cell: ({ row }) => (
					<Box className="flex gap-4">
						<IconButton
							size="small"
							onClick={() => handleViewDetails(row.original)}
						>
							<FuseSvgIcon size={20}>heroicons-outline:eye</FuseSvgIcon>
						</IconButton>
						<IconButton
							size="small"
							onClick={(e) => handleMenuOpen(e, row.original)}
							disabled={row.original.status === 'completed'}
						>
							<FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
						</IconButton>
					</Box>
				)
			}
		],
		[]
	);

	const isActionLoading =
		verifyPaymentMutation.isLoading ||
		rejectPaymentMutation.isLoading ||
		verifyDocumentsMutation.isLoading ||
		rejectDocumentsMutation.isLoading ||
		completeAcquisitionMutation.isLoading ||
		cancelAcquisitionMutation.isLoading;

	return (
		<Box className="w-full">
			{/* Property Value Growth Chart */}
			<Card
				elevation={1}
				className="mb-24"
			>
				<CardContent>
					<Box className="flex items-center justify-between mb-16">
						<Box>
							<Typography
								variant="h6"
								className="font-semibold"
							>
								Property Value Over Time
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Click on data points to view acquisition details
							</Typography>
						</Box>
						<Chip
							label="+15.7% YoY"
							size="small"
							color="success"
							icon={<FuseSvgIcon size={16}>heroicons-outline:trending-up</FuseSvgIcon>}
						/>
					</Box>
					<Box sx={{ height: 280 }}>
						<Line
							data={chartData}
							options={chartOptions}
						/>
					</Box>
				</CardContent>
			</Card>

			{/* Summary Cards */}
			<Grid
				container
				spacing={2}
				className="mb-24"
			>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<Card elevation={1}>
						<CardContent>
							<Box className="flex items-center justify-between">
								<Box>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										Total Acquisitions
									</Typography>
									<Typography
										variant="h5"
										className="font-bold"
									>
										{paginationInfo.total || 0}
									</Typography>
								</Box>
								<FuseSvgIcon
									size={32}
									color="primary"
								>
									heroicons-outline:document-text
								</FuseSvgIcon>
							</Box>
						</CardContent>
					</Card>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<Card elevation={1}>
						<CardContent>
							<Box className="flex items-center justify-between">
								<Box>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										Pending
									</Typography>
									<Typography
										variant="h5"
										className="font-bold"
									>
										{acquisitions.filter((a) => a.status === 'pending').length}
									</Typography>
								</Box>
								<FuseSvgIcon
									size={32}
									className="text-yellow-600"
								>
									heroicons-outline:clock
								</FuseSvgIcon>
							</Box>
						</CardContent>
					</Card>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<Card elevation={1}>
						<CardContent>
							<Box className="flex items-center justify-between">
								<Box>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										Completed
									</Typography>
									<Typography
										variant="h5"
										className="font-bold"
									>
										{acquisitions.filter((a) => a.status === 'completed').length}
									</Typography>
								</Box>
								<FuseSvgIcon
									size={32}
									className="text-green-600"
								>
									heroicons-outline:check-circle
								</FuseSvgIcon>
							</Box>
						</CardContent>
					</Card>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<Card elevation={1}>
						<CardContent>
							<Box className="flex items-center justify-between">
								<Box>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										Total Value
									</Typography>
									<Typography
										variant="h5"
										className="font-bold"
									>
										${acquisitions.reduce((sum, a) => sum + (a.amount || 0), 0).toLocaleString()}
									</Typography>
								</Box>
								<FuseSvgIcon
									size={32}
									className="text-blue-600"
								>
									heroicons-outline:currency-dollar
								</FuseSvgIcon>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Acquisitions Table */}
			<Paper elevation={1}>
				{isFetching && (
					<Box sx={{ width: '100%' }}>
						<LinearProgress color="secondary" />
					</Box>
				)}

				{isLoading && (
					<Box className="flex justify-center items-center p-48">
						<CircularProgress size={60} />
					</Box>
				)}

				<Box sx={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.3s ease-in-out' }}>
					<DataTable
						data={acquisitions}
						columns={columns}
						manualPagination
						rowCount={paginationInfo.total}
						state={{
							pagination,
							isLoading,
							showProgressBars: isFetching
						}}
						onPaginationChange={setPagination}
						enableGlobalFilter={false}
						muiLinearProgressProps={{
							color: 'secondary'
						}}
					/>
				</Box>

				{!isLoading && acquisitions.length === 0 && (
					<Box className="flex flex-col items-center justify-center p-48">
						<FuseSvgIcon
							size={64}
							color="disabled"
						>
							heroicons-outline:inbox
						</FuseSvgIcon>
						<Typography
							color="text.secondary"
							className="mt-16"
							variant="h6"
						>
							No acquisitions recorded yet
						</Typography>
					</Box>
				)}
			</Paper>

			{/* Action Menu */}
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
			>
				<MenuItem onClick={() => handleActionClick('verifyPayment')}>
					<FuseSvgIcon
						size={20}
						className="mr-8 text-green-600"
					>
						heroicons-outline:check
					</FuseSvgIcon>
					Verify Payment
				</MenuItem>
				<MenuItem onClick={() => handleActionClick('rejectPayment')}>
					<FuseSvgIcon
						size={20}
						className="mr-8 text-red-600"
					>
						heroicons-outline:x
					</FuseSvgIcon>
					Reject Payment
				</MenuItem>
				<Divider />
				<MenuItem onClick={() => handleActionClick('verifyDocuments')}>
					<FuseSvgIcon
						size={20}
						className="mr-8 text-green-600"
					>
						heroicons-outline:document-check
					</FuseSvgIcon>
					Verify Documents
				</MenuItem>
				<MenuItem onClick={() => handleActionClick('rejectDocuments')}>
					<FuseSvgIcon
						size={20}
						className="mr-8 text-red-600"
					>
						heroicons-outline:document-remove
					</FuseSvgIcon>
					Reject Documents
				</MenuItem>
				<Divider />
				<MenuItem onClick={() => handleActionClick('complete')}>
					<FuseSvgIcon
						size={20}
						className="mr-8 text-blue-600"
					>
						heroicons-outline:badge-check
					</FuseSvgIcon>
					Complete Acquisition
				</MenuItem>
				<MenuItem
					onClick={() => handleActionClick('cancel')}
					className="text-red-600"
				>
					<FuseSvgIcon
						size={20}
						className="mr-8"
					>
						heroicons-outline:ban
					</FuseSvgIcon>
					Cancel Acquisition
				</MenuItem>
			</Menu>

			{/* Action Dialog */}
			<Dialog
				open={actionDialogOpen}
				onClose={() => setActionDialogOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>{actionType.replace(/([A-Z])/g, ' $1').trim()}</DialogTitle>
				<Divider />
				<DialogContent>
					{selectedAcquisition && (
						<Box className="space-y-16">
							<Typography variant="body2">
								Buyer: <strong>{selectedAcquisition.buyer?.name}</strong>
							</Typography>
							<Typography variant="body2">
								Amount: <strong>${selectedAcquisition.totalAmountPaid?.toLocaleString()}</strong>
							</Typography>

							<TextField
								fullWidth
								label={
									actionType.includes('reject') || actionType.includes('cancel') ? 'Reason' : 'Notes'
								}
								multiline
								rows={3}
								value={actionNotes}
								onChange={(e) => setActionNotes(e.target.value)}
								placeholder="Enter notes or reason"
								variant="outlined"
								required={actionType.includes('reject') || actionType.includes('cancel')}
							/>
						</Box>
					)}
				</DialogContent>
				<DialogActions className="px-24 pb-16">
					<Button
						onClick={() => setActionDialogOpen(false)}
						variant="outlined"
					>
						Cancel
					</Button>
					<Button
						onClick={handleActionConfirm}
						variant="contained"
						color={actionType.includes('reject') || actionType.includes('cancel') ? 'error' : 'primary'}
						disabled={isActionLoading}
					>
						{isActionLoading ? <CircularProgress size={20} /> : 'Confirm'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Details Drawer */}
			<Drawer
				anchor="right"
				open={detailsDrawerOpen}
				onClose={() => setDetailsDrawerOpen(false)}
				PaperProps={{
					sx: { width: { xs: '100%', sm: 400 } }
				}}
			>
				{selectedAcquisition && (
					<Box className="p-24">
						<Box className="flex items-center justify-between mb-24">
							<Typography variant="h6">Acquisition Details</Typography>
							<IconButton onClick={() => setDetailsDrawerOpen(false)}>
								<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
							</IconButton>
						</Box>

						<Box className="space-y-16">
							<Box>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Buyer Information
								</Typography>
								<Box className="flex items-center gap-12 mt-8">
									<Avatar
										src={selectedAcquisition.buyer?.avatar}
										className="w-48 h-48"
									>
										{selectedAcquisition.buyer?.name?.charAt(0)}
									</Avatar>
									<Box>
										<Typography
											variant="body1"
											className="font-semibold"
										>
											{selectedAcquisition.buyer?.name}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											{selectedAcquisition.buyer?.email}
										</Typography>
									</Box>
								</Box>
							</Box>

							<Divider />

							<Box>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Acquisition Type
								</Typography>
								<Typography
									variant="body1"
									className="mt-4"
								>
									{selectedAcquisition.acquisitionType}
								</Typography>
							</Box>

							<Box>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Amount
								</Typography>
								<Typography
									variant="h6"
									className="mt-4 text-green-600"
								>
									N{selectedAcquisition.totalAmountPaid?.toLocaleString()}
								</Typography>
							</Box>

							<Box>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Status
								</Typography>
								<Box className="mt-4">
									<Chip
										label={selectedAcquisition.status}
										color={getStatusColor(selectedAcquisition.status)}
										size="small"
									/>
								</Box>
							</Box>

							<Box>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Date
								</Typography>
								<Typography
									variant="body1"
									className="mt-4"
								>
									{selectedAcquisition.createdAt
										? format(new Date(selectedAcquisition.createdAt), 'MMMM dd, yyyy')
										: 'N/A'}
								</Typography>
							</Box>

							{selectedAcquisition.adminNotes && (
								<Box>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										Admin Notes
									</Typography>
									<Typography
										variant="body2"
										className="mt-4"
									>
										{selectedAcquisition.adminNotes}
									</Typography>
								</Box>
							)}
						</Box>
					</Box>
				)}
			</Drawer>
		</Box>
	);
}

export default AcquisitionsTab;
