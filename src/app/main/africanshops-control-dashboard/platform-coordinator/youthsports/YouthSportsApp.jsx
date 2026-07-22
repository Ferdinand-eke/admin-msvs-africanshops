import FusePageSimple from '@fuse/core/FusePageSimple';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import ProgramsPanel from './ProgramsPanel';
import TournamentsPanel from './TournamentsPanel';
import SpotlightsPanel from './SpotlightsPanel';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

/**
 * Youth Sports platform-coordinator admin surface. Pilot for the
 * repeatable civic-vertical coordinator screen pattern -- one page, one
 * tab per resource type, each backed by a DataTable + create dialog + row
 * actions. See tracker Admin Web App item 9.
 */
function YouthSportsApp() {
	const [tabValue, setTabValue] = useState(0);

	return (
		<Root
			header={
				<div className="flex flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
					<Typography className="text-24 md:text-32 font-extrabold tracking-tight">Youth Sports</Typography>
				</div>
			}
			content={
				<div className="w-full p-12 pt-16 sm:pt-24">
					<Tabs
						value={tabValue}
						onChange={(_e, value) => setTabValue(value)}
						indicatorColor="secondary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="w-full px-24 -mx-4 min-h-40"
					>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Programs"
						/>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Tournaments"
						/>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Talent Spotlights"
						/>
					</Tabs>
					<div className="p-16 sm:p-24">
						{tabValue === 0 && <ProgramsPanel />}
						{tabValue === 1 && <TournamentsPanel />}
						{tabValue === 2 && <SpotlightsPanel />}
					</div>
				</div>
			}
		/>
	);
}

export default YouthSportsApp;
