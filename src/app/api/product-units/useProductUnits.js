import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createProdUnit,
  deleteProdUnitsById,
  getProdUnitById,
  getProdUnits,
  updateProdUnitById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useProductUnits() {
  return useQuery(['__productunits'], getProdUnits);
} // (Msvs => Done)

//get single product units
export function useSingleProductUnit(prodUnitId) {

  if(!prodUnitId || prodUnitId === 'new'){
    return {};
  }
  return useQuery(
    ['__productUnitById', prodUnitId],
    () => getProdUnitById(prodUnitId),
    {
      enabled: Boolean(prodUnitId),
      // staleTime: 5000,
    }
  );
}// (Msvs => Done)

//create new product unit
export function useAddProductUnitMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (newProdUnit) => {
      return createProdUnit(newProdUnit);
    },

    {
      onSuccess: (data) => {
        if (data?.data) {
          toast.success('product unit added successfully!');
          queryClient.invalidateQueries(['__productunits']);
          queryClient.refetchQueries('__productunits', { force: true });
          navigate('/productunits/list');
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

//update new product unit
export function useProductUnitUpdateMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  return useMutation(updateProdUnitById, {
    onSuccess: (data) => {
   if(data?.data?.success){
    toast.success('product unit updated successfully!!');
    queryClient.invalidateQueries('__productunits');
    navigate('/productunits/list');
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
}// (Msvs => Done)


/***Delete Product unit */
export function useDeleteProductUnit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteProdUnitsById, {
    onSuccess: (data) => {
      if(data?.data && data?.data?.success){
        toast.success("product unit deleted successfully!!");
        queryClient.invalidateQueries("shopplans");
        queryClient.refetchQueries('shopplans', { force: true });
        navigate('/productunits/list');
      }
  
    },
    onError: (error) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}