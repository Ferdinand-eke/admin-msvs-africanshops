import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createMarketCategory,
  createPostcat,
  deletePostcatsById,
  getMarketCategories,
  getMarketCategoryById,
  getPostcatById,
  getPostcats,
  updateMarketCategoryById,
  updatePostcatById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function usePostCats() {
  return useQuery(['postcategories'], getPostcats);
}

//get single post category
export function useSinglePostCategory(postCatId) {
  if(!postCatId || postCatId === 'new'){
    return {};
  }
  return useQuery(
    ['__postCategoryById', postCatId],
    () => getPostcatById(postCatId),
    {
      enabled: Boolean(postCatId),
      // staleTime: 2000,
    }
  );
}

//create new  post category
export function useAddPostCategoryMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation(
    (newPostCategory) => {
      return createPostcat(newPostCategory);
    },

    {
      onSuccess: (data) => {
        if (data?.data) {
          toast.success('post category added successfully!');
          queryClient.invalidateQueries(['postcategories']);
          queryClient.refetchQueries('postcategories', { force: true });
          navigate('/postcategories/list');
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

//update new post category
export function usePostCategoryUpdateMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(updatePostcatById, {
    onSuccess: (data) => {
   if(data?.data){
    toast.success('post categoryt updated successfully!!');
    queryClient.invalidateQueries('postcategories');
    navigate('/postcategories/list');
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
}

/***Delete Post Category */
export function useDeletePostCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deletePostcatsById, {
    onSuccess: (data) => {
      if(data?.data && data?.data?.success){
        toast.success("post actegory deleted successfully!!");
        queryClient.invalidateQueries("postcategories");
        queryClient.refetchQueries('postcategories', { force: true });
        navigate('/postcategories/list');
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