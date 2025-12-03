import GlobalStyles from '@mui/material/GlobalStyles';
import PostsHeader from './PostsHeader';
import PostsTable from './PostsTable';

/**
 * The products page.
 */
function Posts() {
	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh'
					}
				})}
			/>

			<div className="w-full h-full container flex flex-col">
				<PostsHeader />
				<PostsTable />
			</div>
		</>
	);
}

export default Posts;
