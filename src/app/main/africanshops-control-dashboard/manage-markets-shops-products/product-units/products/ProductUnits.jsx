import GlobalStyles from '@mui/material/GlobalStyles';
import ProductUnitsHeader from './ProductUnitsHeader';
import ProductProductUnitsTable from './ProductProductUnitsTable';

/**
 * The products page.
 */
function ProductUnits() {
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
				<ProductUnitsHeader />
				<ProductProductUnitsTable />
				
			</div>
		</>
	);
}

export default ProductUnits;
