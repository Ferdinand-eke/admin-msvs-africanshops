import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { getLegals, getApiLegalById, createLegal, updateLegalById } from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

export default function useLegalDocs() {
	return useQuery(['__adminLegalDocs'], getLegals);
}

// get single legal docs
export function useSingleLegalDocs(legalDocsId) {
	return useQuery(['__LegalDocsById', legalDocsId], () => getApiLegalById(legalDocsId), {
		enabled: Boolean(legalDocsId)
		// staleTime: 5000,
	});
}

// create new legac docs
export function useAddLegalDocsMutation() {
	const queryClient = useQueryClient();
	return useMutation(
		(newlegalDocs) => {
			return createLegal(newlegalDocs);
		},

		{
			onSuccess: (data) => {
				if (data) {
					toast.success('Docs  added successfully!');
					queryClient.invalidateQueries(['__adminLegalDocs']);
					queryClient.refetchQueries('__adminLegalDocs', { force: true });
				}
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create legal document' })
		}
	);
}

// update existing banner
export function useLegalDocsUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateLegalById, {
		onSuccess: (data) => {
			console.log('Updated banner  Data', data);
			toast.success('Banner  updated successfully!!');
			queryClient.invalidateQueries('__adminLegalDocs');
			// queryClient.refetchQueries('__adminLegalDocs', { force: true });

			// navigate('/transaction-list');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update legal document' })
	});
}
