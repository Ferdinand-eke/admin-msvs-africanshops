import GlobalStyles from '@mui/material/GlobalStyles';
import DepartmentsHeader from './DepartmentsHeader';
import CountriesTable from './DepartmentsTable';

/**
 * The products page.
 */
function Departments() {
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
				<DepartmentsHeader />
				<CountriesTable />
				
			</div>
		</>
	);
}

export default Departments;
