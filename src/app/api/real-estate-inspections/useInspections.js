import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
	adminGetAllInspections,
	adminGetSingleInspection,
	adminScheduleInspection,
	adminUpdateInspectionStatus
} from '../apiRoutes';

// Get all inspections with pagination
export default function useAdminInspections(params = {}) {
	const { limit, offset, propertyId, status, date } = params;

	return useQuery(
		['__inspections', { limit, offset, propertyId, status, date }],
		() => adminGetAllInspections({ limit, offset, propertyId, status, date }),
		{
			keepPreviousData: true,
			// Placeholder: This will work once API is implemented
			enabled: false // Disable until API is ready
		}
	);
}

// Get single inspection
export function useAdminSingleInspection(inspectionId) {
	return useQuery(['__inspection', inspectionId], () => adminGetSingleInspection(inspectionId), {
		enabled: Boolean(inspectionId) && false // Disabled until API ready
	});
}

// Schedule inspection
export function useScheduleInspection() {
	const queryClient = useQueryClient();

	return useMutation((inspectionData) => adminScheduleInspection(inspectionData), {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(data?.data?.message || 'Inspection scheduled successfully!', {
					position: 'top-left'
				});
				queryClient.invalidateQueries(['__inspections']);
			}
		},
		onError: (err) => {
			toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
		}
	});
}

// Update inspection status
export function useUpdateInspectionStatus() {
	const queryClient = useQueryClient();

	return useMutation(({ inspectionId, status, notes }) => adminUpdateInspectionStatus(inspectionId, status, notes), {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(data?.data?.message || 'Inspection status updated successfully!', {
					position: 'top-left'
				});
				queryClient.invalidateQueries(['__inspections']);
				queryClient.invalidateQueries(['__inspection']);
			}
		},
		onError: (err) => {
			toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
		}
	});
}
