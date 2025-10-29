import { memo, useMemo } from 'react';
import Typography from '@mui/material/Typography';

/**
 * Individual product row component - memoized to prevent unnecessary re-renders
 */
const ProductRow = memo(({ product }) => (
	<tr>
		<td className="w-64">{product.id}</td>
		<td className="w-80">
			<img
				className="product-image"
				src={product.image}
				alt={product.name}
				loading="lazy"
				style={{ maxWidth: '80px', height: 'auto' }}
			/>
		</td>
		<td>
			<Typography
				className="truncate"
				style={{
					color: 'inherit',
					textDecoration: 'underline'
				}}
			>
				{product.name}
			</Typography>
		</td>
		<td className="w-64 text-right">
			<span className="truncate">NGN {product.price}</span>
		</td>
		<td className="w-64 text-right">
			<span className="truncate">{product.quantity}</span>
		</td>
	</tr>
));

ProductRow.displayName = 'ProductRow';

/**
 * The products tab - optimized with memoization
 */
function ProductsTab({ orderItems }) {

	console.log('Order Items in ProductsTab:', orderItems);
	// Memoize the rendered rows to prevent re-rendering when parent updates
	const productRows = useMemo(() => {
		if (!orderItems || orderItems.length === 0) {
			return (
				<tr>
					<td colSpan={5} className="text-center py-24">
						<Typography color="text.secondary">No products found</Typography>
					</td>
				</tr>
			);
		}

		return orderItems.map((product) => (
			<ProductRow key={product.id || product.id} product={product} />
		));
	}, [orderItems]);

	return (
		<div className="table-responsive">
			<table className="simple">
				<thead>
					<tr>
						<th>
							<Typography className="font-semibold">ID</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Image</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Name</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Price</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Quantity</Typography>
						</th>
					</tr>
				</thead>
				<tbody>
					{productRows}
				</tbody>
			</table>
		</div>
	);
}

export default memo(ProductsTab);
