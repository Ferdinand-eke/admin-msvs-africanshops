import GlobalStyles from '@mui/material/GlobalStyles';
import DesignationsHeader from './TradehubsHeader';
import DesignationsTable from './TradehubsTable';

/**
 * The products page.
 */
function Tradehubs() {
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

export default Tradehubs;
