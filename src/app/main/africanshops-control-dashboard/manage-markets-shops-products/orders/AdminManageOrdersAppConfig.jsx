import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const AdminManageECommerceApp = lazy(() => import('./AdminManageECommerceApp'));

const Products = lazy(() => import('./products/Products'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));
const OrderItems = lazy(() => import('./orderitems/OrderItems'));
/**
 * The E-Commerce app configuration.
 */


const AdminManageOrdersAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			//shoporders-list
			path: 'admin-manage',
			element: <AdminManageECommerceApp />,
			children: [
				{
					path: '',
					element: <Navigate to="orders" />
				},
				{
					path: 'orders',
					element: <Orders />
				},
				
				{
					path: 'orders/:orderId',
					element: <Order />
				},

				{
					path: 'pos',
					element: <Products />
				},

				{
					path: 'orderitems',
					element: <OrderItems />
				},
			]
		}
	]
};

export default AdminManageOrdersAppConfig;
