import GlobalStyles from '@mui/material/GlobalStyles';
import DesignationsHeader from './ProductCategoriesHeader';
import DesignationsTable from './ProductCategoriesTable';

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
				<DesignationsHeader />
				<DesignationsTable />
				
			</div>
		</>
	);
}

export default ProductCategories;
