
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import VendorPlanHeader from './CountryShippingHeader';
import BasicInfoTab from './tabs/BasicInfoTab';

import { useGetECommerceProductQuery } from '../ECommerceApi';
import ProductModel from './models/ProductModel';
import { useSingleShopplans } from 'src/app/api/shopplans/useShopPlans';
import { useSingleCountry } from 'src/app/api/countries/useCountries';

// import CountryShipmentForm from "./CountryShipmentForm";
/**
 * Form Validation Schema
 */
const schema = z.object({
	plansname: z.string().nonempty('You must enter a product name').min(3, 'The product name must be at least 5 characters')
});

/**
 * The product page.
 */

function CountryShipping() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;
	const {
		data: countryshipping,
		isLoading,
		isError
	} = useSingleCountry(productId, {
		skip: !productId || productId === 'new'
	});
	// useCountriesWithShippingTableOriginExcluded
	// console.log("SINGLE_COUNTY_SHIPPING", countryshipping?.data)

	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			plansname: '',
			percetageCommissionCharge: '',
			percetageCommissionChargeConversion: 0,
			adsbost: '',
			price: '',
			support: '',
			numberofproducts: '',
			dashboardandanalytics: '',
			numberoffeaturedimages: '',
		},
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
		if (countryshipping?.data) {
			reset({ ...countryshipping?.data });
		}
	}, [countryshipping?.data, reset]);


	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

// 

	/**
	 * Show Message if the requested products is not exists
	 */
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
					There is no such product!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/vendorplans/packages"
					color="inherit"
				>
					Go to Products Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (_.isEmpty(form) || (countryshipping?.data && routeParams.productId !== countryshipping?.data._id && routeParams.productId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<VendorPlanHeader 
				/>}
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
							
						</Tabs>
						<div className="p-16 sm:p-24 max-w-auto">
						{/* max-w-3xl */}
							<div className={tabValue !== 0 ? 'hidden' : ''}>
								<BasicInfoTab 
								shipmentTable={countryshipping?.data?.shippingTable}
							
								/>
							</div>

							
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default CountryShipping;
