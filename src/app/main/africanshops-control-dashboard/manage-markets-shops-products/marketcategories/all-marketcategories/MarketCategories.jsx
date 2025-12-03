import GlobalStyles from '@mui/material/GlobalStyles';
import MarketCategoriesHeader from './MarketCategoriesHeader';
import MarketCategoriesTable from './MarketCategoriesTable';

/**
 * The products page.
 */
function MarketCategories() {
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
				<MarketCategoriesHeader />
				<MarketCategoriesTable />
			</div>
		</>
	);
}

export default MarketCategories;
