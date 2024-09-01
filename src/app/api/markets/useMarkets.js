import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createMarket,
  deleteMarketById,
  getMarketById,
  getMarkets,
  updateMarketById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useMarkets() {
  return useQuery(['__markets'], getMarkets);
}

//get single market
export function useSingleMarket(marketId) {
  if (!marketId || marketId === "new") {
    return "";
  }
  return useQuery(['__marketById', marketId], () => getMarketById(marketId), {
    enabled: Boolean(marketId),
    // staleTime: 2000,
  });
}

//create new  market
export function useAddMarketMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (newMarket) => {
      console.log('Run market : ', newMarket);
      return createMarket(newMarket);
    },

    {
      onSuccess: (data) => {
        if (data?.data) {
          console.log('New market  Data', data);
          toast.success('market  added successfully!');
          queryClient.invalidateQueries(['__markets']);
          queryClient.refetchQueries('__markets', { force: true });
          navigate('/markets/list');
        }
      },
    },
    {
      onError: (error, values, rollback) => {
        console.log('Run market Error : ', error);
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

//update new market
export function useMarketUpdateMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(updateMarketById, {
    onSuccess: (data) => {
      console.log('Update market  Data', data);
      if (data?.data) {
        toast.success('market  updated successfully!!');
        queryClient.invalidateQueries('__markets');
        navigate('/markets/list');
      }
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


/***Delete market-category  */
export function useDeleteMarket() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteMarketById, {
    onSuccess: (data) => {
      if(data?.data && data?.data?.success){
        toast.success("market deleted successfully!!");
        queryClient.invalidateQueries("__markets");
        navigate('/markets/list');
      }
  
    },
    onError: (error) => {
      toast.success(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}
