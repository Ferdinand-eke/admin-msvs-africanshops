import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createPostcat, deletePostcatsById, getPostcatById, getPostcats, updatePostcatById } from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

export default function usePostCats() {
	return useQuery(['postcategories'], getPostcats);
}

// get single post category
export function useSinglePostCategory(postCatId) {
	if (!postCatId || postCatId === 'new') {
		return {};
	}

	return useQuery(['__postCategoryById', postCatId], () => getPostcatById(postCatId), {
		enabled: Boolean(postCatId)
		// staleTime: 2000,
	});
}

// create new  post category
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
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create post category' })
		}
	);
}

// update new post category
export function usePostCategoryUpdateMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(updatePostcatById, {
		onSuccess: (data) => {
			if (data?.data) {
				toast.success('post categoryt updated successfully!!');
				queryClient.invalidateQueries('postcategories');
				navigate('/postcategories/list');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update post category' })
	});
}

/** *Delete Post Category */
export function useDeletePostCategory() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deletePostcatsById, {
		onSuccess: (data) => {
			if (data?.data && data?.data?.success) {
				toast.success('post actegory deleted successfully!!');
				queryClient.invalidateQueries('postcategories');
				queryClient.refetchQueries('postcategories', { force: true });
				navigate('/postcategories/list');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete post category' })
	});
}
