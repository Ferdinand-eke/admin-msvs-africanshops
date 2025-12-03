import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { getPartners, getAdminPartnerById, createPartner, updatePartnerById } from '../apiRoutes';

export default function useAdminPartners() {
	return useQuery(['__adminPartners'], getPartners);
}

// get single partner
export function useSinglePartner(partnerId) {
	return useQuery(['__PartnerById', partnerId], () => getAdminPartnerById(partnerId), {
		enabled: Boolean(partnerId)
		// staleTime: 5000,
	});
}

// create new partner
export function useAddPartnerMutation() {
	const queryClient = useQueryClient();
	return useMutation(
		(newPartner) => {
			return createPartner(newPartner);
		},

		{
			onSuccess: (data) => {
				if (data) {
					toast.success('Partner  added successfully!');
					queryClient.invalidateQueries(['__adminPartners']);
					queryClient.refetchQueries('__adminPartners', { force: true });
				}
			}
		},
		{
			onError: (error, values, rollback) => {
				toast.error(
					error.response && error.response.data.message ? error.response.data.message : error.message
				);
				rollback();
			}
		}
	);
}

// update existing partner
export function useFaqUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updatePartnerById, {
		onSuccess: (data) => {
			toast.success('Partner  updated successfully!!');
			queryClient.invalidateQueries('__adminPartners');
		},
		onError: (err) => {
			toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
		}
	});
}
