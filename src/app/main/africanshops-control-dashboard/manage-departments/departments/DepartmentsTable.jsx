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
import { useDepartmentsPaginated } from 'src/app/api/departments/useDepartments';

function DepartmentsTable() {
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

	// Fetch departments with pagination
	const {
		data: departmentsResponse,
		isLoading,
		isError,
		isFetching
	} = useDepartmentsPaginated({
		page,
		limit: rowsPerPage,
		search: debouncedSearch,
		filters: {}
	});

	// Extract departments and pagination info from response
	const departments = useMemo(() => departmentsResponse?.data?.departments || [], [departmentsResponse]);
	const totalCount = useMemo(() => departmentsResponse?.data?.pagination?.total || 0, [departmentsResponse]);
	const pagination = useMemo(() => departmentsResponse?.data?.pagination, [departmentsResponse]);

	// Calculate total pages based on backend pagination
	const pageCount = useMemo(() => {
		if (!pagination?.total || !rowsPerPage) return 0;
		return Math.ceil(pagination.total / rowsPerPage);
	}, [pagination, rowsPerPage]);

	// Log pagination info for debugging
	useEffect(() => {
		if (departmentsResponse?.data?.pagination) {
			console.log('Departments Pagination Info:', {
				page,
				rowsPerPage,
				total: departmentsResponse.data.pagination.total,
				offset: departmentsResponse.data.pagination.offset,
				limit: departmentsResponse.data.pagination.limit,
				hasMore: departmentsResponse.data.pagination.hasMore,
				currentRecords: departmentsResponse.data.departments?.length || 0
			});
		}
	}, [departmentsResponse, page, rowsPerPage]);

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
						to={`/departments/list/${row.original.id || row.original._id}/${row.original.slug}`}
						className="underline font-medium"
						color="secondary"
						role="button"
					>
						{row.original.name}
					</Typography>
				)
			},
			{
				accessorKey: 'isPublished',
				header: 'Published Status',
				size: 140,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original?.isPublished ? (
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
						{row.original?.createdAt
							? new Date(row.original.createdAt).toLocaleDateString('en-US', {
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
					Error retrieving departments!
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
						{totalCount.toLocaleString()} Departments
						{debouncedSearch && ` (filtered by "${debouncedSearch}")`}
					</Typography>
				</Box>
			)}

			<DataTable
				data={departments}
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
					const department = row.original;
					return [
						<MenuItem
							key="view"
							component={Link}
							to={`/departments/list/${department.id || department._id}/${department.slug}`}
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
							to={`/departments/list/${department.id || department._id}/${department.slug}`}
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
							No departments found!
						</Typography>
						<Typography
							color="text.secondary"
							variant="body1"
							className="mt-8"
						>
							{globalFilter
								? 'Try adjusting your search terms'
								: 'Departments will appear here once added'}
						</Typography>
					</motion.div>
				)}
			/>
		</Paper>
	);
}

export default DepartmentsTable;
