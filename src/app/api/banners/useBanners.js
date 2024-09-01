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
  getBanners,
  getApiBannerById,
  updateBannerById,
  createBanner,
} from '../../store-redux/api/apiRoutes';

export default function useAdminBanners() {
  return useQuery(['__adminBanners'], getBanners);
}

//get single banner
export function useSingleBanner(bannerId) {
  return useQuery(
    ['__BannerById', bannerId],
    () => getApiBannerById(bannerId),
    {
      enabled: Boolean(bannerId),
      // staleTime: 5000,
    }
  );
}

//create new banner
export function useAddBannerMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (newBanner) => {
      console.log('Run banner : ', newBanner);
      return createBanner(newBanner);
    },

    {
      onSuccess: (data) => {
        if (data) {
          console.log('New Banner  Data', data);
          toast.success('Banner  added successfully!');
          queryClient.invalidateQueries(['__adminBanners']);
          queryClient.refetchQueries('__adminBanners', { force: true });
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

//update existing banner
export function useBannerUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateBannerById, {
    onSuccess: (data) => {
      console.log('Updated banner  Data', data);
      toast.success('Banner  updated successfully!!');
      queryClient.invalidateQueries('__adminBanners');
      // queryClient.refetchQueries('__adminBanners', { force: true });

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
