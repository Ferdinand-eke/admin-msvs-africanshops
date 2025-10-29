/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Avatar, Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
	useAdminStaffBlockMutation,
	useAdminStaffUnBlockMutation,
	useAdminStaffSuspenMutation,
	useAdminStaffUnSuspednMutation,
	useAdminStaffMakeLeaderMutation,
	useAdminStaffUnMakeLeaderMutation,
	useDeleteAdminStaffMutation
} from 'src/app/api/admin-users/useAdmins';

/**
 * The admin staff table.
 */
function StaffUsersList(props) {
	const {
		usersData,
		usersIsLoading,
		totalCount,
		page,
		rowsPerPage,
		onPageChange,
		onRowsPerPageChange
	} = props;

	// Mutations
	const blockMutation = useAdminStaffBlockMutation();
	const unblockMutation = useAdminStaffUnBlockMutation();
	const suspendMutation = useAdminStaffSuspenMutation();
	const unsuspendMutation = useAdminStaffUnSuspednMutation();
	const makeLeaderMutation = useAdminStaffMakeLeaderMutation();
	const unmakeLeaderMutation = useAdminStaffUnMakeLeaderMutation();
	const deleteMutation = useDeleteAdminStaffMutation();

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.avatar,
				id: 'avatar',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						<Avatar
							alt={row.original?.name}
							src={row.original?.avatar}
							className="w-40 h-40"
						/>
					</div>
				)
			},
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/users/admin/${row.original?.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original?.name}
					</Typography>
				)
			},
			{
				accessorKey: 'email',
				header: 'Email',
				Cell: ({ row }) => (
					<Typography className="text-13">
						{row.original?.email}
					</Typography>
				)
			},
			{
				accessorKey: 'role',
				header: 'Role',
				Cell: ({ row }) => (
					<Chip
						label={row.original?.role || 'Staff'}
						size="small"
						color="default"
						className="font-medium"
					/>
				)
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				Cell: ({ row }) => (
					<Typography className="text-13">
						{row.original?.phone || 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'department',
				header: 'Department',
				Cell: ({ row }) => (
					<Typography className="text-13">
						{row.original?.department?.name || 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'designation',
				header: 'Designation',
				Cell: ({ row }) => (
					<Typography className="text-13">
						{row.original?.designation?.name || 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'isCeo',
				header: 'Leadership',
				Cell: ({ row }) => (
					<div className="flex items-center">
						{row.original?.isCeo ? (
							<Chip
								icon={<FuseSvgIcon size={16}>heroicons-outline:star</FuseSvgIcon>}
								label="Leader"
								size="small"
								color="success"
								variant="outlined"
							/>
						) : (
							<Chip
								label="Staff"
								size="small"
								color="default"
								variant="outlined"
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'isBlocked',
				header: 'Status',
				Cell: ({ row }) => {
					const { isBlocked, isSuspended } = row.original;
					if (isBlocked) {
						return (
							<Chip
								label="Blocked"
								size="small"
								color="error"
								icon={<FuseSvgIcon size={16}>heroicons-outline:ban</FuseSvgIcon>}
							/>
						);
					}
					if (isSuspended) {
						return (
							<Chip
								label="Suspended"
								size="small"
								color="warning"
								icon={<FuseSvgIcon size={16}>heroicons-outline:pause</FuseSvgIcon>}
							/>
						);
					}
					return (
						<Chip
							label="Active"
							size="small"
							color="success"
							icon={<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>}
						/>
					);
				}
			}
		],
		[]
	);

	if (usersIsLoading) {
		return <FuseLoading />;
	}

	if (!usersData || usersData.length === 0) {
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
					There are no admin staff members!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/users/admin/new/create"
					color="secondary"
				>
					<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
					<span className="mx-8">Add Admin Staff</span>
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
				data={usersData}
				columns={columns}
				manualPagination
				rowCount={totalCount}
				onPaginationChange={(updater) => {
					const newPagination = typeof updater === 'function'
						? updater({ pageIndex: page, pageSize: rowsPerPage })
						: updater;

					if (newPagination.pageIndex !== page) {
						onPageChange(null, newPagination.pageIndex);
					}
					if (newPagination.pageSize !== rowsPerPage) {
						onRowsPerPageChange(newPagination.pageSize);
					}
				}}
				state={{
					pagination: {
						pageIndex: page,
						pageSize: rowsPerPage
					}
				}}
				renderRowActionMenuItems={({ closeMenu, row, table }) => {
					const admin = row.original;
					const menuItems = [];

					// View Details
					menuItems.push(
						<MenuItem
							key="view"
							component={Link}
							to={`/users/admin/${admin.id}`}
							onClick={closeMenu}
						>
							<ListItemIcon>
								<FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
							</ListItemIcon>
							View Details
						</MenuItem>
					);

					// Edit
					menuItems.push(
						<MenuItem
							key="edit"
							component={Link}
							to={`/users/admin/${admin.id}`}
							onClick={closeMenu}
						>
							<ListItemIcon>
								<FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
							</ListItemIcon>
							Edit
						</MenuItem>
					);

					// Leadership Actions
					if (admin.isCeo) {
						menuItems.push(
							<MenuItem
								key="remove-leader"
								onClick={() => {
									unmakeLeaderMutation.mutate(admin.id);
									closeMenu();
								}}
							>
								<ListItemIcon>
									<FuseSvgIcon>heroicons-outline:x-circle</FuseSvgIcon>
								</ListItemIcon>
								Remove Leadership
							</MenuItem>
						);
					} else {
						menuItems.push(
							<MenuItem
								key="make-leader"
								onClick={() => {
									makeLeaderMutation.mutate(admin.id);
									closeMenu();
								}}
							>
								<ListItemIcon>
									<FuseSvgIcon>heroicons-outline:star</FuseSvgIcon>
								</ListItemIcon>
								Make Leader
							</MenuItem>
						);
					}

					// Block/Unblock Actions
					if (admin.isBlocked) {
						menuItems.push(
							<MenuItem
								key="unblock"
								onClick={() => {
									unblockMutation.mutate(admin.id);
									closeMenu();
								}}
							>
								<ListItemIcon>
									<FuseSvgIcon className="text-green">heroicons-outline:lock-open</FuseSvgIcon>
								</ListItemIcon>
								Unblock Staff
							</MenuItem>
						);
					} else {
						menuItems.push(
							<MenuItem
								key="block"
								onClick={() => {
									blockMutation.mutate(admin.id);
									closeMenu();
								}}
							>
								<ListItemIcon>
									<FuseSvgIcon className="text-red">heroicons-outline:ban</FuseSvgIcon>
								</ListItemIcon>
								Block Staff
							</MenuItem>
						);
					}

					// Suspend/Unsuspend Actions
					if (admin.isSuspended) {
						menuItems.push(
							<MenuItem
								key="unsuspend"
								onClick={() => {
									unsuspendMutation.mutate(admin.id);
									closeMenu();
								}}
							>
								<ListItemIcon>
									<FuseSvgIcon className="text-green">heroicons-outline:play</FuseSvgIcon>
								</ListItemIcon>
								Lift Suspension
							</MenuItem>
						);
					} else {
						menuItems.push(
							<MenuItem
								key="suspend"
								onClick={() => {
									suspendMutation.mutate(admin.id);
									closeMenu();
								}}
							>
								<ListItemIcon>
									<FuseSvgIcon className="text-orange">heroicons-outline:pause</FuseSvgIcon>
								</ListItemIcon>
								Suspend Staff
							</MenuItem>
						);
					}

					// Delete
					menuItems.push(
						<MenuItem
							key="delete"
							onClick={() => {
								if (window.confirm(`Are you sure you want to delete ${admin.name}?`)) {
									deleteMutation.mutate(admin.id);
									closeMenu();
									table.resetRowSelection();
								}
							}}
						>
							<ListItemIcon>
								<FuseSvgIcon className="text-red">heroicons-outline:trash</FuseSvgIcon>
							</ListItemIcon>
							Delete
						</MenuItem>
					);

					return menuItems;
				}}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows = table.getSelectedRowModel().rows;
								if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected staff member(s)?`)) {
									selectedRows.forEach((row) => {
										deleteMutation.mutate(row.original.id);
									});
									table.resetRowSelection();
								}
							}}
							className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8"
							color="secondary"
						>
							<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
							<span className="hidden sm:flex mx-8">Delete selected items</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

export default StaffUsersList;
