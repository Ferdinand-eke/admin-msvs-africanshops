import GlobalStyles from '@mui/material/GlobalStyles';
import ProductsHeader from './ProductsHeader';
import ProductsTable from './ShopOnEstatePropertiesTable';

/**
 * The products page.
 */
function EstateProperties() {
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
				<ProductsHeader />

				<ProductsTable />
			</div>
		</>
	);
}

export default EstateProperties;
