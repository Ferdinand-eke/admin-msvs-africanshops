import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createAd,
  getAdById,
  getAds,
  updateAdById,
} from '../../store-redux/api/apiRoutes';

export default function useAdvertisements() {
  return useQuery(['__adverts'], getAds);
}

//get single product category
export function useSingleAdvert(adsId) {
  return useQuery(['advertsById', adsId], () => getAdById(adsId), {
    enabled: Boolean(adsId),
    // staleTime: 5000,
  });
}

//create new advert
export function useAddAdvertMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (newAdverts) => {
      console.log('Run Adverts: ', newAdverts);
      return createAd(newAdverts);
    },

    {
      onSuccess: (data) => {
        if (data) {
          console.log('New advert Data', data);
          toast.success('advert added successfully!');
          queryClient.invalidateQueries(['__adverts']);
          queryClient.refetchQueries('__adverts', { force: true });
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

//update new advert
export function useAdvertUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateAdById, {
    onSuccess: (data) => {
      console.log('Updated advert Data', data);
      toast.success('advert updated successfully!!');
      queryClient.invalidateQueries('__adverts');
      // queryClient.refetchQueries('__adverts', { force: true });

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
