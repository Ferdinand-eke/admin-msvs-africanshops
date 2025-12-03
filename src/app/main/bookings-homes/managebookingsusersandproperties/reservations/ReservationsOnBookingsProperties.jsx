import GlobalStyles from '@mui/material/GlobalStyles';
import { useState } from 'react';
import {
	useBookingPropertiesReservationsByAdmin,
	useCancelledBookingsReservationsByAdmin
} from 'src/app/api/admin-handle-bookingsproperties/useAdminHandleBookingsProperties';
import ReservationsBookingsPropertiesHeader from './ReservationsBookingsPropertiesHeader';
import ReservationsOnBookingsListTable from './ReservationsOnBookingsListTable';

/**
 * The products page.
 */
function ReservationsOnBookingsProperties() {
	const { data: allReservations, isLoading: allReservationsIsLoading } = useBookingPropertiesReservationsByAdmin();

	/** *Cancelled Reservations */
	const { data: allCancelledReservations, isLoading: allCancelledReservationsIsLoading } =
		useCancelledBookingsReservationsByAdmin();

	const [active, setActive] = useState(1);

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
					allReservations={allReservations?.data?.bookingsReservations}
					allCancelledReservations={allCancelledReservations?.data?.payload}
				/>

				<ReservationsOnBookingsListTable
					active={active}
					allReservations={allReservations?.data?.bookingsReservations}
					allCancelledReservations={allCancelledReservations?.data?.payload}
					allReservationsIsLoading={allReservationsIsLoading}
				/>
			</div>
		</>
	);
}

export default ReservationsOnBookingsProperties;
