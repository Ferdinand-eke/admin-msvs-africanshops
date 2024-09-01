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
import SingleDesignationHeader from './SingleTradehubHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import InventoryTab from './tabs/InventoryTab';
import PricingTab from './tabs/PricingTab';
import ProductImagesTab from './tabs/ProductImagesTab';
import ShippingTab from './tabs/ShippingTab';
import { useGetECommerceProductQuery } from '../ECommerceApi';
import ProductModel from './models/ProductModel';
import { useSingleState } from 'src/app/api/states/useStates';
import { useSingleDesignation } from 'src/app/api/designations/useDesignations';
import { useSingleHub } from 'src/app/api/tradehubs/useTradeHubs';
/**
 * Form Validation Schema
 */
const schema = z.object({
	hubname: z.string().nonempty('You must enter a trade huv name').min(4, 'The product name must be at least 5 characters')
});

/**
 * The product page.
 */
function Tradehub() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;
	// const {
	// 	data: product,
	// 	isLoading,
	// 	isError
	// } = useGetECommerceProductQuery(productId, {
	// 	skip: !productId || productId === 'new'
	// });

	const {data:hub,
		isLoading,
		isError
	} = useSingleHub(productId, {
		skip: !productId || productId === 'new'
	})
	// console.log("HUB-Data", hub?.data)

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
		if (hub?.data) {
			reset({ ...hub?.data });
		}
	}, [hub?.data, reset]);


	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	/**
	 * Show Message if the requested products is not exists
	 */
	console.log("Getting State error", isError)
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
				{isError}	There is no such trade hub!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/tradehubs/list"
					color="inherit"
				>
					Go to trade hub Page
				</Button>
			</motion.div>
		);
	}

	// console.log("STATE-DATA", state?.data)

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (_.isEmpty(form) || (hub?.data && routeParams.productId !== hub?.data?._id && routeParams.productId !== 'new')) {
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
							{/* <Tab
								className="h-64"
								label="Product Images"
							/> */}
							{/* <Tab
								className="h-64"
								label="Pricing"
							/> */}
							{/* <Tab
								className="h-64"
								label="Inventory"
							/> */}
							{/* <Tab
								className="h-64"
								label="Shipping"
							/> */}
						</Tabs>
						<div className="p-16 sm:p-24 max-w-3xl">
							<div className={tabValue !== 0 ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							{/* <div className={tabValue !== 1 ? 'hidden' : ''}>
								<ProductImagesTab />
							</div> */}

							{/* <div className={tabValue !== 2 ? 'hidden' : ''}>
								<PricingTab />
							</div> */}

							{/* <div className={tabValue !== 3 ? 'hidden' : ''}>
								<InventoryTab />
							</div> */}

							{/* <div className={tabValue !== 4 ? 'hidden' : ''}>
								<ShippingTab />
							</div> */}
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Tradehub;
