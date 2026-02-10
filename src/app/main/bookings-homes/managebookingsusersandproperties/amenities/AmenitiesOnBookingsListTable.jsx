/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import { Chip, Paper, IconButton, Tooltip, Avatar } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import Icon from '@mui/material/Icon';

function AmenitiesOnBookingsListTable(props) {
	const { amenities, onEditAmenity, onDeleteAmenity } = props;

	const columns = useMemo(
		() => [
			{
				accessorKey: 'icon',
				header: '',
				size: 80,
				enableSorting: false,
				Cell: ({ row }) => (
					<Avatar
						className="w-48 h-48 bg-blue-100"
						sx={{ color: 'primary.main' }}
					>
						<Icon>{row.original.icon}</Icon>
					</Avatar>
				)
			},
			{
				accessorKey: 'label',
				header: 'Amenity Name',
				size: 200,
				Cell: ({ row }) => (
					<div className="flex flex-col">
						<Typography
							variant="body2"
							className="font-semibold"
						>
							{row.original.label}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
							className="mt-4"
						>
							ID: {row.original.id}
						</Typography>
					</div>
				)
			},
			{
				accessorKey: 'description',
				header: 'Description',
				size: 300,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						color="text.secondary"
						className="line-clamp-2"
					>
						{row.original.description}
					</Typography>
				)
			},
			{
				accessorKey: 'category',
				header: 'Category',
				size: 180,
				Cell: ({ row }) => (
					<Chip
						label={row.original.category}
						size="small"
						color="primary"
						variant="outlined"
						className="font-medium"
					/>
				)
			},
			{
				accessorKey: 'isActive',
				header: 'Status',
				size: 120,
				Cell: ({ row }) => (
					<Chip
						label={row.original.isActive ? 'Active' : 'Inactive'}
						size="small"
						color={row.original.isActive ? 'success' : 'default'}
						className="font-semibold"
						icon={
							<FuseSvgIcon size={14}>
								{row.original.isActive ? 'heroicons-outline:check-circle' : 'heroicons-outline:x-circle'}
							</FuseSvgIcon>
						}
					/>
				)
			},
			{
				accessorKey: 'createdAt',
				header: 'Created Date',
				size: 140,
				Cell: ({ row }) => (
					<Typography
						variant="caption"
						color="text.secondary"
					>
						{format(row.original.createdAt, 'MMM dd, yyyy')}
					</Typography>
				)
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				size: 120,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center gap-8">
						<Tooltip title="Edit Amenity">
							<IconButton
								size="small"
								onClick={() => onEditAmenity(row.original)}
								className="hover:bg-blue-50"
							>
								<FuseSvgIcon
									size={18}
									className="text-blue-600"
								>
									heroicons-outline:pencil
								</FuseSvgIcon>
							</IconButton>
						</Tooltip>

						<Tooltip title="Delete Amenity">
							<IconButton
								size="small"
								onClick={() => onDeleteAmenity(row.original.id)}
								className="hover:bg-red-50"
							>
								<FuseSvgIcon
									size={18}
									className="text-red-600"
								>
									heroicons-outline:trash
								</FuseSvgIcon>
							</IconButton>
						</Tooltip>
					</div>
				)
			}
		],
		[onEditAmenity, onDeleteAmenity]
	);

	if (!amenities || amenities.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full py-48"
			>
				<FuseSvgIcon
					size={64}
					color="disabled"
				>
					heroicons-outline:sparkles
				</FuseSvgIcon>
				<Typography
					color="text.secondary"
					variant="h5"
					className="mt-16"
				>
					No amenities found!
				</Typography>
				<Typography
					color="text.secondary"
					variant="body1"
					className="mt-8"
				>
					Click the &quot;Add Amenity&quot; button to create your first amenity
				</Typography>
			</motion.div>
		);
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			<DataTable
				data={amenities}
				columns={columns}
				initialState={{
					density: 'comfortable',
					showGlobalFilter: true,
					showColumnFilters: false,
					sorting: [{ id: 'createdAt', desc: true }],
					pagination: {
						pageIndex: 0,
						pageSize: 10
					}
				}}
				muiPaginationProps={{
					rowsPerPageOptions: [10, 25, 50],
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
							heroicons-outline:search
						</FuseSvgIcon>
						<Typography
							color="text.secondary"
							variant="h6"
							className="mt-16"
						>
							No matching amenities found!
						</Typography>
						<Typography
							color="text.secondary"
							variant="body2"
							className="mt-8"
						>
							Try adjusting your search or filters
						</Typography>
					</motion.div>
				)}
			/>
		</Paper>
	);
}

export default AmenitiesOnBookingsListTable;
