import Paper from '@mui/material/Paper';
import { lighten, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The TaskDistributionWidget - Shows support requests/conflicts by service type
 * TODO: Replace placeholder data with actual API call when endpoint is ready
 */
function TaskDistributionWidget() {
	const [serviceType, setServiceType] = useState(0);
	const [awaitRender, setAwaitRender] = useState(true);
	const theme = useTheme();

	// Placeholder data - replace with actual API call
	const services = ['Marketplace', 'Bookings', 'Tradehub', 'Estates'];
	const supportData = {
		marketplace: { open: 45, resolved: 128, critical: 8 },
		bookings: { open: 23, resolved: 67, critical: 3 },
		tradehub: { open: 12, resolved: 34, critical: 1 },
		estates: { open: 18, resolved: 52, critical: 2 }
	};

	const currentService = services[serviceType].toLowerCase();
	const currentData = supportData[currentService];

	const chartOptions = {
		chart: {
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'donut',
			toolbar: { show: false }
		},
		labels: ['Open Tickets', 'Resolved', 'Critical'],
		colors: [theme.palette.warning.main, theme.palette.success.main, theme.palette.error.main],
		legend: {
			position: 'bottom',
			horizontalAlign: 'center'
		},
		plotOptions: {
			pie: {
				donut: {
					size: '65%',
					labels: {
						show: true,
						name: { show: true },
						value: {
							show: true,
							fontSize: '24px',
							fontWeight: 600
						},
						total: {
							show: true,
							label: 'Total Tickets',
							formatter: () => {
								return (currentData.open + currentData.resolved + currentData.critical).toString();
							}
						}
					}
				}
			}
		},
		dataLabels: {
			enabled: true,
			formatter: (val) => `${val.toFixed(0)}%`
		},
		tooltip: {
			theme: theme.palette.mode,
			y: {
				formatter: (val) => `${val} tickets`
			}
		}
	};

	const chartSeries = [currentData.open, currentData.resolved, currentData.critical];

	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (awaitRender) {
		return null;
	}

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden h-full">
			<div className="flex flex-col sm:flex-row items-start justify-between">
				<div className="flex items-center">
					<FuseSvgIcon className="text-warning" size={20}>heroicons-outline:support</FuseSvgIcon>
					<Typography className="ml-8 text-lg font-medium tracking-tight leading-6">
						Support Requests
					</Typography>
				</div>
				<div className="mt-12 sm:mt-0 sm:ml-8">
					<Tabs
						value={serviceType}
						onChange={(_ev, value) => setServiceType(value)}
						indicatorColor="secondary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="-mx-4 min-h-40"
						classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
						TabIndicatorProps={{
							children: (
								<Box
									sx={{ bgcolor: 'text.disabled' }}
									className="w-full h-full rounded-full opacity-20"
								/>
							)
						}}
					>
						{services.map((service) => (
							<Tab
								className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
								disableRipple
								key={service}
								label={service}
							/>
						))}
					</Tabs>
				</div>
			</div>
			<div className="flex flex-col flex-auto mt-16">
				<ReactApexChart
					className="flex-auto w-full"
					options={chartOptions}
					series={chartSeries}
					type="donut"
					height={260}
				/>
			</div>
			<Box
				sx={{
					backgroundColor: (_theme) =>
						_theme.palette.mode === 'light'
							? lighten(theme.palette.background.default, 0.4)
							: lighten(theme.palette.background.default, 0.02)
				}}
				className="grid grid-cols-3 border-t divide-x -m-24 mt-16"
			>
				<div className="flex flex-col items-center justify-center p-16">
					<div className="text-3xl font-semibold leading-none tracking-tighter text-warning-main">
						{currentData.open}
					</div>
					<Typography className="mt-4 text-center text-xs text-secondary">Open</Typography>
				</div>
				<div className="flex flex-col items-center justify-center p-16">
					<div className="text-3xl font-semibold leading-none tracking-tighter text-success-main">
						{currentData.resolved}
					</div>
					<Typography className="mt-4 text-center text-xs text-secondary">Resolved</Typography>
				</div>
				<div className="flex flex-col items-center justify-center p-16">
					<div className="text-3xl font-semibold leading-none tracking-tighter text-error-main">
						{currentData.critical}
					</div>
					<Typography className="mt-4 text-center text-xs text-secondary">Critical</Typography>
				</div>
			</Box>
		</Paper>
	);
}

export default memo(TaskDistributionWidget);
