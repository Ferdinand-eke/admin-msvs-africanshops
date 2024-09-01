import GlobalStyles from '@mui/material/GlobalStyles';
import CountryShippingTablesHeader from './CountryShippingTablesHeader';
import CountryTable from './CountryTable';

/**
 * The products page.
 */
function CountryShippingTables() {
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
				<CountryShippingTablesHeader />
				<CountryTable />
				
			</div>
		</>
	);
}

export default CountryShippingTables;
