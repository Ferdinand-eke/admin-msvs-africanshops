import { useState } from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Alert,
	AlertTitle
} from '@mui/material';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	useAddDeptMutation,
	useDeleteSingleDepartment,
	useUpdateDepartmentMutation
} from 'src/app/api/departments/useDepartments';

/**
 * The product header.
 */
function DepartmentHeader() {
	const routeParams = useParams();
	const { productId } = routeParams;
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;
	const theme = useTheme();
	const navigate = useNavigate();
	const { name, images, featuredImageId } = watch();

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const updateDepartments = useUpdateDepartmentMutation();
	const addNewDepts = useAddDeptMutation();
	const deleteDepartment = useDeleteSingleDepartment();

	function handleSaveProduct() {
		updateDepartments.mutate(getValues());
	}

	function handleCreateProduct() {
		addNewDepts.mutate(getValues());
	}

	function handleRemoveProduct() {
		setDeleteDialogOpen(true);
	}

	function handleConfirmDelete() {
		deleteDepartment.mutate(productId);
		setDeleteDialogOpen(false);
	}

	function handleCancelDelete() {
		setDeleteDialogOpen(false);
	}

	return (
		<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
			<div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/departments/list"
						color="inherit"
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">Departments</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						{images && images?.length > 0 && featuredImageId ? (
							<img
								className="w-32 sm:w-48 rounded"
								src={_.find(images, { id: featuredImageId })?.url}
								alt={name}
							/>
						) : (
							<img
								className="w-32 sm:w-48 rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={name}
							/>
						)}
					</motion.div>
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{name || 'New Product'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							Department Detail
						</Typography>
					</motion.div>
				</div>
			</div>
			<motion.div
				className="flex flex-1 w-full"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				{productId !== 'new' ? (
					<>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							onClick={handleRemoveProduct}
							startIcon={<FuseSvgIcon className="hidden sm:flex">heroicons-outline:trash</FuseSvgIcon>}
							disabled={deleteDepartment?.isLoading}
						>
							Remove Department
						</Button>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							disabled={_.isEmpty(dirtyFields) || !isValid || updateDepartments?.isLoading}
							onClick={handleSaveProduct}
						>
							Save Department
						</Button>
					</>
				) : (
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid || addNewDepts?.isLoading}
						onClick={handleCreateProduct}
					>
						Add Department
					</Button>
				)}
			</motion.div>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteDialogOpen}
				onClose={handleCancelDelete}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					elevation: 3
				}}
			>
				<DialogTitle className="flex items-center gap-8">
					<FuseSvgIcon
						className="text-red-600"
						size={24}
					>
						heroicons-outline:exclamation-triangle
					</FuseSvgIcon>
					Confirm Department Deletion
				</DialogTitle>
				<DialogContent>
					<Alert
						severity="warning"
						className="mb-16"
					>
						<AlertTitle>Warning: This action cannot be undone</AlertTitle>
						Deleting this department will permanently remove it from the system.
					</Alert>
					<DialogContentText className="mb-16">
						Are you sure you want to delete the department{' '}
						<strong className="text-gray-900 dark:text-gray-100">&quot;{name}&quot;</strong>?
					</DialogContentText>
					<DialogContentText className="text-sm">
						This action will:
					</DialogContentText>
					<ul className="list-disc list-inside mt-8 space-y-4 text-sm text-gray-600 dark:text-gray-400">
						<li>Permanently remove this department from the database</li>
						<li>Remove all associated data and relationships</li>
						<li>This change cannot be reversed</li>
					</ul>
				</DialogContent>
				<DialogActions className="px-24 pb-16">
					<Button
						onClick={handleCancelDelete}
						color="primary"
						variant="outlined"
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmDelete}
						color="error"
						variant="contained"
						disabled={deleteDepartment?.isLoading}
						startIcon={
							deleteDepartment?.isLoading ? null : (
								<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
							)
						}
					>
						{deleteDepartment?.isLoading ? 'Deleting...' : 'Delete Department'}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default DepartmentHeader;
