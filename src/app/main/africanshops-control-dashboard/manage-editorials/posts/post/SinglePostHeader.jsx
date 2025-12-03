import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAddPostMutation, useDeletePost, usePostUpdateMutation } from 'src/app/api/posts/usePosts';
// import {
// 	useCreateECommerceProductMutation,
// 	useDeleteECommerceProductMutation,
// 	useUpdateECommerceProductMutation
// } from '../ECommerceApi';
import { firebaseApp } from 'src/app/auth/services/firebase/initializeFirebase';
import { getStorage, ref, deleteObject, uploadString, getDownloadURL } from 'firebase/storage';

/**
 * The product header.
 */
function SinglePostHeader() {
	const routeParams = useParams();
	const { productId } = routeParams;
	// const [addPostLoading, setAddPostLoading] = useState(false)
	// const [updatePostLoading, setUpdatePostLoading] = useState(false)
	// const [createProduct] = useCreateECommerceProductMutation();
	// const [saveProduct] = useUpdateECommerceProductMutation();
	// const [removeProduct] = useDeleteECommerceProductMutation();
	const methods = useFormContext();
	const { formState, watch, getValues, setValue } = methods;
	const { isValid, dirtyFields } = formState;
	const theme = useTheme();
	const navigate = useNavigate();
	const { title, name, images, featuredImageId } = watch();

	const addNewsPost = useAddPostMutation();
	const updateNewsPost = usePostUpdateMutation();
	const deleteNewsPost = useDeletePost();

	function handleSaveProduct() {
		console.log('Save PostValues', getValues());

		if (images?.length > 0) {
			// setUpdatePostLoading(true)
			const fileName = new Date().getTime() + images[0]?.id;
			const storage = getStorage(firebaseApp);
			const storageRef = ref(storage, `/posts/${fileName}`);
			//   const uploadTask = uploadBytesResumable(storageRef, images[0]?.url, 'base64');
			const uploadTask = uploadString(storageRef, images[0]?.url, 'data_url');
			const desertRef = ref(storage, `${getValues()?.featuredImage}`);

			// Delete the file
			if (getValues()?.featuredImage) {
				deleteObject(desertRef)
					.then(() => {
						uploadTask.then((snapshot) => {
							getDownloadURL(snapshot.ref).then((downloadURL) => {
								setValue('featuredImage', downloadURL);
								updateNewsPost?.mutate(getValues());
								//   setUpdatePostLoading(false)
							});
						});
					})
					.catch((error) => {
						// Uh-oh, an error occurred!
						console.log(error);
						toast.error(
							error.response && error.response.data.message ? error.response.data.message : error.message
						);
					});
			} else {
				uploadTask.then((snapshot) => {
					getDownloadURL(snapshot.ref).then((downloadURL) => {
						setValue('featuredImage', downloadURL);
						updateNewsPost?.mutate(getValues());
						//   setUpdatePostLoading(false)
					});
				});
			}
		} else {
			updateNewsPost?.mutate(getValues());
		}
	}

	function handleCreateProduct() {
		console.log('PostValues', getValues());

		// setAddPostLoading(true)
		if (images?.length > 0) {
			const fileName = new Date().getTime() + images[0]?.id;
			const storage = getStorage(firebaseApp);
			const storageRef = ref(storage, `/posts/${fileName}`);
			//   const uploadTask = uploadBytesResumable(storageRef, images[0]?.url);
			const uploadTask = uploadString(storageRef, images[0]?.url, 'data_url');

			uploadTask.then((snapshot) => {
				getDownloadURL(snapshot.ref).then((downloadURL) => {
					setValue('featuredImage', downloadURL);
					addNewsPost?.mutate(getValues());
					// setAddPostLoading(false)
				});
			});
		} else {
			addNewsPost?.mutate(getValues());
			reset(ProductModel({}));
		}
	}

	function handleRemovePost() {
		if (window.confirm('Comfirm delete of this blog post?')) {
			// removeProduct(productId);
			// deleteCountry.mutate(productId)
			const storage = getStorage(firebaseApp);
			const desertRef = ref(storage, `${getValues()?.featuredImage}`);

			if (getValues()?.featuredImage) {
				deleteObject(desertRef)
					.then(() => {
						deleteNewsPost.mutate(productId);
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
				deleteNewsPost.mutate(productId);
			}
		}
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
						to="/posts/list"
						color="inherit"
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">Posts</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					{/* <motion.div
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
					</motion.div> */}
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{title || 'New Post'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							Post Detail
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
							onClick={handleRemovePost}
							startIcon={<FuseSvgIcon className="hidden sm:flex">heroicons-outline:trash</FuseSvgIcon>}
							disabled={deleteNewsPost?.isLoading}
						>
							Remove
						</Button>

						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							disabled={_.isEmpty(dirtyFields) || !isValid || updateNewsPost?.isLoading}
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
						disabled={_.isEmpty(dirtyFields) || !isValid || addNewsPost?.isLoading}
						onClick={handleCreateProduct}
					>
						Add Post
					</Button>
				)}
			</motion.div>
		</div>
	);
}

export default SinglePostHeader;
