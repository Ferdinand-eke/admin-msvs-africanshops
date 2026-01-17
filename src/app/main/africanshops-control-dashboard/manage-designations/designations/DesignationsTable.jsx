/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { ListItemIcon, MenuItem, Paper, Box } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDesignationsPaginated } from 'src/app/api/designations/useDesignations';

function DesignationsTable() {
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

	// Fetch designations with pagination
	const {
		data: designationsResponse,
		isLoading,
		isError,
		isFetching
	} = useDesignationsPaginated({
		page,
		limit: rowsPerPage,
		search: debouncedSearch,
		filters: {}
	});

	// Extract designations and pagination info from response
	const designations = useMemo(() => designationsResponse?.data?.designations || [], [designationsResponse]);
	const totalCount = useMemo(() => designationsResponse?.data?.pagination?.total || 0, [designationsResponse]);
	const pagination = useMemo(() => designationsResponse?.data?.pagination, [designationsResponse]);

	// Calculate total pages based on backend pagination
	const pageCount = useMemo(() => {
		if (!pagination?.total || !rowsPerPage) return 0;
		return Math.ceil(pagination.total / rowsPerPage);
	}, [pagination, rowsPerPage]);

	// Log pagination info for debugging
	useEffect(() => {
		if (designationsResponse?.data?.pagination) {
			console.log('Designations Pagination Info:', {
				page,
				rowsPerPage,
				total: designationsResponse.data.pagination.total,
				offset: designationsResponse.data.pagination.offset,
				limit: designationsResponse.data.pagination.limit,
				hasMore: designationsResponse.data.pagination.hasMore,
				currentRecords: designationsResponse.data.designations?.length || 0
			});
		}
	}, [designationsResponse, page, rowsPerPage]);

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
				accessorKey: 'name',
				header: 'Name',
				size: 250,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/designations/list/${row?.original?.id || row?.original?._id}/${row?.original?.slug}`}
						className="underline font-medium"
						color="secondary"
						role="button"
					>
						{row?.original?.name}
					</Typography>
				)
			},
			{
				accessorKey: 'department',
				header: 'Department',
				size: 200,
				Cell: ({ row }) => (
					<Typography className="text-13">
						{row?.original?.department?.name || 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'isPublished',
				header: 'Published Status',
				size: 140,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row?.original?.isPublished ? (
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
				accessorKey: 'createdAt',
				header: 'Date Created',
				size: 140,
				Cell: ({ row }) => (
					<Typography className="text-13">
						{row?.original?.createdAt
							? new Date(row?.original?.createdAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric'
								})
							: 'N/A'}
					</Typography>
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
					Error retrieving designations!
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
						{totalCount.toLocaleString()} Designations
						{debouncedSearch && ` (filtered by "${debouncedSearch}")`}
					</Typography>
				</Box>
			)}

			<DataTable
				data={designations}
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
				renderRowActionMenuItems={({ closeMenu, row }) => {
					const designation = row.original;
					return [
						<MenuItem
							key="view"
							component={Link}
							to={`/designations/list/${designation?.id || designation?._id}/${designation?.slug}`}
							onClick={closeMenu}
						>
							<ListItemIcon>
								<FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
							</ListItemIcon>
							View Details
						</MenuItem>,
						<MenuItem
							key="edit"
							component={Link}
							to={`/designations/list/${designation?.id || designation?._id}/${designation?.slug}`}
							onClick={closeMenu}
						>
							<ListItemIcon>
								<FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
							</ListItemIcon>
							Edit
						</MenuItem>
					];
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
							No designations found!
						</Typography>
						<Typography
							color="text.secondary"
							variant="body1"
							className="mt-8"
						>
							{globalFilter
								? 'Try adjusting your search terms'
								: 'Designations will appear here once added'}
						</Typography>
					</motion.div>
				)}
			/>
		</Paper>
	);
}

export default DesignationsTable;
