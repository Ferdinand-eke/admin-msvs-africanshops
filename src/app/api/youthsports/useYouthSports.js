import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { createErrorHandler } from '../utils/errorHandler';
import {
	getYouthPrograms,
	createYouthProgram,
	updateYouthProgram,
	closeYouthProgram,
	getYouthProgramEnrollments,
	deactivateYouthEnrollment,
	reactivateYouthEnrollment,
	getYouthTournaments,
	getYouthTournamentById,
	createYouthTournament,
	updateYouthTournament,
	cancelYouthTournament,
	getYouthSpotlightsForAdmin,
	createYouthSpotlight,
	verifyYouthSpotlight
} from '../apiRoutes';

/** *
 * Youth Sports (Admin/Platform-Coordinator) — pilot for the repeatable
 * civic-vertical coordinator screen pattern. Added 2026-07-22.
 */

// ── Programs ─────────────────────────────────────────────────────────────

export function useYouthPrograms(params = {}) {
	return useQuery(['youth_programs', params], () => getYouthPrograms(params), {
		keepPreviousData: true,
		staleTime: 15000
	});
}

export function useCreateYouthProgram() {
	const queryClient = useQueryClient();
	return useMutation(createYouthProgram, {
		onSuccess: () => {
			toast.success('Program created successfully!');
			queryClient.invalidateQueries('youth_programs');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to create program' })
	});
}

export function useUpdateYouthProgram() {
	const queryClient = useQueryClient();
	return useMutation(updateYouthProgram, {
		onSuccess: () => {
			toast.success('Program updated successfully!');
			queryClient.invalidateQueries('youth_programs');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update program' })
	});
}

export function useCloseYouthProgram() {
	const queryClient = useQueryClient();
	return useMutation(closeYouthProgram, {
		onSuccess: () => {
			toast.success('Program closed to further enrollment');
			queryClient.invalidateQueries('youth_programs');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to close program' })
	});
}

export function useYouthProgramEnrollments(programId) {
	return useQuery(['youth_program_enrollments', programId], () => getYouthProgramEnrollments(programId), {
		enabled: Boolean(programId)
	});
}

export function useDeactivateYouthEnrollment() {
	const queryClient = useQueryClient();
	return useMutation(deactivateYouthEnrollment, {
		onSuccess: () => {
			toast.success('Enrollment deactivated');
			queryClient.invalidateQueries('youth_program_enrollments');
			queryClient.invalidateQueries('youth_programs');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to deactivate enrollment' })
	});
}

export function useReactivateYouthEnrollment() {
	const queryClient = useQueryClient();
	return useMutation(reactivateYouthEnrollment, {
		onSuccess: () => {
			toast.success('Enrollment reactivated');
			queryClient.invalidateQueries('youth_program_enrollments');
			queryClient.invalidateQueries('youth_programs');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to reactivate enrollment' })
	});
}

// ── Tournaments ──────────────────────────────────────────────────────────

export function useYouthTournaments(params = {}) {
	return useQuery(['youth_tournaments', params], () => getYouthTournaments(params), {
		keepPreviousData: true,
		staleTime: 15000
	});
}

export function useYouthTournamentById(id) {
	return useQuery(['youth_tournament', id], () => getYouthTournamentById(id), {
		enabled: Boolean(id)
	});
}

export function useCreateYouthTournament() {
	const queryClient = useQueryClient();
	return useMutation(createYouthTournament, {
		onSuccess: () => {
			toast.success('Tournament created successfully!');
			queryClient.invalidateQueries('youth_tournaments');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to create tournament' })
	});
}

export function useUpdateYouthTournament() {
	const queryClient = useQueryClient();
	return useMutation(updateYouthTournament, {
		onSuccess: () => {
			toast.success('Tournament updated successfully!');
			queryClient.invalidateQueries('youth_tournaments');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update tournament' })
	});
}

export function useCancelYouthTournament() {
	const queryClient = useQueryClient();
	return useMutation(cancelYouthTournament, {
		onSuccess: () => {
			toast.success('Tournament cancelled');
			queryClient.invalidateQueries('youth_tournaments');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to cancel tournament' })
	});
}

// ── Talent Spotlights ────────────────────────────────────────────────────

export function useYouthSpotlightsForAdmin(params = {}) {
	return useQuery(['youth_spotlights_admin', params], () => getYouthSpotlightsForAdmin(params), {
		keepPreviousData: true,
		staleTime: 15000
	});
}

export function useCreateYouthSpotlight() {
	const queryClient = useQueryClient();
	return useMutation(createYouthSpotlight, {
		onSuccess: () => {
			toast.success('Spotlight created successfully!');
			queryClient.invalidateQueries('youth_spotlights_admin');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to create spotlight' })
	});
}

export function useVerifyYouthSpotlight() {
	const queryClient = useQueryClient();
	return useMutation(verifyYouthSpotlight, {
		onSuccess: () => {
			toast.success('Spotlight verified and featured');
			queryClient.invalidateQueries('youth_spotlights_admin');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to verify spotlight' })
	});
}
