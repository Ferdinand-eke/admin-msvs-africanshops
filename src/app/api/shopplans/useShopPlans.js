import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createErrorHandler } from '../utils/errorHandler';
import { createShopPlan, deleteShopPlanById, getShopPlanById, getShopPlans, updateShopPlanById } from '../apiRoutes';

export default function useShopplans() {
	return useQuery(['shopplans'], getShopPlans);
} // (Msvs => Done)

// get single shop plan
export function useSingleShopplans(shopplanId) {
	if (!shopplanId || shopplanId === 'new') {
		return {};
	}

	return useQuery(['__shopplan', shopplanId], () => getShopPlanById(shopplanId), {
		enabled: Boolean(shopplanId)
		// staleTime: 2000,
	});
} // (msvs => Done)

// create single shop plan
export function useAddShopPlanMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newShopPlan) => {
			return createShopPlan(newShopPlan);
		},

		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success('shop plan  added successfully!');
					queryClient.invalidateQueries(['shopplans']);
					queryClient.refetchQueries('shopplans', { force: true });
					navigate('/vendorplans/packages');
				}

				// else{
				//   toast.info('an unusual event just occured, hold on a bit please!');
				// }
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create shop plan' })
		}
	);
}

// update single shop plan
export function useShopPlanUpdateMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(updateShopPlanById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('shop plan  updated successfully!!');
				queryClient.invalidateQueries('shopplans');
				navigate('/vendorplans/packages');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update shop plan' })
	});
} // (Msvs => Done)

/** *Delete shop plan  */
export function useDeleteShopPlan() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteShopPlanById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('plan deleted successfully!!');
				queryClient.invalidateQueries('shopplans');
				queryClient.refetchQueries('shopplans', { force: true });
				navigate('/vendorplans/packages');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete shop plan' })
	});
}
