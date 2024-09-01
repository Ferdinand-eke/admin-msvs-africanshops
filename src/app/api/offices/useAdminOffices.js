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
  // createApiVendorShop,useAdminCreateVendorShop
  createApiMerchantVendorShop,
  updateApiMerchantVendorShop,
  createApiPartnerVendorShop,
  updateApiPartnerVendorShop,
  createApiCompanyVendorShop,
  updateApiCompanyVendorShop,
  createApiOfficeOutlet,
  updateApiOfficeOutlet,
  getOffices,
  getOfficeById,
} from '../apiRoutes';
import { useNavigate } from 'react-router';

export default function useAdmiManageOffices() {
  return useQuery(['__offices'], getOffices);
}

/***get single office data */
export function useSingleOfficeLocation(officeId) {
  if (!officeId || officeId === "new") {
    return "";
  }
  return useQuery(
    ['__offices', officeId],
    () => getOfficeById(officeId),
    {
      enabled: Boolean(officeId),
      // staleTime: 2000,
    }
  );
}

/**Create a new Office Outstation */
export function useAdminCreateOffice() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  return useMutation(createApiOfficeOutlet, {
    onSuccess: (data) => {
      // console.log('RegistrationResponse', data);

      if (data?.data?.savedOffice && data?.data?.success) {
        toast.success(data?.data?.message);
        // queryClient.invalidateQueries('__myshop_details');

        queryClient.invalidateQueries('__offices');
        // queryClient.refetchQueries('__myshop_products', { force: true });
        navigate('/administration/offices'); 
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

/***Update Office Details here */
export function useAdminUpdateOfficeOtlet() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  return useMutation(updateApiOfficeOutlet, {
    onSuccess: (data) => {
      if (data?.data) {
        toast.success('Shop data updated successfully');
        toast.success(
          `${data?.data?.message ? data?.data?.message : data?.message}`
        );
        // queryClient.invalidateQueries('__offices');

        queryClient.invalidateQueries('__offices');
        navigate('/administration/offices'); 
      }

      // navigate('/transaction-list'); error.message
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

/***Delete Office outlet */
export function useDeleteSingleOfficeOutlet() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(deleteLgaById, {
    onSuccess: (data) => {
      if(data?.data){
        toast.success("L.G.A deleted successfully!!");
        queryClient.invalidateQueries("__offices");
        navigate('/administrations/offices');
      }
  
    },
    onError: () => {
      toast.success(
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
      console.log('RegistrationResponse', data);
      console.log('ResponseMessage', data?.data?.message);

      if (data) {
        toast.success(data?.data?.message);
        // queryClient.invalidateQueries('__myshop_details');

        queryClient.invalidateQueries('__offices');
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
        // queryClient.invalidateQueries('__myshop_details');

        queryClient.invalidateQueries('shops');
        // queryClient.refetchQueries('__myshop_products', { force: true });
      }

      // navigate('/transaction-list'); error.message
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
