import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The GithubIssuesWidget - Shows top 5 countries by user count and global distribution
 * TODO: Replace placeholder data with actual API call when endpoint is ready
 */
function GithubIssuesWidget() {
	const theme = useTheme();
	const [awaitRender, setAwaitRender] = useState(true);

	// Placeholder data - replace with actual API call
	const topCountries = [
		{ country: 'Nigeria', users: 5840, flag: '🇳🇬' },
		{ country: 'Kenya', users: 3250, flag: '🇰🇪' },
		{ country: 'Ghana', users: 2780, flag: '🇬🇭' },
		{ country: 'South Africa', users: 1920, flag: '🇿🇦' },
		{ country: 'Tanzania', users: 1452, flag: '🇹🇿' }
	];

	const barChartOptions = {
		chart: {
			type: 'bar',
			fontFamily: 'inherit',
			foreColor: 'inherit',
			toolbar: { show: false },
			sparkline: { enabled: false }
		},
		colors: [theme.palette.primary.main],
		plotOptions: {
			bar: {
				horizontal: true,
				barHeight: '70%',
				distributed: false,
				borderRadius: 4,
				dataLabels: {
					position: 'top'
				}
			}
		},
		dataLabels: {
			enabled: true,
			formatter: (val) => val.toLocaleString(),
			offsetX: 30,
			style: {
				fontSize: '12px',
				fontWeight: 600
			}
		},
		grid: {
			borderColor: theme.palette.divider,
			padding: { top: 0, right: 0, bottom: 0, left: 0 }
		},
		xaxis: {
			categories: topCountries.map(c => c.country),
			labels: {
				style: { colors: theme.palette.text.secondary }
			}
		},
		yaxis: {
			labels: {
				style: { colors: theme.palette.text.secondary }
			}
		},
		tooltip: {
			theme: theme.palette.mode,
			y: {
				formatter: (val) => `${val.toLocaleString()} users`
			}
		}
	};

	const barChartSeries = [{
		name: 'Users',
		data: topCountries.map(c => c.users)
	}];

	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (awaitRender) {
		return null;
	}

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between mb-16">
				<div className="flex items-center">
					<FuseSvgIcon className="text-primary" size={20}>heroicons-outline:globe</FuseSvgIcon>
					<Typography className="ml-8 text-lg font-medium tracking-tight leading-6">
						Global User Distribution
					</Typography>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-24 w-full">
				{/* Top 5 Countries Bar Chart */}
				<div className="flex flex-col">
					<Typography className="text-md font-medium mb-16" color="text.secondary">
						Top 5 Countries by Users
					</Typography>
					<ReactApexChart
						options={barChartOptions}
						series={barChartSeries}
						type="bar"
						height={280}
					/>
				</div>

				{/* World Map Placeholder - Will show user distribution */}
				<div className="flex flex-col">
					<Typography className="text-md font-medium mb-16" color="text.secondary">
						Geographic Distribution
					</Typography>
					<div className="flex-auto flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-16">
						<div className="text-center">
							<FuseSvgIcon className="text-gray-400" size={64}>heroicons-outline:globe-alt</FuseSvgIcon>
							<Typography className="mt-8 text-sm" color="text.secondary">
								Interactive world map visualization
							</Typography>
							<Typography className="mt-4 text-xs" color="text.disabled">
								Shows user density across {topCountries.length}+ countries
							</Typography>
							<div className="mt-16 grid grid-cols-2 gap-8">
								{topCountries.slice(0, 4).map((country) => (
									<div key={country.country} className="flex items-center justify-center p-8 bg-white dark:bg-gray-900 rounded">
										<span className="text-2xl mr-4">{country.flag}</span>
										<div className="text-left">
											<Typography className="text-xs font-medium">{country.country}</Typography>
											<Typography className="text-xs text-gray-500">{country.users.toLocaleString()}</Typography>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Paper>
	);
}

export default memo(GithubIssuesWidget);
