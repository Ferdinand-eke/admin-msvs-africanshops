import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { adminApproveRefundsApi, adminGetBookingsReservationsApi, adminGetCancelledReservationsApi, adminGetEstatePropertiess} from '../apiRoutes';

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
 * ################################################################
 * HANDLE CANCELLED RESERVATIONS BY ADMIN STARTS HERE
 * ###############################################################
 */
export function useCancelledBookingsReservationsByAdmin() {
  return useQuery(['__cancelled_reservations'], adminGetCancelledReservationsApi); 
}

/*******Approve and pay user refunds */
export function useAdminApproveBookinfsRefundMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (refundPayload) => {
      return adminApproveRefundsApi(refundPayload);
    },

    {
      onSuccess: (data) => {

        if (data?.data?.success) {
          toast.success(`${data?.data?.message ? data?.data?.message : "Refund Approval successful!"}`);
          queryClient.invalidateQueries(['__cancelled_reservations']);
          queryClient.refetchQueries('__cancelled_reservations', { force: true });
        }
      },
    },
    {
      onError: (error, values, rollback) => {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        rollback();
      },
    }
  );
}


