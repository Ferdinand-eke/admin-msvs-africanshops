import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo, useState } from 'react';
import Chip from '@mui/material/Chip';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

/**
 * BudgetDetailsWidget - Shows recent transactions with filtering and pagination
 * TODO: Replace placeholder data with actual API call when endpoint is ready
 */
function BudgetDetailsWidget() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [searchQuery, setSearchQuery] = useState('');

	// Placeholder data - replace with actual API call
	const transactions = [
		{ id: 'TXN-2401', date: '2024-02-01 14:23', service: 'Marketplace', type: 'Sale', merchant: 'TechStore Ltd', amount: 15420, status: 'completed' },
		{ id: 'TXN-2402', date: '2024-02-01 14:18', service: 'Bookings', type: 'Booking', merchant: 'Safari Lodge', amount: 28560, status: 'completed' },
		{ id: 'TXN-2403', date: '2024-02-01 14:12', service: 'Marketplace', type: 'Sale', merchant: 'Fashion Hub', amount: 8750, status: 'pending' },
		{ id: 'TXN-2404', date: '2024-02-01 14:05', service: 'Tradehub', type: 'Logistics', merchant: 'Express Delivery', amount: 3420, status: 'completed' },
		{ id: 'TXN-2405', date: '2024-02-01 13:58', service: 'Estates', type: 'Listing', merchant: 'Prime Properties', amount: 125000, status: 'completed' },
		{ id: 'TXN-2406', date: '2024-02-01 13:45', service: 'Marketplace', type: 'Sale', merchant: 'Electronics Plus', amount: 42300, status: 'completed' },
		{ id: 'TXN-2407', date: '2024-02-01 13:32', service: 'Bookings', type: 'Booking', merchant: 'City Hotel', amount: 18900, status: 'refunded' },
		{ id: 'TXN-2408', date: '2024-02-01 13:21', service: 'Marketplace', type: 'Sale', merchant: 'Home Decor', amount: 6780, status: 'completed' },
		{ id: 'TXN-2409', date: '2024-02-01 13:15', service: 'Tradehub', type: 'Logistics', merchant: 'FastTrack Cargo', amount: 5240, status: 'pending' },
		{ id: 'TXN-2410', date: '2024-02-01 13:08', service: 'Estates', type: 'Rental', merchant: 'Urban Spaces', amount: 67500, status: 'completed' },
		{ id: 'TXN-2411', date: '2024-02-01 12:58', service: 'Marketplace', type: 'Sale', merchant: 'Sports Gear', amount: 12450, status: 'completed' },
		{ id: 'TXN-2412', date: '2024-02-01 12:45', service: 'Bookings', type: 'Booking', merchant: 'Beach Resort', amount: 34200, status: 'completed' },
		{ id: 'TXN-2413', date: '2024-02-01 12:32', service: 'Marketplace', type: 'Sale', merchant: 'Beauty Store', amount: 8960, status: 'failed' },
		{ id: 'TXN-2414', date: '2024-02-01 12:18', service: 'Tradehub', type: 'Logistics', merchant: 'Quick Ship', amount: 4120, status: 'completed' },
		{ id: 'TXN-2415', date: '2024-02-01 12:05', service: 'Marketplace', type: 'Sale', merchant: 'Book Haven', amount: 5670, status: 'completed' }
	];

	const getStatusColor = (status) => {
		switch (status) {
			case 'completed':
				return 'success';
			case 'pending':
				return 'warning';
			case 'failed':
				return 'error';
			case 'refunded':
				return 'info';
			default:
				return 'default';
		}
	};

	const formatCurrency = (amount) => {
		return `$${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	};

	const handleChangePage = (_event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const filteredTransactions = transactions.filter(
		(txn) =>
			txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			txn.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
			txn.service.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between mb-16">
				<div className="flex items-center">
					<FuseSvgIcon className="text-primary" size={20}>heroicons-outline:document-text</FuseSvgIcon>
					<Typography className="ml-8 text-lg font-medium tracking-tight leading-6">
						Recent Transactions
					</Typography>
				</div>
				<div className="flex items-center space-x-8">
					<TextField
						placeholder="Search transactions..."
						variant="outlined"
						size="small"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>heroicons-solid:search</FuseSvgIcon>
								</InputAdornment>
							)
						}}
						className="w-256"
					/>
					<Button
						variant="outlined"
						color="secondary"
						size="small"
						startIcon={<FuseSvgIcon size={16}>heroicons-outline:download</FuseSvgIcon>}
					>
						Export
					</Button>
				</div>
			</div>

			<div className="table-responsive overflow-auto">
				<Table className="w-full min-w-full">
					<TableHead>
						<TableRow>
							<TableCell>
								<Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
									Transaction ID
								</Typography>
							</TableCell>
							<TableCell>
								<Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
									Date & Time
								</Typography>
							</TableCell>
							<TableCell>
								<Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
									Service
								</Typography>
							</TableCell>
							<TableCell>
								<Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
									Type
								</Typography>
							</TableCell>
							<TableCell>
								<Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
									Merchant
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
									Amount
								</Typography>
							</TableCell>
							<TableCell>
								<Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
									Status
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((txn) => (
							<TableRow key={txn.id} hover className="cursor-pointer">
								<TableCell>
									<Typography className="text-sm font-medium">{txn.id}</Typography>
								</TableCell>
								<TableCell>
									<Typography className="text-sm">{txn.date}</Typography>
								</TableCell>
								<TableCell>
									<Chip label={txn.service} size="small" variant="outlined" />
								</TableCell>
								<TableCell>
									<Typography className="text-sm">{txn.type}</Typography>
								</TableCell>
								<TableCell>
									<Typography className="text-sm">{txn.merchant}</Typography>
								</TableCell>
								<TableCell align="right">
									<Typography className="text-sm font-semibold">{formatCurrency(txn.amount)}</Typography>
								</TableCell>
								<TableCell>
									<Chip label={txn.status.toUpperCase()} size="small" color={getStatusColor(txn.status)} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<TablePagination
				component="div"
				count={filteredTransactions.length}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				rowsPerPageOptions={[5, 10, 25, 50]}
			/>
		</Paper>
	);
}

export default memo(BudgetDetailsWidget);
