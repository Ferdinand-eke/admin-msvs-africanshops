import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';

/**
 * The ScheduleWidget - Shows top 20 support tickets
 * TODO: Replace placeholder data with actual API call when endpoint is ready
 */
function ScheduleWidget() {
	// Placeholder data - replace with actual API call
	const supportTickets = [
		{ id: 'TKT-1245', title: 'Payment gateway timeout issue', priority: 'high', service: 'Marketplace', timestamp: '2 hours ago' },
		{ id: 'TKT-1244', title: 'Unable to upload product images', priority: 'medium', service: 'Marketplace', timestamp: '3 hours ago' },
		{ id: 'TKT-1243', title: 'Booking confirmation email not received', priority: 'high', service: 'Bookings', timestamp: '4 hours ago' },
		{ id: 'TKT-1242', title: 'Order tracking not updating', priority: 'low', service: 'Tradehub', timestamp: '5 hours ago' },
		{ id: 'TKT-1241', title: 'Property listing not visible', priority: 'critical', service: 'Estates', timestamp: '6 hours ago' },
		{ id: 'TKT-1240', title: 'Shipping address cannot be changed', priority: 'medium', service: 'Marketplace', timestamp: '7 hours ago' },
		{ id: 'TKT-1239', title: 'Refund request pending review', priority: 'high', service: 'Marketplace', timestamp: '8 hours ago' },
		{ id: 'TKT-1238', title: 'Merchant dashboard access denied', priority: 'critical', service: 'Marketplace', timestamp: '9 hours ago' },
		{ id: 'TKT-1237', title: 'Check-in date conflict on booking', priority: 'medium', service: 'Bookings', timestamp: '10 hours ago' },
		{ id: 'TKT-1236', title: 'Product category missing', priority: 'low', service: 'Marketplace', timestamp: '11 hours ago' },
		{ id: 'TKT-1235', title: 'Delivery route optimization issue', priority: 'medium', service: 'Tradehub', timestamp: '12 hours ago' },
		{ id: 'TKT-1234', title: 'User account locked after password reset', priority: 'high', service: 'Marketplace', timestamp: '13 hours ago' },
		{ id: 'TKT-1233', title: 'Estate amenities not showing', priority: 'low', service: 'Estates', timestamp: '14 hours ago' },
		{ id: 'TKT-1232', title: 'Bulk order discount not applied', priority: 'medium', service: 'Marketplace', timestamp: '15 hours ago' },
		{ id: 'TKT-1231', title: 'Mobile app login error', priority: 'critical', service: 'Marketplace', timestamp: '16 hours ago' },
		{ id: 'TKT-1230', title: 'Booking cancellation fee dispute', priority: 'high', service: 'Bookings', timestamp: '17 hours ago' },
		{ id: 'TKT-1229', title: 'Inventory count mismatch', priority: 'medium', service: 'Tradehub', timestamp: '18 hours ago' },
		{ id: 'TKT-1228', title: 'Property search filters not working', priority: 'low', service: 'Estates', timestamp: '19 hours ago' },
		{ id: 'TKT-1227', title: 'Vendor payout delayed', priority: 'critical', service: 'Marketplace', timestamp: '20 hours ago' },
		{ id: 'TKT-1226', title: 'Customer review submission failed', priority: 'low', service: 'Marketplace', timestamp: '21 hours ago' }
	];

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'critical':
				return 'error';
			case 'high':
				return 'warning';
			case 'medium':
				return 'info';
			default:
				return 'default';
		}
	};

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden h-full">
			<div className="flex items-center justify-between mb-16">
				<div className="flex items-center">
					<FuseSvgIcon className="text-error" size={20}>heroicons-outline:ticket</FuseSvgIcon>
					<Typography className="ml-8 text-lg font-medium tracking-tight leading-6">
						Recent Support Tickets
					</Typography>
				</div>
				<Button
					component={Link}
					to="/support"
					size="small"
					variant="outlined"
					color="secondary"
					endIcon={<FuseSvgIcon size={16}>heroicons-outline:arrow-right</FuseSvgIcon>}
				>
					View All
				</Button>
			</div>

			<List className="py-0 overflow-auto" style={{ maxHeight: '400px' }}>
				{supportTickets.map((ticket) => (
					<ListItem
						key={ticket.id}
						className="px-0 py-12 border-b border-divider hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
					>
						<ListItemText
							classes={{ root: 'px-8' }}
							primary={
								<div className="flex items-center justify-between">
									<Typography className="font-medium text-sm truncate max-w-xs">
										{ticket.title}
									</Typography>
									<Chip
										label={ticket.priority.toUpperCase()}
										size="small"
										color={getPriorityColor(ticket.priority)}
										className="ml-8"
									/>
								</div>
							}
							secondary={
								<div className="flex items-center mt-4 space-x-8">
									<span className="flex items-center">
										<FuseSvgIcon size={14} color="disabled">
											heroicons-solid:hashtag
										</FuseSvgIcon>
										<Typography component="span" className="mx-4 text-xs" color="text.secondary">
											{ticket.id}
										</Typography>
									</span>
									<span className="flex items-center">
										<FuseSvgIcon size={14} color="disabled">
											heroicons-solid:tag
										</FuseSvgIcon>
										<Typography component="span" className="mx-4 text-xs" color="text.secondary">
											{ticket.service}
										</Typography>
									</span>
									<span className="flex items-center">
										<FuseSvgIcon size={14} color="disabled">
											heroicons-solid:clock
										</FuseSvgIcon>
										<Typography component="span" className="mx-4 text-xs" color="text.secondary">
											{ticket.timestamp}
										</Typography>
									</span>
								</div>
							}
						/>
						<ListItemSecondaryAction>
							<IconButton size="small" edge="end">
								<FuseSvgIcon size={16}>heroicons-solid:chevron-right</FuseSvgIcon>
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>

			<div className="mt-16 pt-16 border-t flex items-center justify-between">
				<Typography className="text-sm" color="text.secondary">
					Showing {supportTickets.length} of {supportTickets.length + 45} tickets
				</Typography>
				<Typography className="text-xs" color="text.disabled">
					Last updated: Just now
				</Typography>
			</div>
		</Paper>
	);
}

export default memo(ScheduleWidget);
