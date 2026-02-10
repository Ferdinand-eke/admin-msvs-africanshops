import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
	adminGetAllAmenitiesApi,
	adminGetSingleAmenityApi,
	adminCreateAmenityApi,
	adminUpdateAmenityApi,
	adminDeleteAmenityApi
} from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

/** ***
 * ####################################################################
 * BOOKING PROPERTY AMENITIES - React Query Hooks
 * ####################################################################
 */

/** **Get all amenities (paginated) */
export function useAdminGetAllAmenities(params = {}) {
	return useQuery(['__amenities', params], () => adminGetAllAmenitiesApi(params), {
		keepPreviousData: true,
		staleTime: 30000
	});
}

/** **Get single amenity by ID */
export function useAdminGetSingleAmenity(amenityId) {
	return useQuery(['__amenity', amenityId], () => adminGetSingleAmenityApi(amenityId), {
		enabled: Boolean(amenityId)
	});
}

/** **Create a new amenity */
export function useAdminCreateAmenity() {
	const queryClient = useQueryClient();

	return useMutation(adminCreateAmenityApi, {
		onSuccess: (data) => {
			if (data?.data) {
				toast.success(data?.data?.message || 'Amenity created successfully!');
				queryClient.invalidateQueries(['__amenities']);
				queryClient.refetchQueries('__amenities', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to create amenity' })
	});
}

/** **Update an existing amenity */
export function useAdminUpdateAmenity() {
	const queryClient = useQueryClient();

	return useMutation(adminUpdateAmenityApi, {
		onSuccess: (data) => {
			if (data?.data) {
				toast.success(data?.data?.message || 'Amenity updated successfully!');
				queryClient.invalidateQueries(['__amenities']);
				queryClient.refetchQueries('__amenities', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update amenity' })
	});
}

/** **Delete an amenity */
export function useAdminDeleteAmenity() {
	const queryClient = useQueryClient();

	return useMutation(adminDeleteAmenityApi, {
		onSuccess: (data) => {
			if (data?.data) {
				toast.success(data?.data?.message || 'Amenity deleted successfully!');
				queryClient.invalidateQueries(['__amenities']);
				queryClient.refetchQueries('__amenities', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete amenity' })
	});
}
