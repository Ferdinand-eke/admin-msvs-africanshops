import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  getAdminPosts,
  getNewBlogPosts,
  getNewsPosts,
  getLegals,
  getApiLegalById,
  createLegal,
  updateLegalById,
} from '../apiRoutes';

export default function useLegalDocs() {
  return useQuery(['__adminLegalDocs'], getLegals);
}

//get single legal docs
export function useSingleLegalDocs(legalDocsId) {
  return useQuery(
    ['__LegalDocsById', legalDocsId],
    () => getApiLegalById(legalDocsId),
    {
      enabled: Boolean(legalDocsId),
      // staleTime: 5000,
    }
  );
}

//create new legac docs
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

//update existing banner
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
    onError: (err) => {
      // toast.error('Oops!, an error occured', err);
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}
