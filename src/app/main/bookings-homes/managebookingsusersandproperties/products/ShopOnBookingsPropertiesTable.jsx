/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, Paper, Box, Avatar, Tooltip, LinearProgress } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useMerchantsPaginated } from 'src/app/api/shops/useAdminShops';

function ShopOnBookingsPropertiesTable() {

	// Pagination state
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [globalFilter, setGlobalFilter] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	// Debounce search input to avoid excessive API calls
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(globalFilter);
			setPage(0); // Reset to first page on search
		}, 500);

		return () => clearTimeout(timer);
	}, [globalFilter]);

	// Fetch merchants with pagination
	const {
		data: merchantsResponse,
		isLoading,
		isError,
		isFetching
	} = useMerchantsPaginated({
		page,
		limit: rowsPerPage,
		search: debouncedSearch,
		filters: {}
	});

	// Extract and filter hospitality merchants
	const hospitalityMerchants = useMemo(() => {
		const allMerchants = merchantsResponse?.data?.merchants || [];
		return allMerchants.filter(
			(merchant) => merchant?.merchantShopplan?.plankey === 'HOTELSANDAPARTMENTS'
		);
	}, [merchantsResponse]);

	const totalCount = useMemo(() => hospitalityMerchants.length, [hospitalityMerchants]);
	const pagination = useMemo(() => merchantsResponse?.data?.pagination, [merchantsResponse]);

	// Calculate total pages based on filtered results
	const pageCount = useMemo(() => {
		if (!totalCount || !rowsPerPage) return 0;
		return Math.ceil(totalCount / rowsPerPage);
	}, [totalCount, rowsPerPage]);

	// Log pagination info for debugging
	useEffect(() => {
		if (merchantsResponse?.data?.pagination) {
			console.log('Hospitality Merchants Info:', {
				page,
				rowsPerPage,
				totalHospitalityMerchants: totalCount,
				totalAllMerchants: merchantsResponse.data.pagination.total,
				currentRecords: hospitalityMerchants.length
			});
		}
	}, [merchantsResponse, page, rowsPerPage, hospitalityMerchants, totalCount]);

	// Pagination handlers
	const handlePageChange = useCallback((newPage) => {
		setPage(newPage);
	}, []);

	const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
		setRowsPerPage(newRowsPerPage);
		setPage(0);
	}, []);

	const handleGlobalFilterChange = useCallback((value) => {
		setGlobalFilter(value);
	}, []);

	// Helper function to calculate merchant performance score
	const calculatePerformanceScore = useCallback((merchant) => {
		let score = 0;
		if (merchant?.verified) score += 20;
		if (!merchant?.isSuspended && !merchant?.isBlocked) score += 20;
		if (merchant?.properties?.length > 0) score += 20;
		if (merchant?.totalBookings > 0) score += 20;
		if (merchant?.averageRating >= 4) score += 20;
		return score;
	}, []);

	// Helper function to get performance color
	const getPerformanceColor = useCallback((score) => {
		if (score >= 80) return 'success';
		if (score >= 60) return 'info';
		if (score >= 40) return 'warning';
		return 'error';
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.shopname,
				id: 'coverImage',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 80,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row?.original?.coverimage?.length > 0 ? (
							<Avatar
								className="w-48 h-48"
								src={row?.original?.coverimage}
								alt={row?.original?.shopname}
								variant="rounded"
							/>
						) : (
							<Avatar
								className="w-48 h-48"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row?.original?.shopname}
								variant="rounded"
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'shopname',
				header: 'Property Name',
				size: 220,
				Cell: ({ row }) => (
					<div className="flex flex-col">
						<Typography
							component={Link}
							to={`/hospitality/merchants/${row?.original?.id}/${row?.original?.slug}`}
							className="underline font-semibold"
							color="secondary"
							role="button"
						>
							{row?.original?.shopname}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							className="mt-4"
						>
							ID: {row?.original?.shopId || row?.original?.id}
						</Typography>
					</div>
				)
			},
			{
				accessorKey: 'contacts',
				header: 'Contact Info',
				size: 200,
				Cell: ({ row }) => (
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-4">
							<FuseSvgIcon
								size={16}
								className="text-grey-600"
							>
								heroicons-outline:mail
							</FuseSvgIcon>
							<Typography
								variant="body2"
								className="text-11"
							>
								{row?.original?.shopemail || 'N/A'}
							</Typography>
						</div>
						<div className="flex items-center gap-4">
							<FuseSvgIcon
								size={16}
								className="text-grey-600"
							>
								heroicons-outline:phone
							</FuseSvgIcon>
							<Typography
								variant="body2"
								className="text-11"
							>
								{row?.original?.shopphone || 'N/A'}
							</Typography>
						</div>
					</div>
				)
			},
			{
				accessorKey: 'location',
				header: 'Location',
				size: 180,
				Cell: ({ row }) => (
					<div className="flex flex-col gap-4">
						<Chip
							icon={<FuseSvgIcon size={14}>heroicons-outline:location-marker</FuseSvgIcon>}
							className="text-11"
							size="small"
							color="default"
							label={row?.original?.shopcity || row?.original?.address || 'N/A'}
						/>
						{row?.original?.shopcountry && (
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{row?.original?.shopcountry}
							</Typography>
						)}
					</div>
				)
			},
			// {
			// 	accessorKey: 'properties',
			// 	header: 'Properties',
			// 	size: 120,
			// 	Cell: ({ row }) => {
			// 		const propertiesCount = row?.original?.properties?.length || 0;
			// 		return (
			// 			<Tooltip title={`${propertiesCount} listed properties`}>
			// 				<Chip
			// 					icon={<FuseSvgIcon size={14}>heroicons-outline:home</FuseSvgIcon>}
			// 					className="text-11 font-semibold"
			// 					size="small"
			// 					color={propertiesCount > 0 ? 'primary' : 'default'}
			// 					label={`${propertiesCount} Properties`}
			// 				/>
			// 			</Tooltip>
			// 		);
			// 	}
			// },
			// {
			// 	accessorKey: 'bookings',
			// 	header: 'Bookings',
			// 	size: 120,
			// 	Cell: ({ row }) => {
			// 		const bookingsCount = row?.original?.totalBookings || 0;
			// 		const activeBookings = row?.original?.activeBookings || 0;
			// 		return (
			// 			<Tooltip title={`${bookingsCount} total bookings, ${activeBookings} active`}>
			// 				<div className="flex flex-col gap-4">
			// 					<Chip
			// 						icon={<FuseSvgIcon size={14}>heroicons-outline:calendar</FuseSvgIcon>}
			// 						className="text-11 font-semibold"
			// 						size="small"
			// 						color={bookingsCount > 0 ? 'success' : 'default'}
			// 						label={`${bookingsCount} Total`}
			// 					/>
			// 					{activeBookings > 0 && (
			// 						<Chip
			// 							className="text-11"
			// 							size="small"
			// 							color="warning"
			// 							label={`${activeBookings} Active`}
			// 						/>
			// 					)}
			// 				</div>
			// 			</Tooltip>
			// 		);
			// 	}
			// },
			// {
			// 	accessorKey: 'ratings',
			// 	header: 'Rating',
			// 	size: 140,
			// 	Cell: ({ row }) => {
			// 		const rating = row?.original?.averageRating || 0;
			// 		const reviewCount = row?.original?.reviewCount || 0;
			// 		return (
			// 			<div className="flex flex-col gap-4">
			// 				<div className="flex items-center gap-8">
			// 					<Rating
			// 						value={rating}
			// 						precision={0.5}
			// 						size="small"
			// 						readOnly
			// 					/>
			// 					<Typography
			// 						variant="body2"
			// 						className="font-semibold"
			// 					>
			// 						{rating.toFixed(1)}
			// 					</Typography>
			// 				</div>
			// 				<Typography
			// 					variant="caption"
			// 					color="text.secondary"
			// 				>
			// 					{reviewCount} reviews
			// 				</Typography>
			// 			</div>
			// 		);
			// 	}
			// },
			{
				accessorKey: 'revenue',
				header: 'Revenue',
				size: 140,
				Cell: ({ row }) => {
					const revenue = row?.original?.shopaccount?.accountbalance || 0;
					const currency = row?.original?.currency || 'NGN';
					return (
						<div className="flex flex-col gap-4">
							<Chip
								icon={<FuseSvgIcon size={14}>heroicons-outline:currency-dollar</FuseSvgIcon>}
								className="text-11 font-bold"
								size="small"
								color="success"
								label={`${currency} ${revenue.toLocaleString()}`}
							/>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Total earnings
							</Typography>
						</div>
					);
				}
			},
			{
				accessorKey: 'verification',
				header: 'Verification',
				size: 120,
				Cell: ({ row }) => (
					<Tooltip title={row?.original?.verified ? 'Verified merchant' : 'Unverified merchant'}>
						<div className="flex items-center justify-center">
							{row?.original?.verified ? (
								<Chip
									icon={
										<FuseSvgIcon
											className="text-white"
											size={16}
										>
											heroicons-outline:badge-check
										</FuseSvgIcon>
									}
									className="text-11 bg-green-600 text-white"
									size="small"
									label="Verified"
								/>
							) : (
								<Chip
									icon={
										<FuseSvgIcon
											className="text-grey-600"
											size={16}
										>
											heroicons-outline:x-circle
										</FuseSvgIcon>
									}
									className="text-11"
									size="small"
									color="default"
									label="Unverified"
								/>
							)}
						</div>
					</Tooltip>
				)
			},
			{
				accessorKey: 'compliance',
				header: 'Compliance',
				size: 120,
				Cell: ({ row }) => {
					const isSuspended = row?.original?.isSuspended;
					const isBlocked = row?.original?.isBlocked;
					const isCompliant = !isSuspended && !isBlocked;

					return (
						<Tooltip
							title={
								isCompliant
									? 'Compliant - Good standing'
									: `Non-compliant - ${isSuspended ? 'Suspended' : ''} ${isBlocked ? 'Blocked' : ''}`
							}
						>
							<div className="flex items-center justify-center">
								{isCompliant ? (
									<Chip
										icon={
											<FuseSvgIcon
												className="text-white"
												size={16}
											>
												heroicons-outline:shield-check
											</FuseSvgIcon>
										}
										className="text-11 bg-green-600 text-white"
										size="small"
										label="Compliant"
									/>
								) : (
									<Chip
										icon={
											<FuseSvgIcon
												className="text-white"
												size={16}
											>
												heroicons-outline:shield-exclamation
											</FuseSvgIcon>
										}
										className="text-11 bg-red-600 text-white"
										size="small"
										label="Non-Compliant"
									/>
								)}
							</div>
						</Tooltip>
					);
				}
			},
			{
				accessorKey: 'performance',
				header: 'Performance',
				size: 140,
				Cell: ({ row }) => {
					const score = calculatePerformanceScore(row?.original);
					const color = getPerformanceColor(score);

					return (
						<Tooltip title={`Performance score: ${score}/100`}>
							<div className="flex flex-col gap-8 w-full">
								<div className="flex items-center justify-between">
									<Typography
										variant="caption"
										className="font-semibold"
									>
										{score}%
									</Typography>
								</div>
								<LinearProgress
									variant="determinate"
									value={score}
									color={color}
									className="w-full"
								/>
							</div>
						</Tooltip>
					);
				}
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				size: 160,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex flex-col gap-8">
						{/* <Button
							component={Link}
							to={`/bookings-hospitality/user-listings/${row.original.id}/${row.original.slug}`}
							className="text-11"
							size="small"
							variant="contained"
							color="secondary"
							startIcon={<FuseSvgIcon size={14}>heroicons-outline:eye</FuseSvgIcon>}
						>
							View Details
						</Button> */}
						<Button
							component={Link}
							to={`/bookings-hospitality/user-listings/${row.original.id}/manage`}
							className="text-11"
							size="small"
							variant="outlined"
							color="primary"
							startIcon={<FuseSvgIcon size={14}>heroicons-outline:home</FuseSvgIcon>}
						>
							Manage Properties
						</Button>
					</div>
				)
			}
		],
		[calculatePerformanceScore, getPerformanceColor]
	);

	if (isLoading && !isFetching) {
		return <FuseLoading />;
	}

	if (isError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					Error occurred retrieving hospitality merchants!
				</Typography>
				<Button
					className="mt-24"
					variant="outlined"
					onClick={() => window.location.reload()}
					color="secondary"
				>
					<FuseSvgIcon size={20}>heroicons-outline:refresh</FuseSvgIcon>
					<span className="mx-8">Retry</span>
				</Button>
			</motion.div>
		);
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			{/* Header with statistics */}
			<Box className="px-24 py-16 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
				<div className="flex items-center justify-between">
					<div>
						<Typography
							variant="h6"
							className="font-bold"
						>
							Hospitality Merchants Dashboard
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mt-4"
						>
							Monitor and manage hotels, apartments, and booking properties
						</Typography>
					</div>
					<div className="flex gap-16">
						<div className="flex flex-col items-center px-16 py-8 bg-white rounded-lg shadow-sm">
							<Typography
								variant="h5"
								className="font-bold text-blue-600"
							>
								{totalCount}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Total Merchants
							</Typography>
						</div>
						<div className="flex flex-col items-center px-16 py-8 bg-white rounded-lg shadow-sm">
							<Typography
								variant="h5"
								className="font-bold text-green-600"
							>
								{hospitalityMerchants.filter((m) => !m?.isSuspended && !m?.isBlocked).length}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Active
							</Typography>
						</div>
						<div className="flex flex-col items-center px-16 py-8 bg-white rounded-lg shadow-sm">
							<Typography
								variant="h5"
								className="font-bold text-purple-600"
							>
								{hospitalityMerchants.filter((m) => m?.verified).length}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Verified
							</Typography>
						</div>
					</div>
				</div>
			</Box>

			{/* Pagination Info Display */}
			{pagination && totalCount > 0 && (
				<Box className="px-24 py-12 border-b">
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Showing {Math.min(page * rowsPerPage + 1, totalCount)} to{' '}
						{Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount.toLocaleString()} Hospitality
						Merchants
						{debouncedSearch && ` (filtered by "${debouncedSearch}")`}
					</Typography>
				</Box>
			)}

			<DataTable
				data={hospitalityMerchants}
				columns={columns}
				manualPagination
				rowCount={totalCount}
				pageCount={pageCount}
				onPaginationChange={(updater) => {
					const newPagination =
						typeof updater === 'function' ? updater({ pageIndex: page, pageSize: rowsPerPage }) : updater;

					if (newPagination.pageIndex !== page) {
						handlePageChange(newPagination.pageIndex);
					}

					if (newPagination.pageSize !== rowsPerPage) {
						handleRowsPerPageChange(newPagination.pageSize);
					}
				}}
				onGlobalFilterChange={handleGlobalFilterChange}
				state={{
					pagination: {
						pageIndex: page,
						pageSize: rowsPerPage
					},
					globalFilter,
					isLoading: isFetching,
					showProgressBars: isFetching
				}}
				initialState={{
					density: 'comfortable',
					showGlobalFilter: true,
					showColumnFilters: false,
					pagination: {
						pageIndex: 0,
						pageSize: 20
					}
				}}
				muiPaginationProps={{
					rowsPerPageOptions: [10, 20, 50, 100],
					showFirstButton: true,
					showLastButton: true
				}}
				renderEmptyRowsFallback={() => (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { delay: 0.1 } }}
						className="flex flex-col flex-1 items-center justify-center h-full py-48"
					>
						<FuseSvgIcon
							size={48}
							color="disabled"
						>
							heroicons-outline:office-building
						</FuseSvgIcon>
						<Typography
							color="text.secondary"
							variant="h5"
							className="mt-16"
						>
							No hospitality merchants found!
						</Typography>
						<Typography
							color="text.secondary"
							variant="body1"
							className="mt-8"
						>
							{globalFilter
								? 'Try adjusting your search terms'
								: 'Merchants with HOTELSANDAPARTMENTS plan will appear here'}
						</Typography>
					</motion.div>
				)}
			/>
		</Paper>
	);
}

export default ShopOnBookingsPropertiesTable;
