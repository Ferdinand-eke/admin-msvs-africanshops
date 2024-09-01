import GlobalStyles from '@mui/material/GlobalStyles';
import PostCategoriesHeader from './PostCategoriesHeader';
import PostCategoriesTable from './PostCategoriesTable';

/**
 * The products page.
 */
function PostCategories() {
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
				<PostCategoriesHeader />
				<PostCategoriesTable />
				
			</div>
		</>
	);
}

export default PostCategories;
