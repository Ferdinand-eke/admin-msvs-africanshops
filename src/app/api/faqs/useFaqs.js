import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { getFaqs, createApiFaq, updateFaqById, getApiFaqById } from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

export default function useAdminFaqs() {
	return useQuery(['__amindFaqs'], getFaqs);
}

// get single faq
export function useSingleFaq(faqId) {
	return useQuery(['__faqById', faqId], () => getApiFaqById(faqId), {
		enabled: Boolean(faqId)
		// staleTime: 5000,
	});
}

// create new faq
export function useAddFaqMutation() {
	const queryClient = useQueryClient();
	return useMutation(
		(newFaq) => {
			return createApiFaq(newFaq);
		},

		{
			onSuccess: (data) => {
				if (data) {
					toast.success('FAQ  added successfully!');
					queryClient.invalidateQueries(['__amindFaqs']);
					queryClient.refetchQueries('__amindFaqs', { force: true });
				}
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create FAQ' })
		}
	);
}

// update existing Faq
export function useFaqUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateFaqById, {
		onSuccess: (data) => {
			toast.success('FAQ  updated successfully!!');
			queryClient.invalidateQueries('__amindFaqs');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update FAQ' })
	});
}
