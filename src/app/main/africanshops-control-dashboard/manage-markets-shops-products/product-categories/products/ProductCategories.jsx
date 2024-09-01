import GlobalStyles from '@mui/material/GlobalStyles';
import ProductCategoriesHeader from './ProductCategoriesHeader';
import ProductCategoriesTable from './ProductCategoriesTable';

/**
 * The products page.
 */
function ProductCategories() {
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
				<ProductCategoriesHeader />
				<ProductCategoriesTable />
				
			</div>
		</>
	);
}

export default ProductCategories;
