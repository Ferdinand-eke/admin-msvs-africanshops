import { useQuery, useMutation, useQueryClient } from 'react-query';
// import {
//   GetShopOrderItems,
//   getShopProducts,
//   MyShopCashOutOrderByOrderIdShopId,
//   myShopOrderByShopId,
// } from '../utils';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  adminConfirmOrderArrival,
  adminDeliverOrders,
  adminGetOrderById,
  adminGetOrderItemsOfOrderById,
  adminGetOrders,
  adminGet_ApproveAndPayRefund,
  adminGet_OrderItems,
  adminPackOrders,
  adminShipOrders,
} from '../apiRoutes';


/*** 1) Get all orders on database by admin */
export default function useAdminGetOrders(params = {}) {
  return useQuery(
    ['orders_adminrole', params],
    () => adminGetOrders(params),
    {
      keepPreviousData: true, // Keep previous data while fetching new page
      staleTime: 30000, // Consider data fresh for 30 seconds
    }
  );
} //(Msvs => Done)

/*** 1b) Get paginated orders with server-side pagination */
export function useAdminGetOrdersPaginated({ page = 0, limit = 20, search = '', filters = {} }) {
  const offset = page * limit;

  return useQuery(
    ['orders_adminrole_paginated', { page, limit, search, filters }],
    () => adminGetOrders({
      limit,
      offset,
      search,
      ...filters
    }),
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  );
}

/*** 2) Get single order  by admin */
export function useAdminFindSingleOrder(orderId) {
  return useQuery(['orders_adminrole', orderId], () =>
    adminGetOrderById(orderId)
  );
}//(Msvs => Done)


/*** 3) Get shop orders  by admin */
export function useAdminFindShopOrder(orderId) {
  return useQuery(['orders_adminrole', orderId], () =>
    adminGetOrderById(orderId)
  );
}

/*** 4) Handle Pack order  by admin */
export function usePackOrder() {
  const queryClient = useQueryClient();
  return useMutation(adminPackOrders, {
    onSuccess: () => {
      toast.success('Order Packed successfully!');
      queryClient.invalidateQueries('orders_adminrole');
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

/*** 5) Handle Ship order  by admin */
export function useShipOrder() {
  const queryClient = useQueryClient();
  return useMutation(adminShipOrders, {
    onSuccess: () => {
      toast.success('Order Shipped successfully!');
      queryClient.invalidateQueries('orders_adminrole');
    },
    onError: (err) => {

      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );    },
  });
}

/*** 6) Handle  order arrival  by admin */
export function useHandleOrderArrival() {
  const queryClient = useQueryClient();
  return useMutation(adminConfirmOrderArrival, {
    onSuccess: (data) => {
      toast.success('Order Arrived Warehouse successfully!');
      queryClient.invalidateQueries('orders_adminrole');
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

/*** 6) Handle  Deliver order after arrival  by admin */
export function useDeliverOrder() {
  const queryClient = useQueryClient();
  return useMutation(adminDeliverOrders, {
    onSuccess: () => {
      toast.success('Order Delivered successfully!');
      queryClient.invalidateQueries('orders_adminrole');
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


/*** 6) Admin get order items on an order */
export function useAdminOrderItems(orderId) {
  if (!orderId ) {
    return {};
  }
  return useQuery(['orders_items', orderId], () =>
    adminGetOrderItemsOfOrderById(orderId)
  );
}


/******
 * ==================================================
 * HANDLING OF ORDER ITEMS  STARTS HERE 
 * =====================================================
 */

/*** 1) Handle Get all order_items and cancellation statuses */
export function useAdminGetOrderItems() {
  return useQuery(['admin_orders_items'], adminGet_OrderItems);
}

/*** 2) Handle cancelled order item refunds approval by admin */
export function useHandleRefundApprovalAndPayment() {
  const queryClient = useQueryClient();
  return useMutation(adminGet_ApproveAndPayRefund, {
    onSuccess: (data) => {

      if(data?.data?.success){
        toast.success(`${data?.data?.success ? data?.data?.message : 'Refund on order item successful!'}`);
        queryClient.invalidateQueries('admin_orders_items');
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



/******
 * ==================================================
 * HANDLING OF ORDER ITEMS  ENDS HERE   
 * =====================================================
 */




