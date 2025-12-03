import FusePageCarded from '@fuse/core/FusePageCarded';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { z } from 'zod';
import CountryHeader from './CountryShipmentFormPageHeader';
// import InventoryTab from './tabs/InventoryTab';
// import PricingTab from './tabs/PricingTab';
// import ShippingTab from './tabs/ShippingTab';
import CountryShipmentPagedForm from '../countryshipment/tabs/CountryShipmentPagedForm';
/**
 * Form Validation Schema
 */
const schema = z.object({
	countrylocation: z.object({
		name: z.string()
	})
});

/**
 * The product page.
 */
function CountryShipmentFormPage() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	// const routeParams = useParams();
	// const { productId } = routeParams;

	const [tabValue, setTabValue] = useState(0);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	return (
		<FormProvider>
			<FusePageCarded
				header={<CountryHeader />}
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
								label="Product Images"
							/>
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
								{/* <CountryBasicInfoTab /> */}
								<CountryShipmentPagedForm />
							</div>

							{/* <div className={tabValue !== 1 ? 'hidden' : ''}>
								<ProductImagesTab />
							</div> */}
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default CountryShipmentFormPage;
