import { motion } from 'framer-motion';
import BudgetDistributionWidget from './widgets/BudgetDistributionWidget';
import ServiceEarningsWidget from './widgets/ServiceEarningsWidget';
import BudgetDetailsWidget from './widgets/BudgetDetailsWidget';

/**
 * The BudgetTab component - Finance & Earnings Dashboard
 * Shows real-time earnings distribution, service breakdowns, and transaction history
 */
function BudgetTab() {
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
			className="grid grid-cols-1 sm:grid-cols-6 gap-24 w-full min-w-0 p-24"
			variants={container}
			initial="hidden"
			animate="show"
		>
			{/* First Row: Earnings Distribution Chart (Left) & Service Earnings Breakdown (Right) */}
			<motion.div
				variants={item}
				className="sm:col-span-3 lg:col-span-4"
			>
				<BudgetDistributionWidget />
			</motion.div>

			<motion.div
				variants={item}
				className="sm:col-span-3 lg:col-span-2"
			>
				<ServiceEarningsWidget />
			</motion.div>

			{/* Second Row: Transaction Details Table (Full Width) */}
			<motion.div
				variants={item}
				className="sm:col-span-6"
			>
				<BudgetDetailsWidget />
			</motion.div>
		</motion.div>
	);
}

export default BudgetTab;
