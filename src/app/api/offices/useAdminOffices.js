import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import {
	createApiPartnerVendorShop,
	updateApiPartnerVendorShop,
	createApiCompanyVendorShop,
	updateApiCompanyVendorShop,
	createApiOfficeOutlet,
	updateApiOfficeOutlet,
	getOffices,
	getOfficeById,
	deleteOfficeById
} from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

export default function useAdmiManageOffices() {
	return useQuery(['__offices'], getOffices);
}

/** *get single office data */
export function useSingleOfficeLocation(officeId) {
	if (!officeId || officeId === 'new') {
		return '';
	}

	return useQuery(['__offices', officeId], () => getOfficeById(officeId), {
		enabled: Boolean(officeId)
		// staleTime: 2000,
	});
}

/** Create a new Office Outstation */
export function useAdminCreateOffice() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(createApiOfficeOutlet, {
		onSuccess: (data) => {
			if (data?.data?.savedOffice && data?.data?.success) {
				toast.success(data?.data?.message);
				queryClient.invalidateQueries('__offices');
				navigate('/administration/offices');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to create office' })
	});
}

/** *Update Office Details here */
export function useAdminUpdateOfficeOtlet() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(updateApiOfficeOutlet, {
		onSuccess: (data) => {
			if (data?.data) {
				toast.success('Office data updated successfully');
				// toast.success(
				//   `${data?.data?.message ? data?.data?.message : data?.message}`
				// );

				queryClient.invalidateQueries('__offices');
				navigate('/administrations/offices');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update office' })
	});
}

/** *Delete Office outlet */
export function useDeleteSingleOfficeOutlet() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteOfficeById, {
		onSuccess: (data) => {
			if (data?.data) {
				toast.success('Office deleted successfully!!');
				queryClient.invalidateQueries('__offices');
				navigate('/administrations/offices');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete office' })
	});
}

/** *
 * MANAGE PARTNERS SHOP  STARTS HERE
 */

/** Create a new Partner Shop  */
export function useAdminCreatePartnerVendorShop() {
	const queryClient = useQueryClient();

	return useMutation(createApiPartnerVendorShop, {
		onSuccess: (data) => {
			if (data) {
				toast.success(data?.data?.message);
				queryClient.invalidateQueries('__offices');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to create partner shop' })
	});
}

/** *Update Partner Vendor Details here */
export function useAdminUpdatePartnerVendorShop() {
	const queryClient = useQueryClient();

	return useMutation(updateApiPartnerVendorShop, {
		onSuccess: (data) => {
			if (data) {
				toast.success('Partner Shop data updated successfully');
				queryClient.invalidateQueries('shops');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update partner shop' })
	});
}

/** *
 * MANAGE PARTNERS SHOP  ENDS HERE
 */

/** *
 * MANAGE COMPANY SHOPs  STARTS HERE
 */

/** Create a new Company Shop  createApiCompanyVendorShop */
export function useAdminCreateCompanyVendorShop() {
	const queryClient = useQueryClient();

	return useMutation(createApiCompanyVendorShop, {
		onSuccess: (data) => {
			if (data) {
				toast.success('Company Shop added successfully');
				queryClient.invalidateQueries('shops');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to create company shop' })
	});
}

/** *Update Company Vendor Details here */
export function useAdminUpdateCompanyVendorShop() {
	const queryClient = useQueryClient();

	return useMutation(updateApiCompanyVendorShop, {
		onSuccess: (data) => {
			if (data) {
				toast.success('Company Shop data updated successfully');

				queryClient.invalidateQueries('shops');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update company shop' })
	});
}
