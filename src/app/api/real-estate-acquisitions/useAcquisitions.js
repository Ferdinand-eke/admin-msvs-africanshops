import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
	adminGetAllAcquisitions,
	adminGetSingleAcquisition,
	adminVerifyAcquisitionPayment,
	adminRejectAcquisitionPayment,
	adminVerifyAcquisitionDocuments,
	adminRejectAcquisitionDocuments,
	adminCompleteAcquisition,
	adminCancelAcquisition
} from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

// Get all acquisitions with pagination
export default function useAdminAcquisitions(params = {}) {
	const { limit, offset, status } = params;

	return useQuery(
		['__acquisitions', { limit, offset, status }],
		() => adminGetAllAcquisitions({ limit, offset, status }),
		{
			keepPreviousData: true
		}
	);
}

// Get single acquisition
export function useAdminSingleAcquisition(acquisitionId) {
	return useQuery(['__acquisition', acquisitionId], () => adminGetSingleAcquisition(acquisitionId), {
		enabled: Boolean(acquisitionId)
	});
}

// Verify payment mutation
export function useVerifyAcquisitionPayment() {
	const queryClient = useQueryClient();

	return useMutation(({ acquisitionId, adminNotes }) => adminVerifyAcquisitionPayment(acquisitionId, adminNotes), {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(data?.data?.message || 'Payment verified successfully!', {
					position: 'top-left'
				});
				queryClient.invalidateQueries(['__acquisitions']);
				queryClient.invalidateQueries(['__acquisition']);
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to verify payment' })
	});
}

// Reject payment mutation
export function useRejectAcquisitionPayment() {
	const queryClient = useQueryClient();

	return useMutation(
		({ acquisitionId, rejectionReason }) => adminRejectAcquisitionPayment(acquisitionId, rejectionReason),
		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success(data?.data?.message || 'Payment rejected successfully!', {
						position: 'top-left'
					});
					queryClient.invalidateQueries(['__acquisitions']);
					queryClient.invalidateQueries(['__acquisition']);
				}
			},
			onError: createErrorHandler({ defaultMessage: 'Failed to reject payment' })
		}
	);
}

// Verify documents mutation
export function useVerifyAcquisitionDocuments() {
	const queryClient = useQueryClient();

	return useMutation(({ acquisitionId, adminNotes }) => adminVerifyAcquisitionDocuments(acquisitionId, adminNotes), {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(data?.data?.message || 'Documents verified successfully!', {
					position: 'top-left'
				});
				queryClient.invalidateQueries(['__acquisitions']);
				queryClient.invalidateQueries(['__acquisition']);
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to process request' })
	});
}

// Reject documents mutation
export function useRejectAcquisitionDocuments() {
	const queryClient = useQueryClient();

	return useMutation(
		({ acquisitionId, rejectionReason }) => adminRejectAcquisitionDocuments(acquisitionId, rejectionReason),
		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success(data?.data?.message || 'Documents rejected successfully!', {
						position: 'top-left'
					});
					queryClient.invalidateQueries(['__acquisitions']);
					queryClient.invalidateQueries(['__acquisition']);
				}
			},
			onError: (err) => {
				toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
			}
		}
	);
}

// Complete acquisition mutation
export function useCompleteAcquisition() {
	const queryClient = useQueryClient();

	return useMutation(({ acquisitionId, adminNotes }) => adminCompleteAcquisition(acquisitionId, adminNotes), {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(data?.data?.message || 'Acquisition completed successfully!', {
					position: 'top-left'
				});
				queryClient.invalidateQueries(['__acquisitions']);
				queryClient.invalidateQueries(['__acquisition']);
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to process request' })
	});
}

// Cancel acquisition mutation
export function useCancelAcquisition() {
	const queryClient = useQueryClient();

	return useMutation(
		({ acquisitionId, cancellationReason }) => adminCancelAcquisition(acquisitionId, cancellationReason),
		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success(data?.data?.message || 'Acquisition cancelled successfully!', {
						position: 'top-left'
					});
					queryClient.invalidateQueries(['__acquisitions']);
					queryClient.invalidateQueries(['__acquisition']);
				}
			},
			onError: (err) => {
				toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
			}
		}
	);
}
