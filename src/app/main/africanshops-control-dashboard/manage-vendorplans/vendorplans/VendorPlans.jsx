import GlobalStyles from '@mui/material/GlobalStyles';
import VendorPlansHeader from './VendorPlansHeader';
import VendorPlansTable from './VendorPlansTable';

/**
 * The products page.
 */

function VendorPlans() {
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
				<VendorPlansHeader />
				<VendorPlansTable />
				
			</div>
		</>
	);
}

export default VendorPlans;
