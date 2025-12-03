import GlobalStyles from '@mui/material/GlobalStyles';
import OurOfficesHeader from './OurOfficesHeader';
import ShopProductsTable from './OurOfficesTable';

/**
 * The products page.
 */
function OurOffices() {
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
				<OurOfficesHeader />
				<ShopProductsTable />
			</div>
		</>
	);
}

export default OurOffices;
