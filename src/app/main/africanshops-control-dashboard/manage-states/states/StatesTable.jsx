/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useStatesPaginated } from 'src/app/api/states/useStates';

function StatesTable() {
	// Pagination state
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [globalFilter, setGlobalFilter] = useState('');

	// Fetch states with pagination
	const {
		data: statesResponse,
		isLoading,
		isError,
		isFetching
	} = useStatesPaginated({
		page,
		limit: rowsPerPage,
		search: globalFilter,
		filters: {}
	});

	// Extract states and pagination info from response
	const states = useMemo(() => statesResponse?.data?.states || [], [statesResponse]);
	const totalCount = useMemo(
		() => statesResponse?.data?.pagination?.total || states.length,
		[statesResponse, states.length]
	);
	const pagination = useMemo(() => statesResponse?.data?.pagination, [statesResponse]);

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
		setPage(0);
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				size: 200,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/administrations/states/${row.original?.id}/${row.original?.slug}`}
						className="underline font-medium"
						color="secondary"
						role="button"
					>
						{row.original?.name}
					</Typography>
				)
			},
			{
				accessorKey: 'country',
				header: 'Country',
				size: 180,
				Cell: ({ row }) => <Typography className="text-13">{row.original?.country?.name || 'N/A'}</Typography>
			},
			{
				accessorKey: 'isInOperation',
				header: 'Operational Status',
				size: 140,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original?.isInOperation ? (
							<Chip
								label="Operational"
								size="small"
								color="success"
								icon={<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>}
							/>
						) : (
							<Chip
								label="Inactive"
								size="small"
								color="default"
								icon={<FuseSvgIcon size={16}>heroicons-outline:minus-circle</FuseSvgIcon>}
							/>
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
					Error retrieving states!
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
			<DataTable
				data={states}
				columns={columns}
				manualPagination
				rowCount={totalCount}
				pageCount={pagination?.totalPages || Math.ceil(totalCount / rowsPerPage)}
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
				renderRowActionMenuItems={({ closeMenu, row }) => {
					const state = row.original;
					return [
						<MenuItem
							key="view"
							component={Link}
							to={`/administrations/states/${state.id}/${state.slug}`}
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
							to={`/administrations/states/${state.id}/${state.slug}`}
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
							No states found!
						</Typography>
						<Typography
							color="text.secondary"
							variant="body1"
							className="mt-8"
						>
							{globalFilter ? 'Try adjusting your search terms' : 'States will appear here once added'}
						</Typography>
					</motion.div>
				)}
			/>
		</Paper>
	);
}

export default StatesTable;
