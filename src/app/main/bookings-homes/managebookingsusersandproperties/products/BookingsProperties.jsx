import GlobalStyles from '@mui/material/GlobalStyles';
import BookingsPropertiesHeader from './BookingsPropertiesHeader';
import ShopOnBookingsPropertiesTable from './ShopOnBookingsPropertiesTable';

/**
 * The products page.
 */
function BookingsProperties() {
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
				<BookingsPropertiesHeader />
				

				<ShopOnBookingsPropertiesTable />
			</div>
		</>
	);
}

export default BookingsProperties;
