import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createLargeProdUnit,
  getLargeProdUnitById,
  getLargeProdUnits,
  updateLargeProdUnitById,
} from '../../store-redux/api/apiRoutes';

export default function useLargeProductUnits() {
  return useQuery(['__largeProductunits'], getLargeProdUnits);
}

//get single product units
export function useSingleLargeProductUnit(prodUnitId) {
  return useQuery(
    ['__largeProductUnitById', prodUnitId],
    () => getLargeProdUnitById(prodUnitId),
    {
      enabled: Boolean(prodUnitId),
      staleTime: 5000,
    }
  );
}

//create new product unit
export function useAddLargeProductUnitMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (newProdUnit) => {
      console.log('Run Product unit: ', newProdUnit);
      return createLargeProdUnit(newProdUnit);
    },

    {
      onSuccess: (data) => {
        if (data) {
          console.log('New product unit Data', data);
          toast.success('product unit added successfully!');
          queryClient.invalidateQueries(['__largeProductunits']);
          queryClient.refetchQueries('__largeProductunits', { force: true });
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

//update new product unit
export function useLargeProductUnitUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateLargeProdUnitById, {
    onSuccess: (data) => {
      console.log('Updated Product Category Data', data);
      toast.success('product unit updated successfully!!');
      queryClient.invalidateQueries('__largeProductunits');
      // queryClient.refetchQueries('__largeProductunits', { force: true });

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
