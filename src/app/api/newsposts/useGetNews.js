import { useQuery } from 'react-query';
import { getNewBlogPosts } from '../../store-redux/api/apiRoutes';
import { getNewsPost } from './newsposts';

export default function getPosts() {
	return useQuery(['__newsposts'], getNewBlogPosts);
}

export const useGetSinglePost = (slug) => {
	return useQuery(['post', slug], () => getNewsPost(slug), {
		enabled: Boolean(slug),
		staleTime: 5000
	});
};
