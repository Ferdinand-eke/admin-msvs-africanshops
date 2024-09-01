import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createTradehub,
  deleteTradehubById,
  getTradehubById,
  getTradehubs,
  updateTradehubById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useHubs() {
  return useQuery(['tradeHubs'], getTradehubs);
}

//get single traade hub
export function useSingleHub(hubId) {
  if(!hubId || hubId === 'new'){
    return {}
  }
  return useQuery(['tradeHubs', hubId], () => getTradehubById(hubId), {
    enabled: Boolean(hubId),
    // staleTime: 5000,
  });
}

//create new trade hub
export function useAddHubMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (newTradehub) => {
      // console.log('RunHub: ', newTradehub);
      return createTradehub(newTradehub);
    },

    {
      onSuccess: (data) => {
        if (data?.data) {
          // console.log('New Hub Data', data);
          toast.success('trade hub added successfully!');
          queryClient.invalidateQueries(['tradeHubs']);
          queryClient.refetchQueries('tradeHubs', { force: true });
          navigate('/tradehubs/list');
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
        // console.log('MutationError', error.response.data);
        // console.log('MutationError', error.data);
        rollback();
      },
    }
  );
}

//update existing trade hub
export function useHubUpdateMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
 
  return useMutation(updateTradehubById, {
    onSuccess: (data) => {
      console.log('Updated Tradehub Data', data);
     if(data?.data){
      toast.success('traded hub updated successfully!!');

      queryClient.invalidateQueries('tradeHubs');
      queryClient.refetchQueries('tradeHubs', { force: true });

      navigate('/tradehubs/list');
     }
    },
    onError: (error) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      toast.success('Oops!, an error occured');
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

//delet an exiting trade hub
export function useDeleteHubMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  return useMutation(deleteTradehubById, {
    onSuccess: (data) => {
      // console.log('Deleted Tradehub Data', data)
      if (data?.data) {
       
        toast.success('traded hub deleted successfully!!');

        queryClient.invalidateQueries('tradeHubs');
        navigate('/tradehubs/list');

      }
    },
    onError: (error) => {
      console.log(error);
      toast.success('Oops!, an error occured');
    },
  });
}
