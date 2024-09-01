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
} from '../../store-redux/api/apiRoutes';

export default function useAdminFaqs() {
  return useQuery(['__amindFaqs'], getFaqs);
}

//get single faq
export function useSingleFaq(faqId) {
  return useQuery(['__faqById', faqId], () => getApiFaqById(faqId), {
    enabled: Boolean(faqId),
    // staleTime: 5000,
  });
}

//create new faq
export function useAddFaqMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (newFaq) => {
      console.log('Run faq : ', newFaq);
      return createApiFaq(newFaq);
    },

    {
      onSuccess: (data) => {
        if (data) {
          console.log('New Faq  Data', data);
          toast.success('FAQ  added successfully!');
          queryClient.invalidateQueries(['__amindFaqs']);
          queryClient.refetchQueries('__amindFaqs', { force: true });
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

//update existing Faq
export function useFaqUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateFaqById, {
    onSuccess: (data) => {
      console.log('Updated Faq  Data', data);
      toast.success('FAQ  updated successfully!!');
      queryClient.invalidateQueries('__amindFaqs');
      // queryClient.refetchQueries('__amindFaqs', { force: true });

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
