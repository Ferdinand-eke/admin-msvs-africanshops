import GlobalStyles from '@mui/material/GlobalStyles';
import RcsHeader from './RcsHeader';
import ShopOnRcsTable from './ShopOnRcsTable';

/**
 * The products page.
 */
function RcsMerchants() {
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
				<RcsHeader />

				<ShopOnRcsTable />
			</div>
		</>
	);
}

export default RcsMerchants;
