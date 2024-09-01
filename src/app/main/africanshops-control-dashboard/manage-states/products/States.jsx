import GlobalStyles from '@mui/material/GlobalStyles';
import StatesHeader from './StatesHeader';
import StatesTable from './StatesTable';

/**
 * The products page.
 */
function States() {
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
				<StatesHeader />
				<StatesTable />
				
			</div>
		</>
	);
}

export default States;
