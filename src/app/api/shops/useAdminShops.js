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
      if (data?.data) {
        toast.success(data?.data?.message);
        queryClient.invalidateQueries('shops');
        navigate("/vendors/listvendors");
      }

    },
    onError: (error, data) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}

/***Update Vendor Details here */
export function useAdminUpdateVendorShop() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  return useMutation(updateApiMerchantVendorShop, {
    onSuccess: (data) => {
      if (data?.data) {
        toast.success('Shop data updated successfully');
        queryClient.invalidateQueries('shops');
        navigate("/vendors/listvendors");
      }

    },
    onError: (error, data) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
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
      if (data) {
        toast.success(data?.data?.message);
        queryClient.invalidateQueries('shops');
      }

    },
    onError: (error, data) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}

/***Update Partner Vendor Details here */
export function useAdminUpdatePartnerVendorShop() {
  const queryClient = useQueryClient();

  return useMutation(updateApiPartnerVendorShop, {
    onSuccess: (data) => {

      if (data) {
        toast.success('Partner Shop data updated successfully');
        queryClient.invalidateQueries('shops');
      }

    },
    onError: (error, data) => {
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
      if (data) {
        toast.success('Company Shop added successfully');
        queryClient.invalidateQueries('shops');
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

/***Update Company Vendor Details here */
export function useAdminUpdateCompanyVendorShop() {
  const queryClient = useQueryClient();

  return useMutation(updateApiCompanyVendorShop, {
    onSuccess: (data) => {
      if (data) {
        toast.success('Company Shop data updated successfully');
        queryClient.invalidateQueries('shops');
      }
    },
    onError: (error, data) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}





