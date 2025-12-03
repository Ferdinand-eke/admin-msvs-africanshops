import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseLoading from '@fuse/core/FuseLoading';
import PropertyListItem from './PropertyListItem';

/**
 * The timeline tab.
 */
function TimelineTab({ listings, loading }) {
	console.log('Listings proped down', listings);
	// const { data: timeline, isLoading } = useGetProfileTimelineQuery();

	// if (isLoading) {
	// 	return <FuseLoading />;
	// }
	if (loading) {
		return <FuseLoading />;
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};
	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};
	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full"
		>
			<div className="md:flex">
				<div className="flex flex-col w-full md:w-320 md:ltr:mr-32 md:rtl:ml-32">
					<Card
						component={motion.div}
						variants={item}
						className="flex flex-col w-full px-32 pt-24"
					>
						<div className="flex justify-between items-center pb-16">
							<Typography className="text-2xl font-semibold leading-tight">Latest Activity</Typography>
							<Button
								color="inherit"
								size="small"
								className="font-medium -mx-8"
							>
								See All
							</Button>
						</div>

						<CardContent className="p-0">
							{/* <List className="p-0">
								{timeline.activities.map((activity) => (
									<ActivityItem
										item={activity}
										key={activity.id}
									/>
								))}
							</List> */}
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col flex-1">
					{listings?.map((post) => (
						<motion.div
							variants={item}
							key={post._id}
						>
							<PropertyListItem item={post} />
						</motion.div>
					))}
				</div>
			</div>
		</motion.div>
	);
}

export default TimelineTab;
