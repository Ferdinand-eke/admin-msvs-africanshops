import GlobalStyles from '@mui/material/GlobalStyles';
import { useState } from 'react';
import {
	Drawer,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Box,
	Divider
} from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	useAdminGetAllAmenities,
	useAdminCreateAmenity,
	useAdminUpdateAmenity,
	useAdminDeleteAmenity
} from 'src/app/api/admin-handle-amenities/useAdminAmenities';
import AmenitiesBookingsPropertiesHeader from './AmenitiesBookingsPropertiesHeader';
import AmenitiesOnBookingsListTable from './AmenitiesOnBookingsListTable';
import AmenityFormPanel from './AmenityFormPanel';

const DELETE_DIALOG_INITIAL = {
	open: false,
	amenityId: null,
	amenityLabel: ''
};

/**
 * The amenities management page for booking properties.
 */
function AmenitiesOnBookingsProperties() {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedAmenity, setSelectedAmenity] = useState(null);
	const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
	const [deleteDialog, setDeleteDialog] = useState(DELETE_DIALOG_INITIAL);

	// API hooks
	const { data: amenitiesData, isLoading, isError } = useAdminGetAllAmenities();
	const createAmenityMutation = useAdminCreateAmenity();
	const updateAmenityMutation = useAdminUpdateAmenity();
	const deleteAmenityMutation = useAdminDeleteAmenity();

	const amenities = amenitiesData?.data?.amenities || amenitiesData?.data || [];

	// Handle opening form for creating new amenity
	const handleAddAmenity = () => {
		setSelectedAmenity(null);
		setFormMode('create');
		setIsFormOpen(true);
	};

	// Handle opening form for editing existing amenity
	const handleEditAmenity = (amenity) => {
		setSelectedAmenity(amenity);
		setFormMode('edit');
		setIsFormOpen(true);
	};

	// Handle closing form
	const handleCloseForm = () => {
		setIsFormOpen(false);
		setSelectedAmenity(null);
	};

	// Handle creating new amenity
	const handleCreateAmenity = (amenityData) => {
		createAmenityMutation.mutate(amenityData, {
			onSuccess: () => {
				handleCloseForm();
			}
		});
	};

	// Handle updating existing amenity
	const handleUpdateAmenity = (amenityData) => {
		updateAmenityMutation.mutate(
			{ amenityId: selectedAmenity.id, ...amenityData },
			{
				onSuccess: () => {
					handleCloseForm();
				}
			}
		);
	};

	// Open delete confirmation dialog
	const handleDeleteAmenity = (amenityId) => {
		const amenity = amenities.find((a) => a.id === amenityId);
		setDeleteDialog({
			open: true,
			amenityId,
			amenityLabel: amenity?.label || 'this amenity'
		});
	};

	// Close delete confirmation dialog
	const handleCloseDeleteDialog = () => {
		if (deleteAmenityMutation.isLoading) return;
		setDeleteDialog(DELETE_DIALOG_INITIAL);
	};

	// Execute delete after confirmation
	const handleConfirmDelete = () => {
		deleteAmenityMutation.mutate(deleteDialog.amenityId, {
			onSuccess: () => {
				setDeleteDialog(DELETE_DIALOG_INITIAL);
			}
		});
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<FuseSvgIcon
					size={48}
					color="disabled"
				>
					heroicons-outline:exclamation-circle
				</FuseSvgIcon>
				<Typography
					color="text.secondary"
					variant="h5"
					className="mt-16"
				>
					Failed to load amenities
				</Typography>
				<Typography
					color="text.secondary"
					variant="body1"
					className="mt-8"
				>
					Please try refreshing the page
				</Typography>
			</motion.div>
		);
	}

	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh'
					}
				})}
			/>
			<div className="w-full h-full container flex flex-col">
				<AmenitiesBookingsPropertiesHeader
					totalAmenities={amenities.length}
					activeAmenities={amenities.filter((a) => a.isActive).length}
					onAddAmenity={handleAddAmenity}
				/>

				<AmenitiesOnBookingsListTable
					amenities={amenities}
					onEditAmenity={handleEditAmenity}
					onDeleteAmenity={handleDeleteAmenity}
				/>
			</div>

			{/* Sliding Form Panel */}
			<Drawer
				anchor="right"
				open={isFormOpen}
				onClose={handleCloseForm}
				PaperProps={{
					sx: { width: { xs: '100%', sm: 500 } }
				}}
			>
				<AmenityFormPanel
					mode={formMode}
					amenity={selectedAmenity}
					onClose={handleCloseForm}
					onCreate={handleCreateAmenity}
					onUpdate={handleUpdateAmenity}
					isSubmitting={createAmenityMutation.isLoading || updateAmenityMutation.isLoading}
				/>
			</Drawer>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteDialog.open}
				onClose={handleCloseDeleteDialog}
				maxWidth="xs"
				fullWidth
				PaperProps={{ className: 'rounded-16' }}
			>
				<DialogTitle className="pb-0">
					<Box className="flex items-center gap-12">
						<Box
							className="flex items-center justify-center w-40 h-40 rounded-full flex-shrink-0"
							sx={{ bgcolor: 'error.lighter' }}
						>
							<FuseSvgIcon
								size={22}
								color="error"
							>
								heroicons-outline:trash
							</FuseSvgIcon>
						</Box>
						<Typography
							variant="h6"
							className="font-bold"
						>
							Delete Amenity
						</Typography>
					</Box>
				</DialogTitle>

				<Divider className="mt-16" />

				<DialogContent className="pt-20">
					<DialogContentText>
						You are about to permanently delete{' '}
						<Typography
							component="span"
							className="font-semibold"
							color="text.primary"
						>
							&quot;{deleteDialog.amenityLabel}&quot;
						</Typography>
						. This amenity will be removed from all properties it is currently assigned to.
					</DialogContentText>
					<Box
						className="flex items-start gap-8 mt-16 p-12 rounded-8"
						sx={{ bgcolor: 'error.lighter' }}
					>
						<FuseSvgIcon
							size={16}
							color="error"
							className="mt-2 flex-shrink-0"
						>
							heroicons-outline:exclamation-circle
						</FuseSvgIcon>
						<Typography
							variant="caption"
							color="error.dark"
						>
							This action is permanent and cannot be undone.
						</Typography>
					</Box>
				</DialogContent>

				<DialogActions className="px-24 pb-20 gap-8">
					<Button
						onClick={handleCloseDeleteDialog}
						variant="outlined"
						disabled={deleteAmenityMutation.isLoading}
						className="flex-1"
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmDelete}
						variant="contained"
						color="error"
						disabled={deleteAmenityMutation.isLoading}
						className="flex-1"
						startIcon={
							deleteAmenityMutation.isLoading ? null : (
								<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
							)
						}
					>
						{deleteAmenityMutation.isLoading ? 'Deleting...' : 'Delete Amenity'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default AmenitiesOnBookingsProperties;
