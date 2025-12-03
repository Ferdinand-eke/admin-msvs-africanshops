import GlobalStyles from '@mui/material/GlobalStyles';
import LgaCountiesHeader from './LgaCountiesHeader';
import LgaCountiesTable from './LgaCountiesTable';

/**
 * The products page.
 */
function LgaCounties() {
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
				<LgaCountiesHeader />
				<LgaCountiesTable />
			</div>
		</>
	);
}

export default LgaCounties;
