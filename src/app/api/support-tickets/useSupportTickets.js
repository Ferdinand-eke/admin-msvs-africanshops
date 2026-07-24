import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
	adminGetSupportTicketDetail,
	adminListSupportTickets,
	adminReplySupportTicket,
	adminSetSupportTicketStatus
} from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

/**
 * Admin support-ticket triage (2026-07-24) — see Admin Web App tracker item
 * 14. Plain fetch/refetch thread, no real-time chat, no AI-chatbot
 * resolution.
 */
export function useAdminSupportTickets({ page = 1, limit = 20, status, category } = {}) {
	return useQuery(
		['admin_support_tickets', { page, limit, status, category }],
		() => adminListSupportTickets({ page, limit, status, category }),
		{ keepPreviousData: true, staleTime: 15000 }
	);
}

export function useAdminSupportTicketDetail(ticketId) {
	return useQuery(['admin_support_ticket', ticketId], () => adminGetSupportTicketDetail(ticketId), {
		enabled: Boolean(ticketId)
	});
}

export function useAdminReplySupportTicket() {
	const queryClient = useQueryClient();

	return useMutation(({ ticketId, body }) => adminReplySupportTicket(ticketId, body), {
		onSuccess: (_data, variables) => {
			toast.success('Reply sent.');
			queryClient.invalidateQueries(['admin_support_ticket', variables.ticketId]);
			queryClient.invalidateQueries('admin_support_tickets');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to send reply' })
	});
}

export function useAdminSetSupportTicketStatus() {
	const queryClient = useQueryClient();

	return useMutation(({ ticketId, status }) => adminSetSupportTicketStatus(ticketId, status), {
		onSuccess: (_data, variables) => {
			toast.success(`Ticket marked ${variables.status}.`);
			queryClient.invalidateQueries(['admin_support_ticket', variables.ticketId]);
			queryClient.invalidateQueries('admin_support_tickets');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update ticket status' })
	});
}
