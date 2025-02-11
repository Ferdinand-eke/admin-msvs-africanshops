import GlobalStyles from '@mui/material/GlobalStyles';
import ReservationsBookingsPropertiesHeader from './ReservationsBookingsPropertiesHeader';
import ReservationsOnBookingsListTable from './ReservationsOnBookingsListTable';
import { useState } from 'react';

/**
 * The products page.
 */
function ReservationsOnBookingsProperties() {

	const [active, setActive] = useState(1)



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
				<ReservationsBookingsPropertiesHeader 
				active={active}
				setActive={setActive}
				/>
				
				<ReservationsOnBookingsListTable 
				active={active}
				/>
				
				
			</div>
		</>
	);

	
}

export default ReservationsOnBookingsProperties;
