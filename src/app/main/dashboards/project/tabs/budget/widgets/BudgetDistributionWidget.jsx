import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { lighten } from '@mui/material/styles';

/**
 * The BudgetDistributionWidget - Shows earnings distribution across business services
 * TODO: Replace placeholder data with actual API call when endpoint is ready
 */
function BudgetDistributionWidget() {
	const theme = useTheme();
	const [awaitRender, setAwaitRender] = useState(true);

	// Placeholder data - replace with actual API call
	const earningsData = {
		services: ['Marketplace', 'Bookings', 'Tradehub', 'Estates'],
		earnings: [2456780, 1234560, 876540, 654320], // in cents/smallest currency unit
		percentages: [46.8, 23.5, 16.7, 12.5]
	};

	const totalEarnings = earningsData.earnings.reduce((sum, val) => sum + val, 0);

	const chartOptions = {
		chart: {
			type: 'donut',
			fontFamily: 'inherit',
			foreColor: 'inherit',
			toolbar: { show: false },
			animations: {
				enabled: true,
				easing: 'easeinout',
				speed: 800
			}
		},
		colors: [
			theme.palette.primary.main,
			theme.palette.secondary.main,
			theme.palette.info.main,
			theme.palette.success.main
		],
		labels: earningsData.services,
		legend: {
			position: 'bottom',
			horizontalAlign: 'center',
			fontSize: '14px',
			markers: {
				width: 12,
				height: 12
			}
		},
		plotOptions: {
			pie: {
				donut: {
					size: '70%',
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: '16px',
							fontWeight: 600
						},
						value: {
							show: true,
							fontSize: '28px',
							fontWeight: 700,
							formatter: (val) => `$${(parseFloat(val) / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
						},
						total: {
							show: true,
							label: 'Total Earnings',
							fontSize: '14px',
							fontWeight: 500,
							color: theme.palette.text.secondary,
							formatter: () => `$${(totalEarnings / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
						}
					}
				}
			}
		},
		dataLabels: {
			enabled: true,
			formatter: (val) => `${val.toFixed(1)}%`
		},
		stroke: {
			width: 2,
			colors: [theme.palette.background.paper]
		},
		tooltip: {
			theme: theme.palette.mode,
			y: {
				formatter: (val) => `$${(val / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
			}
		}
	};

	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (awaitRender) {
		return null;
	}

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden h-full">
			<div className="flex items-center justify-between mb-16">
				<div className="flex items-center">
					<FuseSvgIcon className="text-success" size={20}>heroicons-outline:currency-dollar</FuseSvgIcon>
					<Typography className="ml-8 text-lg font-medium tracking-tight leading-6">
						Earnings Distribution by Service
					</Typography>
				</div>
			</div>

			<div className="flex flex-col flex-auto">
				<ReactApexChart
					options={chartOptions}
					series={earningsData.earnings}
					type="donut"
					height={380}
				/>
			</div>

			{/* Summary Cards */}
			<Box
				sx={{
					backgroundColor: (_theme) =>
						_theme.palette.mode === 'light'
							? lighten(theme.palette.background.default, 0.4)
							: lighten(theme.palette.background.default, 0.02)
				}}
				className="grid grid-cols-2 gap-12 mt-16 p-16 rounded-lg"
			>
				<div className="flex items-center">
					<FuseSvgIcon className="text-green-600" size={20}>heroicons-solid:trending-up</FuseSvgIcon>
					<div className="ml-8">
						<Typography className="text-xs text-secondary">Highest Revenue</Typography>
						<Typography className="text-sm font-semibold">{earningsData.services[0]}</Typography>
					</div>
				</div>
				<div className="flex items-center">
					<FuseSvgIcon className="text-blue-600" size={20}>heroicons-solid:chart-bar</FuseSvgIcon>
					<div className="ml-8">
						<Typography className="text-xs text-secondary">Services Active</Typography>
						<Typography className="text-sm font-semibold">{earningsData.services.length}</Typography>
					</div>
				</div>
			</Box>
		</Paper>
	);
}

export default memo(BudgetDistributionWidget);
