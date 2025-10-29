import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SingleDesignationHeader from './SingleProductCategoryHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import ProductImagesTab from './tabs/ProductImagesTab';
import ProductModel from './models/ProductModel';
import { useSingleProductCat } from 'src/app/api/product-categories/useProductCategories';
/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a product name').min(5, 'The product name must be at least 5 characters')
});


/**
 * The product page.
 */
function ProductCategory() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;


	const {data:productcat,
		isLoading,
		isError
	} = useSingleProductCat(productId, {
		skip: !productId || productId === 'new'
	})
	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: zodResolver(schema)
	});
	const { reset, watch } = methods;
	const form = watch();
	useEffect(() => {
		if (productId === 'new') {
			reset(ProductModel({}));
		}
	}, [productId, reset]);
	useEffect(() => {
		if (productcat?.data?.category) {
			reset({ ...productcat?.data?.category });
		}
	}, [productcat?.data?.category, reset]);


	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	/*** Show Message if the requested products is not exists*/
	if (isError && productId !== 'new') {
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
				{isError && 'An error occured while retrieving this product!'}	
				</Typography>
				{/* <Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/designations/list"
					color="inherit"
				>
					Go to Designations Page
				</Button> */}
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (_.isEmpty(form) || (productcat?.data?.category && routeParams.productId !== productcat?.data?.category?.id && routeParams.productId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<SingleDesignationHeader />}
				content={
					<>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							indicatorColor="secondary"
							textColor="secondary"
							variant="scrollable"
							scrollButtons="auto"
							classes={{ root: 'w-full h-64 border-b-1' }}
						>
							<Tab
								className="h-64"
								label="Basic Info"
							/>
							<Tab
								className="h-64"
								label="Category Image"
							/>
						</Tabs>
						<div className="p-16 sm:p-24 max-w-3xl">
							<div className={tabValue !== 0 ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							<div className={tabValue !== 1 ? 'hidden' : ''}>
								<ProductImagesTab />
							</div>

							
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default ProductCategory;
