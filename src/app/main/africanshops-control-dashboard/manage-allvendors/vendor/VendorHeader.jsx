import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAdminCreateVendorShop, useAdminUpdateVendorShop, useDeleteShop } from 'src/app/api/shops/useAdminShops';
import { firebaseApp } from 'src/app/auth/services/firebase/initializeFirebase';
import {
	getStorage,
	ref,
	deleteObject,
	uploadBytesResumable,
	uploadString,
	getDownloadURL,
  } from "firebase/storage";
import { toast } from 'react-toastify';
import ProductModel from './models/ProductModel';

/**
 * The product header.
 */
function VendorHeader() {
	const routeParams = useParams();
	const { productId } = routeParams;
	const methods = useFormContext();
	const { formState, watch, getValues, setValue } = methods;
	const { isValid, dirtyFields } = formState;
	const theme = useTheme();
	const navigate = useNavigate();
	const {shopname, name, images, featuredImageId } = watch();

	const newShopProfile = useAdminCreateVendorShop();
	const updateShopProfile = useAdminUpdateVendorShop();
	const deleteShopProfile = useDeleteShop()

	function handleSaveProduct() {

		if (images?.length > 0) {
			const fileName = new Date().getTime() + images[0]?.id;
			const storage = getStorage(firebaseApp);
			const storageRef = ref(storage, `/shopbanners/${fileName}`);
			const uploadTask = uploadString(storageRef, images[0]?.url, "data_url");
			const desertRef = ref(storage, `${getValues()?.coverimage}`);
	  
			// Delete the file
			if (getValues()?.coverimage) {
			  deleteObject(desertRef)
				.then(() => {
				  uploadTask.then((snapshot) => {
					getDownloadURL(snapshot.ref).then((downloadURL) => {
					  setValue("coverimage", downloadURL);
					  updateShopProfile.mutate(getValues());
					});
				  });
				})
				.catch((error) => {
				  // Uh-oh, an error occurred!
				  console.log(error);
				  toast.error(
					error.response && error.response.data.message
					  ? error.response.data.message
					  : error.message
				  );
				});
			} else {
			  uploadTask.then((snapshot) => {
				// console.log("uploadSnaps11", snapshot);
				getDownloadURL(snapshot.ref).then((downloadURL) => {
				//   console.log("countryFlag22", downloadURL);
	  
				  setValue("coverimage", downloadURL);
				  updateShopProfile.mutate(getValues());
				});
			  });
			}
		  } else {
			updateShopProfile.mutate(getValues());
		  }
		// console.log("ShopValuesToSave", getValues())
		// saveProduct(getValues());
	}


	function handleCreateProduct() {
		if (images?.length > 0) {
			const fileName = new Date().getTime() + images[0]?.id;
			const storage = getStorage(firebaseApp);
			const storageRef = ref(storage, `/shopbanners/${fileName}`);
			const uploadTask = uploadString(storageRef, images[0]?.url, "data_url");
	  
			uploadTask.then((snapshot) => {
			  getDownloadURL(snapshot.ref).then((downloadURL) => {
	  
				setValue("coverimage", downloadURL);
				newShopProfile.mutate(getValues());
			  });
			});
		  } else {
			newShopProfile.mutate(getValues());
			// reset(ProductModel({}));
		  }
	
	}

	function handleRemoveProduct() {
		if (window.confirm("Comfirm delete of this merchant account?")) {
			const storage = getStorage(firebaseApp);
			const desertRef = ref(storage, `${getValues()?.coverimage}`);
			if (getValues()?.coverimage) {
			  deleteObject(desertRef)
				.then(() => {
					deleteShopProfile.mutate(productId);
				})
				.catch((error) => {
				  // Uh-oh, an error occurred!
				  console.log(error);
				  toast.error(
					`image delete error: ${
					  error.response && error.response.data.message
						? error.response.data.message
						: error.message
					}`
				  );
				});
			} else {
				deleteShopProfile.mutate(productId);
			}
		  }
		// removeProduct(productId); deleteShopProfile
		// navigate('/vendors/listvendors');
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
						to="/vendors/listvendors"
						color="inherit"
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">Shop Vendors</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						{images && images.length > 0 && featuredImageId ? (
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
							{shopname || 'New Product'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							Vendor Detail
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
						>
							Remove
						</Button>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							disabled={_.isEmpty(dirtyFields) || !isValid || updateShopProfile?.isLoading}
							onClick={handleSaveProduct}
						>
							Save
						</Button>
					</>
				) : (
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						onClick={handleCreateProduct}
					>
						Add
					</Button>
				)}
			</motion.div>
		</div>
	);
}

export default VendorHeader;
