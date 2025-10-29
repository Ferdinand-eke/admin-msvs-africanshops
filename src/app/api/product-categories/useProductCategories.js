import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createProdCat,
  deleteProdCatById,
  getProdCatById,
  getProdCats,
  updateProdCatById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useProductCats() {
  return useQuery(['__productcats'], getProdCats);
} // (Msvs => Done)

//get single product category
export function useSingleProductCat(proCatId) {
  if(!proCatId || proCatId === 'new'){
    return {};
  }
  return useQuery(
    ['__productcatsById', proCatId],
    () => getProdCatById(proCatId),
    {
      enabled: Boolean(proCatId),
      // staleTime: 5000,
    }
  );
} // (Msvs => Done)

//create new product category
export function useAddProductCatMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (newProdCat) => {
      return createProdCat(newProdCat);
    },

    {
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast.success('product category added successfully!');
          queryClient.invalidateQueries(['__productcats']);
          queryClient.refetchQueries('__productcats', { force: true });
          navigate('/productcategories/list');
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

//update new product category
export function useProductCatUpdateMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  return useMutation(updateProdCatById, {
    onSuccess: (data) => {
      if (data?.data?.success) {
      toast.success('product category updated successfully...!');
      queryClient.invalidateQueries('__productcats');
      queryClient.refetchQueries('__productcats', { force: true });
      navigate('/productcategories/list');
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
} // (Msvs => Done)


export function useDeleteProductCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteProdCatById, {
    onSuccess: (data) => {
      if(data?.data?.success){
        toast.success("category deleted successfully!!");
        queryClient.invalidateQueries("shopplans");
        queryClient.refetchQueries('shopplans', { force: true });
        navigate('/productcategories/list');
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