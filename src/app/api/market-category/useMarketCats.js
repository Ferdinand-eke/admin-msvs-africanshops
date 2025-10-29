import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createMarketCategory,
  deleteMarketCategoryById,
  getMarketCategories,
  getMarketCategoryById,
  getMarketWarehouseCategories,
  updateMarketCategoryById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useMarketCats() {
  return useQuery(['__marketcats'], getMarketCategories);
} //(Msvs => Done)

//get single market category
export function useSingleMarketCategory(marketCatId) {
  if (!marketCatId || marketCatId === "new") {
    return "";
  }
  return useQuery(
    ['__marketCategoryById', marketCatId],
    () => getMarketCategoryById(marketCatId),
    {
      enabled: Boolean(marketCatId),
      // staleTime: 2000,
    }
  );
} //(Msvs => Done)


//create new  market category
export function useAddMarketCategoryMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation(
    (newMarketCategory) => {
      return createMarketCategory(newMarketCategory);
    },

    {
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast.success('market category added successfully!');
          queryClient.invalidateQueries(['__marketcats']);
          queryClient.refetchQueries('__marketcats', { force: true });
          navigate('/market-categories/list');
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
} //(Msvs => Done)

//update new market category
export function useMarketCategoryUpdateMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(updateMarketCategoryById, {
    onSuccess: (data) => {
     if(data?.data?.success){
      toast.success('market category updated successfully!!');
      queryClient.invalidateQueries('__marketcats');
      navigate('/market-categories/list');
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

/***Delete market-category  */
export function useDeleteMarketCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteMarketCategoryById, {
    onSuccess: (data) => {
      if(data?.data?.success){
        toast.success("market category deleted successfully!!");
        queryClient.invalidateQueries("__offices");
        navigate('/market-categories/list');
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
} //(Msvs => Done)




/***
 * Warehouse links
 */
export function useMarketWarehouseCats() {
  return useQuery(['__marketwarehousecats'], getMarketWarehouseCategories);
}
