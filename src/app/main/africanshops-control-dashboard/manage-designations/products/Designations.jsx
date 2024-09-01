import GlobalStyles from '@mui/material/GlobalStyles';
import DesignationsHeader from './DesignationsHeader';
import DesignationsTable from './DesignationsTable';

/**
 * The products page.
 */
function Designations() {
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

export default Designations;
