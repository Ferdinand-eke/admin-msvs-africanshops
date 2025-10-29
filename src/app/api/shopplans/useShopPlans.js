import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createMarket,
  createShopPlan,
  deleteShopPlanById,
  getMarketById,
  getMarkets,
  getShopPlanById,
  getShopPlans,
  updateMarketById,
  updateShopPlanById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useShopplans() {
  return useQuery(['shopplans'], getShopPlans);
} //(Msvs => Done)

//get single shop plan
export function useSingleShopplans(shopplanId) {
  if(!shopplanId || shopplanId === 'new'){
    return {}
  }
  return useQuery(
    ['__shopplan', shopplanId],
    () => getShopPlanById(shopplanId),
    {
      enabled: Boolean(shopplanId),
      // staleTime: 2000,
    }
  );
} // (msvs => Done)

//create single shop plan
export function useAddShopPlanMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation(
    (newShopPlan) => {
      return createShopPlan(newShopPlan);
    },

    {
      onSuccess: (data) => {
        if (data?.data) {
          toast.success('shop plan  added successfully!');
          queryClient.invalidateQueries(['shopplans']);
          queryClient.refetchQueries('shopplans', { force: true });
          navigate('/vendorplans/packages');
        }else{
          toast.info('an unusual event just occured, hold on a bit please!');
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

//update single shop plan
export function useShopPlanUpdateMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(updateShopPlanById, {
    onSuccess: (data) => {
      if(data?.data?.success){
        toast.success('shop plan  updated successfully!!');
        queryClient.invalidateQueries('shopplans');
        navigate('/vendorplans/packages');
      }
    
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
} //(Msvs => Done)


/***Delete shop plan  */
export function useDeleteShopPlan() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteShopPlanById, {
    onSuccess: (data) => {
      if(data?.data && data?.data?.success){
        toast.success("market deleted successfully!!");
        queryClient.invalidateQueries("shopplans");
        queryClient.refetchQueries('shopplans', { force: true });
        navigate('/vendorplans/packages');
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
