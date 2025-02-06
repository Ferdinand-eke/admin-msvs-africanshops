import GlobalStyles from '@mui/material/GlobalStyles';
import OrderItemsHeader from './OrderItemsHeader';
import OrderItemsTable from './OrderItemsTable';

/**
 * The orders page.
 */
function OrderItems() {
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
				<OrderItemsHeader />
				<OrderItemsTable />
			</div>
		</>
	);
}

export default OrderItems;
