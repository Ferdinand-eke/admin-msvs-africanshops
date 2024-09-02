/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import { useDeleteECommerceProductsMutation, useGetECommerceProductsQuery } from '../ECommerceApi';
import useStates from 'src/app/api/states/useStates';
import { motion } from 'framer-motion';
import useDesignations from 'src/app/api/designations/useDesignations';
import useProductCats from 'src/app/api/product-categories/useProductCategories';
import usePostCats from 'src/app/api/post-category/usePostCats';
import useAdminPosts from 'src/app/api/posts/usePosts';

function PostsTable() {
	
	// const { data: products, isLoading } = useGetECommerceProductsQuery();
	const [removeProducts] = useDeleteECommerceProductsMutation();

	// const { data:states, isLoading, refetch, isError  } = useStates();
	// const { data:designations, isLoading, isError, refetch } = useDesignations();
	const { data:posts, isLoading, refetch, isError } = useAdminPosts();

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row?.featuredImageId,
				id: 'featuredImageId',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row?.original?.featuredImage ? (
							<img
								className="w-full max-h-60 max-w-60 block rounded"
								src={row?.original?.featuredImage}
								alt={row?.original?.name}
							/>
						) : (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row?.original?.name}
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'title',
				header: 'Title',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/posts/list/${row?.original?._id}/${row?.original?.slug}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row?.original?.title}
					</Typography>
				)
			},
			{
				accessorKey: 'isPublished',
				header: 'Published Status',
				accessorFn: (row) => (
					<div className="flex items-center">
						{row?.isPublished ? (
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
			}
		],
		[]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	// console.log("Getting State error", isError)

	if (isError ) {
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
				Error retrieving posts!
				</Typography>
				
			</motion.div>
		);
	}

if (!posts?.data?.data) {
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
				No posts found!
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
				data={posts?.data?.data}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							removeProducts([row?.original?.id]);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
						</ListItemIcon>
						Delete
					</MenuItem>
				]}
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
								removeProducts(selectedRows.map((row) => row?.original?.id));
								table.resetRowSelection();
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

export default PostsTable;
