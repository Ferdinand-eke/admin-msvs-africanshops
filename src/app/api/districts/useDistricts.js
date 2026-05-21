import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { createErrorHandler } from '../utils/errorHandler';
import {
	createDistrictShippingTable,
	deleteDistrictShippingTableById,
	getDistrictByIdAdmin,
	getDistrictsByAdmin,
	getDistrictsByLgaAdmin,
	getDistrictShippingTableRecord,
	getDistrictsWithShippingTable,
	updateDistrictShippingTableById
} from '../apiRoutes';

export default function useDistricts({ limit = 20, offset = 0 } = {}) {
	return useQuery(['districts', { limit, offset }], () => getDistrictsByAdmin({ limit, offset }), {
		keepPreviousData: true,
		staleTime: 30000
	});
}

export function useDistrictsByLga(lgaId, { limit = 20, offset = 0 } = {}) {
	return useQuery(
		['districts_by_lga', lgaId, { limit, offset }],
		() => getDistrictsByLgaAdmin({ lgaId, limit, offset }),
		{
			enabled: Boolean(lgaId) && lgaId !== 'new',
			keepPreviousData: true,
			staleTime: 30000
		}
	);
}

export function useSingleDistrict(districtId) {
	return useQuery(['districts', districtId], () => getDistrictByIdAdmin(districtId), {
		enabled: Boolean(districtId) && districtId !== 'new',
		staleTime: 30000
	});
}

/** ***
 * #####################################################################
 * HANDLE DISTRICT SHIPPING-ROUTES-TABLE STARTS
 * #####################################################################
 */

export function useDistrictsWithShippingTable(lgaId) {
	return useQuery(
		['__districts_shippingtables', lgaId],
		() => getDistrictsWithShippingTable(lgaId),
		{
			enabled: Boolean(lgaId),
			staleTime: 30000
		}
	);
}

export function useDistrictFullRecord(districtId) {
	return useQuery(['district_full', districtId], () => getDistrictShippingTableRecord(districtId), {
		enabled: Boolean(districtId) && districtId !== 'new',
		staleTime: 30000
	});
}

function handleDistrictShippingError(error, defaultMessage) {
	if (!error?.validationErrors) {
		createErrorHandler({ defaultMessage })(error);
	}
}

export function useDistrictAddShippingTableMutation() {
	const queryClient = useQueryClient();

	return useMutation(createDistrictShippingTable, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('District shipping route added successfully!');
				queryClient.invalidateQueries(['district_full']);
				queryClient.invalidateQueries('__districts_shippingtables');
			}
		},
		onError: (error) => handleDistrictShippingError(error, 'Failed to add district shipping route')
	});
}

export function useDistrictUpdateShippingMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateDistrictShippingTableById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('District shipping route updated successfully!');
				queryClient.invalidateQueries(['district_full']);
				queryClient.invalidateQueries('__districts_shippingtables');
			}
		},
		onError: (error) => handleDistrictShippingError(error, 'Failed to update district shipping route')
	});
}

export function useDistrictDeleteShippingMutation() {
	const queryClient = useQueryClient();

	return useMutation(deleteDistrictShippingTableById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('District shipping route removed successfully!');
				queryClient.invalidateQueries(['district_full']);
				queryClient.invalidateQueries('__districts_shippingtables');
			}
		},
		onError: (error) => handleDistrictShippingError(error, 'Failed to delete district shipping route')
	});
}

/** ***
 * #####################################################################
 * HANDLE DISTRICT SHIPPING-ROUTES-TABLE ENDS
 * #####################################################################
 */
