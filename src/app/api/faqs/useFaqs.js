import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { getFaqs, createApiFaq, updateFaqById, getApiFaqById } from '../apiRoutes';

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
			onError: (error, values, rollback) => {
				toast.error(
					error.response && error.response.data.message ? error.response.data.message : error.message
				);
				rollback();
			}
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
		onError: (err) => {
			toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
		}
	});
}
