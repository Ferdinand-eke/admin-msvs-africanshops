import GlobalStyles from '@mui/material/GlobalStyles';
import CountriesHeader from './CountriesHeader';
import CountriesTable from './CountriesTable';

/**
 * The products page.
 */

function Countries() {
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
				<CountriesHeader />
				<CountriesTable />
			</div>
		</>
	);
}

export default Countries;
