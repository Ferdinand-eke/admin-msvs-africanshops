import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { adminGetBookingsReservationsApi, adminGetCancelledReservationsApi, adminGetEstatePropertiess} from '../apiRoutes';

/******get all merchant Bookings|Hospitality properties */
export default function useMyShopEstateProperties() {
  return useQuery(['__bookingsproperties'], adminGetEstatePropertiess);
}


/******
 * ###########################################################
 * HANDLE APARTMENTS?BOOKINGS RESERVATIONS
 * ###########################################################
 */

export function useBookingPropertiesReservationsByAdmin() {
  return useQuery(['__bookings_reservations'], adminGetBookingsReservationsApi); 
}




/*****
 * 
 * CANCELLED RESERVATIONS
 * 
 */
export function useCancelledBookingsReservationsByAdmin() {
  return useQuery(['__cancelled_reservations'], adminGetCancelledReservationsApi); 
}
