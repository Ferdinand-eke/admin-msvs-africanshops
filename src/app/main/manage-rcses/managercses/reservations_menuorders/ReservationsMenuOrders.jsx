import GlobalStyles from '@mui/material/GlobalStyles';
import { useState } from 'react';
import {
	useBookingPropertiesReservationsByAdmin,
	useCancelledBookingsReservationsByAdmin
} from 'src/app/api/admin-handle-bookingsproperties/useAdminHandleBookingsProperties';
import ReservationsMenuOrdersHeader from './ReservationsMenuOrdersHeader';
import ReservationsMenuOrdersTable from './ReservationsMenuOrdersTable';

/**
 * The products page.
 */
function ReservationsMenuOrders() {
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
				<ReservationsMenuOrdersHeader
					active={active}
					setActive={setActive}
					allReservations={allReservations?.data?.bookingsReservations}
					allCancelledReservations={allCancelledReservations?.data?.payload}
				/>

				<ReservationsMenuOrdersTable
					active={active}
					allReservations={allReservations?.data?.bookingsReservations}
					allCancelledReservations={allCancelledReservations?.data?.payload}
					allReservationsIsLoading={allReservationsIsLoading}
				/>
			</div>
		</>
	);
}

export default ReservationsMenuOrders;
