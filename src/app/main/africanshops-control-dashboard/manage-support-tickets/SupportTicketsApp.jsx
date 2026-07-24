import { useMemo, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DataTable from 'app/shared-components/data-table/DataTable';
import {
	useAdminReplySupportTicket,
	useAdminSetSupportTicketStatus,
	useAdminSupportTicketDetail,
	useAdminSupportTickets
} from 'src/app/api/support-tickets/useSupportTickets';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const CATEGORIES = ['ORDER_ISSUE', 'PAYMENT', 'ACCOUNT', 'OTHER'];
const STATUS_COLOR = {
	OPEN: 'warning',
	IN_PROGRESS: 'info',
	RESOLVED: 'success',
	CLOSED: 'default'
};

function StatusChip({ status }) {
	return (
		<Chip
			size="small"
			label={status}
			color={STATUS_COLOR[status] || 'default'}
		/>
	);
}

/**
 * Ticket triage dialog — thread view, reply box, status control. Plain
 * fetch/refetch, no real-time chat, no AI-chatbot resolution (both
 * explicitly deferred to a post-launch pass).
 */
function TicketDialog({ ticketId, onClose }) {
	const [reply, setReply] = useState('');
	const { data, isLoading } = useAdminSupportTicketDetail(ticketId);
	const replyMutation = useAdminReplySupportTicket();
	const statusMutation = useAdminSetSupportTicketStatus();

	const ticket = data?.data;

	function handleSendReply() {
		if (!reply.trim()) return;

		replyMutation.mutate({ ticketId, body: reply }, { onSuccess: () => setReply('') });
	}

	function handleStatusChange(e) {
		statusMutation.mutate({ ticketId, status: e.target.value });
	}

	return (
		<Dialog
			open={Boolean(ticketId)}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
		>
			{isLoading || !ticket ? (
				<DialogContent>
					<FuseLoading />
				</DialogContent>
			) : (
				<>
					<DialogTitle className="flex items-center justify-between gap-16">
						<span>{ticket.subject}</span>
						<FormControl size="small">
							<Select
								value={ticket.status}
								onChange={handleStatusChange}
								disabled={statusMutation.isLoading}
							>
								{STATUSES.map((s) => (
									<MenuItem
										key={s}
										value={s}
									>
										{s}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</DialogTitle>
					<DialogContent className="flex flex-col gap-16">
						<div>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Submitted by
							</Typography>
							<Typography>
								{ticket.submitterName} ({ticket.submitterEmail}) — {ticket.submitterType}
							</Typography>
						</div>
						{ticket.category && (
							<div>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Category
								</Typography>
								<Typography>{ticket.category}</Typography>
							</div>
						)}

						<Box className="flex flex-col gap-12 max-h-320 overflow-y-auto p-8 border rounded">
							{(ticket.messages ?? []).map((message) => (
								<Box
									key={message.id}
									className={`flex flex-col max-w-[85%] ${
										message.senderType === 'ADMIN' ? 'self-end items-end' : 'self-start'
									}`}
								>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										{message.senderName} ({message.senderType}) ·{' '}
										{new Date(message.createdAt).toLocaleString()}
									</Typography>
									<Box
										className={`mt-4 p-8 rounded-lg ${
											message.senderType === 'ADMIN' ? 'bg-blue-50' : 'bg-grey-100'
										}`}
									>
										<Typography className="whitespace-pre-wrap">{message.body}</Typography>
									</Box>
								</Box>
							))}
						</Box>

						<TextField
							label="Reply"
							fullWidth
							multiline
							minRows={2}
							value={reply}
							onChange={(e) => setReply(e.target.value)}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={onClose}>Close</Button>
						<Button
							variant="contained"
							color="secondary"
							disabled={!reply.trim() || replyMutation.isLoading}
							onClick={handleSendReply}
						>
							Send Reply
						</Button>
					</DialogActions>
				</>
			)}
		</Dialog>
	);
}

function TriageActionCell({ row, table }) {
	return (
		<Button
			size="small"
			variant="outlined"
			onClick={() => table.options.meta.onOpen(row.original.id)}
		>
			Open
		</Button>
	);
}

function SupportTicketsApp() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [status, setStatus] = useState('');
	const [category, setCategory] = useState('');
	const [openTicketId, setOpenTicketId] = useState(null);

	const { data, isLoading, isFetching } = useAdminSupportTickets({
		page: page + 1,
		limit: rowsPerPage,
		status: status || undefined,
		category: category || undefined
	});

	const items = useMemo(() => data?.data?.items ?? [], [data]);
	const total = useMemo(() => data?.data?.total ?? 0, [data]);

	const columns = useMemo(
		() => [
			{ accessorKey: 'subject', header: 'Subject', size: 220 },
			{ accessorKey: 'submitterName', header: 'From', size: 160 },
			{ accessorKey: 'submitterType', header: 'Type', size: 100 },
			{ accessorFn: (row) => row.category || '—', id: 'category', header: 'Category', size: 130 },
			{
				id: 'status',
				header: 'Status',
				size: 130,
				Cell: ({ row }) => <StatusChip status={row.original.status} />
			},
			{
				accessorFn: (row) => new Date(row.updatedAt).toLocaleString(),
				id: 'updatedAt',
				header: 'Last Updated',
				size: 180
			},
			{
				id: 'actions',
				header: 'Actions',
				size: 100,
				enableSorting: false,
				Cell: TriageActionCell
			}
		],
		[]
	);

	if (isLoading) return <FuseLoading />;

	return (
		<Root
			header={
				<div className="flex flex-1 w-full flex-col sm:flex-row sm:items-center sm:justify-between py-8 sm:py-16 px-16 md:px-24 gap-16">
					<div>
						<Typography className="text-24 md:text-32 font-extrabold tracking-tight">
							Support Tickets
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							Real user/merchant support requests — plain fetch/refetch thread, no live chat yet.
						</Typography>
					</div>
					<div className="flex gap-12">
						<FormControl
							size="small"
							className="min-w-136"
						>
							<InputLabel>Status</InputLabel>
							<Select
								label="Status"
								value={status}
								onChange={(e) => {
									setStatus(e.target.value);
									setPage(0);
								}}
							>
								<MenuItem value="">All</MenuItem>
								{STATUSES.map((s) => (
									<MenuItem
										key={s}
										value={s}
									>
										{s}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl
							size="small"
							className="min-w-136"
						>
							<InputLabel>Category</InputLabel>
							<Select
								label="Category"
								value={category}
								onChange={(e) => {
									setCategory(e.target.value);
									setPage(0);
								}}
							>
								<MenuItem value="">All</MenuItem>
								{CATEGORIES.map((c) => (
									<MenuItem
										key={c}
										value={c}
									>
										{c}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
				</div>
			}
			content={
				<div className="w-full p-12 pt-16 sm:pt-24">
					<DataTable
						data={items}
						columns={columns}
						manualPagination
						rowCount={total}
						pageCount={Math.ceil(total / rowsPerPage) || 1}
						onPaginationChange={(updater) => {
							const next =
								typeof updater === 'function'
									? updater({ pageIndex: page, pageSize: rowsPerPage })
									: updater;

							if (next.pageIndex !== page) setPage(next.pageIndex);

							if (next.pageSize !== rowsPerPage) setRowsPerPage(next.pageSize);
						}}
						state={{ pagination: { pageIndex: page, pageSize: rowsPerPage }, isLoading: isFetching }}
						initialState={{ pagination: { pageIndex: 0, pageSize: 20 } }}
						meta={{ onOpen: setOpenTicketId }}
					/>

					<TicketDialog
						ticketId={openTicketId}
						onClose={() => setOpenTicketId(null)}
					/>
				</div>
			}
		/>
	);
}

export default SupportTicketsApp;
