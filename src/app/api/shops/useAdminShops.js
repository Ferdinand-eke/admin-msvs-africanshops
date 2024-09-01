import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  createMarket,
  createShopPlan,
  getMarketById,
  getMarkets,
  getShopPlanById,
  getShopPlans,
  getShops,
  updateMarketById,
  updateShopPlanById,
  // createApiVendorShop,
  createApiMerchantVendorShop,
  updateApiMerchantVendorShop,
  createApiPartnerVendorShop,
  updateApiPartnerVendorShop,
  createApiCompanyVendorShop,
  updateApiCompanyVendorShop,
  getShopById,
  deleteShopById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useAdmiManageShop() {
  return useQuery(['shops'], getShops);
}


/****
 * 
 * Delete an operational shop
 * on request
 * 
 */
export function useDeleteShop() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteShopById, {
    onSuccess: (data) => {
      if(data?.data && data?.data?.success){
        toast.success("shop deleted successfully!!");
        queryClient.invalidateQueries("shopplans");
        queryClient.refetchQueries('shopplans', { force: true });
        navigate('/vendors/listvendors');
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



/****get single shop plan !productId || productId === 'new' */
export function useSingleShop(shopId) {

  if(!shopId || shopId === 'new'){
    return {}
  }
  return useQuery(
    ['shops', shopId],
    () => getShopById(shopId),
    {
      enabled: Boolean(shopId),
      // staleTime: 2000,
    }
  );
}

/**Create a new Shop Vendor */
export function useAdminCreateVendorShop() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  return useMutation(createApiMerchantVendorShop, {
    onSuccess: (data) => {
      console.log('createShopRes', data);
      console.log('createShopMessage', data?.data?.message);

      if (data?.data) {
        toast.success(data?.data?.message);
        queryClient.invalidateQueries('shops');
        navigate("/vendors/listvendors");
      }

    },
    onError: (error, data) => {
      console.log(
        'MuTationError 11',
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

/***Update Vendor Details here */
export function useAdminUpdateVendorShop() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  return useMutation(updateApiMerchantVendorShop, {
    onSuccess: (data) => {
      console.log('updateShopnResponse', data);
      console.log('updateShopMessage', data?.data?.message);

      if (data?.data) {
        toast.success('Shop data updated successfully');

        queryClient.invalidateQueries('shops');
        navigate("/vendors/listvendors");
      }

      // navigate('/transaction-list'); error.message
    },
    onError: (error, data) => {
      console.log(
        'MuTationError 11',
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      console.log('MuTationError', error);
      console.log('MuTationErrorMessage', error.message);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

/***
 * MANAGE PARTNERS SHOP  STARTS HERE
 */

/**Create a new Partner Shop  */
export function useAdminCreatePartnerVendorShop() {
  const queryClient = useQueryClient();

  return useMutation(createApiPartnerVendorShop, {
    onSuccess: (data) => {
      console.log('RegistrationResponse', data);
      console.log('ResponseMessage', data?.data?.message);

      if (data) {
        toast.success(data?.data?.message);
        // queryClient.invalidateQueries('__myshop_details');

        queryClient.invalidateQueries('shops');
        // queryClient.refetchQueries('__myshop_products', { force: true });
      }

      // navigate('/transaction-list'); error.message
    },
    onError: (error, data) => {
      console.log(
        'MuTationError 11',
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      console.log('MuTationError', error);
      console.log('MuTationErrorMessage', error.message);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

/***Update Partner Vendor Details here */
export function useAdminUpdatePartnerVendorShop() {
  const queryClient = useQueryClient();

  return useMutation(updateApiPartnerVendorShop, {
    onSuccess: (data) => {
      console.log('PartnetUpdateResponse', data);
      console.log('ResponseMessage', data?.data?.message);

      if (data) {
        toast.success('Partner Shop data updated successfully');
        // queryClient.invalidateQueries('__myshop_details');

        queryClient.invalidateQueries('shops');
        // queryClient.refetchQueries('__myshop_products', { force: true });
      }

      // navigate('/transaction-list'); error.message
    },
    onError: (error, data) => {
      console.log(
        'PartnerMuTationError 11',
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      console.log('PartnerMuTationError', error);
      console.log('PartnerMuTationErrorMessage', error.message);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}
/***
 * MANAGE PARTNERS SHOP  ENDS HERE
 */

/***
 * MANAGE COMPANY SHOPs  STARTS HERE
 */

/**Create a new Company Shop  createApiCompanyVendorShop */
export function useAdminCreateCompanyVendorShop() {
  const queryClient = useQueryClient();

  return useMutation(createApiCompanyVendorShop, {
    onSuccess: (data) => {
      console.log('Company_RegistrationResponse', data);
      // console.log('ResponseMessage', data?.data?.message);

      if (data) {
        toast.success('Company Shop added successfully');
        // queryClient.invalidateQueries('__myshop_details');

        queryClient.invalidateQueries('shops');
        // queryClient.refetchQueries('__myshop_products', { force: true });
      }

      // navigate('/transaction-list'); error.message
    },
    onError: (error) => {
      console.log(
        'MuTationError 11',
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      console.log('MuTationError', error);
      console.log('MuTationErrorMessage', error.message);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

/***Update Company Vendor Details here */
export function useAdminUpdateCompanyVendorShop() {
  const queryClient = useQueryClient();

  return useMutation(updateApiCompanyVendorShop, {
    onSuccess: (data) => {
      console.log('Company_UpdateResponse', data);

      if (data) {
        toast.success('Company Shop data updated successfully');
        queryClient.invalidateQueries('shops');
      }
    },
    onError: (error, data) => {
      console.log(
        'Company_MuTationError 11',
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      console.log('Company_MuTationError', error);
      console.log('Company_MuTationErrorMessage', error.message);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}





