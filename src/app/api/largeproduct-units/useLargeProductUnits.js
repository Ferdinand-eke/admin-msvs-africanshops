import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { createLargeProdUnit, getLargeProdUnitById, getLargeProdUnits, updateLargeProdUnitById } from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

export default function useLargeProductUnits() {
	return useQuery(['__largeProductunits'], getLargeProdUnits);
}

// get single product units
export function useSingleLargeProductUnit(prodUnitId) {
	return useQuery(['__largeProductUnitById', prodUnitId], () => getLargeProdUnitById(prodUnitId), {
		enabled: Boolean(prodUnitId)
		// staleTime: 5000,
	});
}

// create new product unit
export function useAddLargeProductUnitMutation() {
	const queryClient = useQueryClient();
	return useMutation(
		(newProdUnit) => {
			return createLargeProdUnit(newProdUnit);
		},

		{
			onSuccess: (data) => {
				if (data) {
					toast.success('product unit added successfully!');
					queryClient.invalidateQueries(['__largeProductunits']);
					queryClient.refetchQueries('__largeProductunits', { force: true });
				}
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create large product unit' })
		}
	);
}

// update new product unit
export function useLargeProductUnitUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateLargeProdUnitById, {
		onSuccess: (data) => {
			toast.success('product unit updated successfully!!');
			queryClient.invalidateQueries('__largeProductunits');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update large product unit' })
	});
}
