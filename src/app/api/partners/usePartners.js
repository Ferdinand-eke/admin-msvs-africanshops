import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  getAdminPosts,
  getNewBlogPosts,
  getNewsPosts,
  getLegals,
  createPost,
  getPostById,
  updatePostById,
  getFaqs,
  createApiFaq,
  updateFaqById,
  getApiFaqById,
  getPartners,
  getAdminPartnerById,
  createPartner,
  updatePartnerById,
} from '../../store-redux/api/apiRoutes';

export default function useAdminPartners() {
  return useQuery(['__adminPartners'], getPartners);
}

//get single partner
export function useSinglePartner(partnerId) {
  return useQuery(
    ['__PartnerById', partnerId],
    () => getAdminPartnerById(partnerId),
    {
      enabled: Boolean(partnerId),
      // staleTime: 5000,
    }
  );
}

//create new partner
export function useAddPartnerMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (newPartner) => {
      console.log('Run partner : ', newPartner);
      return createPartner(newPartner);
    },

    {
      onSuccess: (data) => {
        if (data) {
          console.log('New Partner  Data', data);
          toast.success('Partner  added successfully!');
          queryClient.invalidateQueries(['__adminPartners']);
          queryClient.refetchQueries('__adminPartners', { force: true });
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
        console.log('MutationError', error.response.data);
        console.log('MutationError', error.data);
        rollback();
      },
    }
  );
}

//update existing partner
export function useFaqUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updatePartnerById, {
    onSuccess: (data) => {
      console.log('Updated partner  Data', data);
      toast.success('Partner  updated successfully!!');
      queryClient.invalidateQueries('__adminPartners');
      // queryClient.refetchQueries('__adminPartners', { force: true });

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
