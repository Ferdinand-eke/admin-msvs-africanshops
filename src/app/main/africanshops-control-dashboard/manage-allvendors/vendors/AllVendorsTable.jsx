/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, Paper, Box } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useMerchantsPaginated } from 'src/app/api/shops/useAdminShops';

function AllVendorsTable() {
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

	// Extract merchants and pagination info from response
	const merchants = useMemo(() => merchantsResponse?.data?.merchants || [], [merchantsResponse]);
	const totalCount = useMemo(() => merchantsResponse?.data?.pagination?.total || 0, [merchantsResponse]);
	const pagination = useMemo(() => merchantsResponse?.data?.pagination, [merchantsResponse]);

	// Calculate total pages based on backend pagination
	const pageCount = useMemo(() => {
		if (!pagination?.total || !rowsPerPage) return 0;
		return Math.ceil(pagination.total / rowsPerPage);
	}, [pagination, rowsPerPage]);

	// Log pagination info for debugging
	useEffect(() => {
		if (merchantsResponse?.data?.pagination) {
			console.log('Merchants Pagination Info:', {
				page,
				rowsPerPage,
				total: merchantsResponse.data.pagination.total,
				offset: merchantsResponse.data.pagination.offset,
				limit: merchantsResponse.data.pagination.limit,
				hasNextPage: merchantsResponse.data.pagination.hasNextPage,
				hasPreviousPage: merchantsResponse.data.pagination.hasPreviousPage,
				currentRecords: merchants.length || 0
			});
		}
	}, [merchantsResponse, page, rowsPerPage, merchants]);

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
		// Page reset is handled in the debounce effect
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.shopname,
				id: 'featuredImageId',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row?.original?.coverimage?.length > 0 ? (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src={row?.original?.coverimage}
								alt={row?.original?.shopname}
							/>
						) : (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row?.original?.shopname}
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'shopname',
				header: 'Shop Name',
				size: 200,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/vendors/listvendors/${row?.original?.id}/${row?.original?.slug}`}
						className="underline font-medium"
						color="secondary"
						role="button"
					>
						{row?.original?.shopname}
					</Typography>
				)
			},
			{
				accessorKey: 'shopemail',
				header: 'Email Contact',
				size: 180,
				Cell: ({ row }) => (
					<div className="flex flex-wrap">
						<Chip
							className="text-11"
							size="small"
							color="default"
							label={row?.original?.shopemail || 'N/A'}
						/>
					</div>
				)
			},
			{
				accessorKey: 'shopphone',
				header: 'Phone Contact',
				size: 150,
				Cell: ({ row }) => (
					<div className="flex flex-wrap">
						<Chip
							className="text-11"
							size="small"
							color="default"
							label={row?.original?.shopphone || 'N/A'}
						/>
					</div>
				)
			},
			{
				accessorKey: 'verified',
				header: 'Verification Status',
				size: 140,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row?.original?.verified ? (
							<FuseSvgIcon
								className="text-green"
								size={20}
							>
								heroicons-outline:check-circle
							</FuseSvgIcon>
						) : (
							<FuseSvgIcon
								className="text-red"
								size={20}
							>
								heroicons-outline:minus-circle
							</FuseSvgIcon>
						)}
					</div>
				)
			},
			{
				accessorKey: 'shopplan',
				header: 'Plan',
				size: 140,
				Cell: ({ row }) => (
					<div className="flex flex-wrap">
						<Chip
							className="text-11"
							size="small"
							color="default"
							label={row?.original?.shopplan?.plansname || 'No Plan'}
						/>
					</div>
				)
			},
			{
				accessorKey: 'compliance',
				header: 'Shop Compliance',
				size: 140,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row?.original?.isSuspended || row?.original?.isBlocked ? (
							<FuseSvgIcon
								className="text-red"
								size={20}
							>
								heroicons-outline:minus-circle
							</FuseSvgIcon>
						) : (
							<FuseSvgIcon
								className="text-green"
								size={20}
							>
								heroicons-outline:check-circle
							</FuseSvgIcon>
						)}
					</div>
				)
			}
		],
		[]
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
					Error occurred retrieving merchants!
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
			{/* Pagination Info Display */}
			{pagination && totalCount > 0 && (
				<Box className="px-24 py-12 border-b">
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, totalCount)} of{' '}
						{totalCount.toLocaleString()} Merchants
						{debouncedSearch && ` (filtered by "${debouncedSearch}")`}
					</Typography>
				</Box>
			)}

			<DataTable
				data={merchants}
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
					rowsPerPageOptions: [10, 20, 50, 100, 200],
					showFirstButton: true,
					showLastButton: true
				}}
				renderEmptyRowsFallback={() => (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { delay: 0.1 } }}
						className="flex flex-col flex-1 items-center justify-center h-full py-48"
					>
						<Typography
							color="text.secondary"
							variant="h5"
						>
							No merchants found!
						</Typography>
						<Typography
							color="text.secondary"
							variant="body1"
							className="mt-8"
						>
							{globalFilter ? 'Try adjusting your search terms' : 'Merchants will appear here once added'}
						</Typography>
					</motion.div>
				)}
			/>
		</Paper>
	);
}

export default AllVendorsTable;
