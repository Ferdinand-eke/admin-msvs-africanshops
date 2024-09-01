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
  adminPackOrders,
  adminShipOrders,
} from '../apiRoutes';

export default function useAdminGetOrders() {
  return useQuery(['orders_adminrole'], adminGetOrders);
}

export function useAdminFindSingleOrder(orderId) {
  return useQuery(['orders_adminrole', orderId], () =>
    adminGetOrderById(orderId)
  );
}

export function useAdminFindShopOrder(orderId) {
  return useQuery(['orders_adminrole', orderId], () =>
    adminGetOrderById(orderId)
  );
}

export function usePackOrder() {
  const queryClient = useQueryClient();
  return useMutation(adminPackOrders, {
    onSuccess: () => {
      toast.success('Order Packed successfully!');
      queryClient.invalidateQueries('orders_adminrole');
    },
    onError: (err) => {
      // toast.success('Oops!, an error occured');
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

export function useShipOrder() {
  const queryClient = useQueryClient();
  return useMutation(adminShipOrders, {
    onSuccess: () => {
      toast.success('Order Shipped successfully!');
      queryClient.invalidateQueries('orders_adminrole');
    },
    onError: (err) => {
      // toast.success('Oops!, an error occured');

      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );    },
  });
}

/***Handle for order arrival */
export function useHandleOrderArrival() {
  const queryClient = useQueryClient();
  return useMutation(adminConfirmOrderArrival, {
    onSuccess: () => {
      toast.success('Order Arrived Warehouse successfully!');
      queryClient.invalidateQueries('orders_adminrole');
    },
    onError: (err) => {
      // toast.success('Oops!, an error occured');
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

export function useDeliverOrder() {
  const queryClient = useQueryClient();
  return useMutation(adminDeliverOrders, {
    onSuccess: () => {
      toast.success('Order Delivered successfully!');
      queryClient.invalidateQueries('orders_adminrole');
    },
    onError: (err) => {
      // toast.success('Oops!, an error occured while processing request');
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
 * HANDLING OF ORDER ITEMS 
 * =====================================================
 */

export function useAdminOrderItems(orderId) {
  return useQuery(['orders_items', orderId], () =>
    adminGetOrderItemsOfOrderById(orderId)
  );
}
