import GlobalStyles from '@mui/material/GlobalStyles';
import MarketsHeader from './MarketsHeader';
import MarketsTable from './MarketsTable';

/**
 * The products page.
 */
function Markets() {
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
				<MarketsHeader />
				<MarketsTable />
				
			</div>
		</>
	);
}

export default Markets;
