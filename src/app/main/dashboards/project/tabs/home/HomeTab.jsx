import { motion } from 'framer-motion';
import SummaryWidget from './widgets/SummaryWidget';
import OverdueWidget from './widgets/OverdueWidget';
import IssuesWidget from './widgets/IssuesWidget';
import FeaturesWidget from './widgets/FeaturesWidget';

/**
 * The HomeTab component -- real platform KPI tiles (Orders, Merchants, Users,
 * Pending KYC). The GitHub-issues/task-distribution/schedule demo widgets
 * that used to fill out this grid were decorative Fuse template placeholders
 * unrelated to AfricanShops data and have been removed rather than adapted.
 */
function HomeTab() {
	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};
	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};
	return (
		<motion.div
			className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 p-24"
			variants={container}
			initial="hidden"
			animate="show"
		>
			<motion.div variants={item}>
				<SummaryWidget />
			</motion.div>
			<motion.div variants={item}>
				<OverdueWidget />
			</motion.div>
			<motion.div variants={item}>
				<IssuesWidget />
			</motion.div>
			<motion.div variants={item}>
				<FeaturesWidget />
			</motion.div>
		</motion.div>
	);
}

export default HomeTab;
