import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { lighten, useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

/**
 * ServiceEarningsWidget - Shows scrollable list of business services with earnings breakdown
 * TODO: Replace placeholder data with actual API call when endpoint is ready
 */
function ServiceEarningsWidget() {
	const theme = useTheme();

	// Placeholder data - replace with actual API call
	const servicesData = [
		{
			name: 'Marketplace',
			icon: 'heroicons-outline:shopping-cart',
			color: 'primary',
			totalEarnings: 2456780,
			merchantEarnings: 1720746,
			commission: 491356,
			tax: 196542,
			logistics: 48136,
			growth: 12.5
		},
		{
			name: 'Bookings',
			icon: 'heroicons-outline:calendar',
			color: 'secondary',
			totalEarnings: 1234560,
			merchantEarnings: 864192,
			commission: 246912,
			tax: 98765,
			logistics: 24691,
			growth: 8.3
		},
		{
			name: 'Tradehub',
			icon: 'heroicons-outline:truck',
			color: 'info',
			totalEarnings: 876540,
			merchantEarnings: 613578,
			commission: 175308,
			tax: 70123,
			logistics: 17531,
			growth: -2.1
		},
		{
			name: 'Estates',
			icon: 'heroicons-outline:home',
			color: 'success',
			totalEarnings: 654320,
			merchantEarnings: 458024,
			commission: 130864,
			tax: 52346,
			logistics: 13086,
			growth: 15.7
		},
		{
			name: 'Hospitality',
			icon: 'heroicons-outline:office-building',
			color: 'warning',
			totalEarnings: 432100,
			merchantEarnings: 302470,
			commission: 86420,
			tax: 34568,
			logistics: 8642,
			growth: 5.4
		}
	];

	const formatCurrency = (amount) => {
		return `$${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	};

	const getColorClass = (colorName) => {
		const colorMap = {
			primary: 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
			secondary: 'bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
			info: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400',
			success: 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-400',
			warning: 'bg-orange-50 text-orange-600 dark:bg-orange-900 dark:text-orange-400'
		};
		return colorMap[colorName] || colorMap.primary;
	};

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden h-full">
			<div className="flex items-center justify-between mb-16">
				<div className="flex items-center">
					<FuseSvgIcon className="text-info" size={20}>heroicons-outline:chart-pie</FuseSvgIcon>
					<Typography className="ml-8 text-lg font-medium tracking-tight leading-6">
						Service Earnings Breakdown
					</Typography>
				</div>
			</div>

			{/* Scrollable Services List */}
			<div className="overflow-auto" style={{ maxHeight: '480px' }}>
				<div className="space-y-16">
					{servicesData.map((service, index) => (
						<Box
							key={service.name}
							sx={{
								backgroundColor: (_theme) =>
									_theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
							className="p-16 rounded-lg"
						>
							{/* Service Header */}
							<div className="flex items-center justify-between mb-12">
								<div className="flex items-center">
									<div className={`p-8 rounded-lg ${getColorClass(service.color)}`}>
										<FuseSvgIcon size={24}>{service.icon}</FuseSvgIcon>
									</div>
									<div className="ml-12">
										<Typography className="text-md font-semibold">{service.name}</Typography>
										<div className="flex items-center mt-2">
											<FuseSvgIcon
												className={service.growth >= 0 ? 'text-green-600' : 'text-red-600'}
												size={16}
											>
												{service.growth >= 0 ? 'heroicons-solid:arrow-up' : 'heroicons-solid:arrow-down'}
											</FuseSvgIcon>
											<Typography
												className={`ml-4 text-xs font-medium ${
													service.growth >= 0 ? 'text-green-600' : 'text-red-600'
												}`}
											>
												{Math.abs(service.growth)}% {service.growth >= 0 ? 'growth' : 'decline'}
											</Typography>
										</div>
									</div>
								</div>
								<div className="text-right">
									<Typography className="text-xs text-secondary">Total Revenue</Typography>
									<Typography className="text-xl font-bold text-success-main">
										{formatCurrency(service.totalEarnings)}
									</Typography>
								</div>
							</div>

							<Divider className="my-12" />

							{/* Breakdown Grid */}
							<div className="grid grid-cols-2 gap-8">
								<div className="flex items-center">
									<FuseSvgIcon className="text-blue-500" size={16}>heroicons-solid:user-group</FuseSvgIcon>
									<div className="ml-8">
										<Typography className="text-xs text-secondary">Merchant Earnings</Typography>
										<Typography className="text-sm font-semibold">{formatCurrency(service.merchantEarnings)}</Typography>
									</div>
								</div>
								<div className="flex items-center">
									<FuseSvgIcon className="text-purple-500" size={16}>heroicons-solid:cash</FuseSvgIcon>
									<div className="ml-8">
										<Typography className="text-xs text-secondary">Commission</Typography>
										<Typography className="text-sm font-semibold">{formatCurrency(service.commission)}</Typography>
									</div>
								</div>
								<div className="flex items-center">
									<FuseSvgIcon className="text-orange-500" size={16}>heroicons-solid:calculator</FuseSvgIcon>
									<div className="ml-8">
										<Typography className="text-xs text-secondary">Tax</Typography>
										<Typography className="text-sm font-semibold">{formatCurrency(service.tax)}</Typography>
									</div>
								</div>
								<div className="flex items-center">
									<FuseSvgIcon className="text-cyan-500" size={16}>heroicons-solid:truck</FuseSvgIcon>
									<div className="ml-8">
										<Typography className="text-xs text-secondary">Logistics</Typography>
										<Typography className="text-sm font-semibold">{formatCurrency(service.logistics)}</Typography>
									</div>
								</div>
							</div>
						</Box>
					))}
				</div>
			</div>

			{/* Footer Summary */}
			<Box
				sx={{
					backgroundColor: (_theme) =>
						_theme.palette.mode === 'light'
							? lighten(theme.palette.primary.main, 0.9)
							: lighten(theme.palette.primary.main, 0.1)
				}}
				className="mt-16 p-12 rounded-lg"
			>
				<div className="flex items-center justify-between">
					<Typography className="text-sm font-medium">Total Across All Services</Typography>
					<Typography className="text-lg font-bold text-primary">
						{formatCurrency(servicesData.reduce((sum, s) => sum + s.totalEarnings, 0))}
					</Typography>
				</div>
			</Box>
		</Paper>
	);
}

export default memo(ServiceEarningsWidget);
