import GlobalStyles from '@mui/material/GlobalStyles';
import ShopProductsHeader from './AllVendorsHeader';
import AllVendorsTable from './AllVendorsTable';

/**
 * The products page.
 */
function AllVendors() {
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
				<ShopProductsHeader />
				<AllVendorsTable />
			</div>
		</>
	);
}

export default AllVendors;
