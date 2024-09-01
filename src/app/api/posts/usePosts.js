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
  getSinglePostById,
  adminGetSinglePostById,
  deleteBlogPostById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useAdminPosts() {
  return useQuery(['__amindPosts'], getNewsPosts);
}

//get single post
export function useSinglePost(postId) {
  if(!postId || postId === 'new'){
    return ''
  }

  return useQuery(['__amindPosts', postId], () => adminGetSinglePostById(postId), {
    enabled: Boolean(postId),
    // staleTime: 5000,
  });
}

//create new post
export function useAddPostMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (newPost) => {
      return createPost(newPost);
    },

    {
      onSuccess: (data) => {
        if (data?.data) {
          toast.success('Post  added successfully!');
          queryClient.invalidateQueries(['__amindPosts']);
          queryClient.refetchQueries('__amindPosts', { force: true });
          navigate('/posts/list');
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

//update existing Post
export function usePostUpdateMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  return useMutation(updatePostById, {
    onSuccess: (data) => {
     if(data?.data){
      toast.success('Post  updated successfully!!');
      queryClient.invalidateQueries('__amindPosts');
      navigate('/posts/list');
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


/***Delete an existing selected post */
export function useDeletePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteBlogPostById, {
    onSuccess: (data) => {
      if(data?.data && data?.data?.success){
        toast.success("post deleted successfully!!");
        queryClient.invalidateQueries("shopplans");
        queryClient.refetchQueries('shopplans', { force: true });
        navigate('/posts/list');
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