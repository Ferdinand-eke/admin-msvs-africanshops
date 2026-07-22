import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import {
	useAdminBlockMerchantMutation,
	useAdminSuspendMerchantMutation,
	useAdminUnblockMerchantMutation,
	useAdminUnsuspendMerchantMutation,
	useAdminVerifyMerchantMutation
} from 'src/app/api/shops/useAdminShops';

const item = {
	hidden: { opacity: 0, y: 40 },
	show: { opacity: 1, y: 0 }
};

/**
 * Merchant compliance status + admin moderation actions (suspend/unsuspend,
 * block/unblock, verify) — mirrors the equivalent User Compliance/Disciplinary
 * cards in src/app/main/users/user/contact/UserContactView.jsx. Added
 * 2026-07-22: the backend/gateway routes for suspend/block already existed,
 * unsuspend/unblock/verify were net-new, and no admin UI called any of them.
 */
function ComplianceTab({ vendor }) {
	const suspendMerchant = useAdminSuspendMerchantMutation();
	const unsuspendMerchant = useAdminUnsuspendMerchantMutation();
	const blockMerchant = useAdminBlockMerchantMutation();
	const unblockMerchant = useAdminUnblockMerchantMutation();
	const verifyMerchant = useAdminVerifyMerchantMutation();

	if (!vendor?.id) {
		return null;
	}

	const doSuspend = () => {
		if (window.confirm(`Suspend ${vendor.shopname}? They will be unable to trade until lifted.`)) {
			suspendMerchant.mutate(vendor.id);
		}
	};

	const doUnsuspend = () => {
		if (window.confirm(`Lift suspension on ${vendor.shopname}?`)) {
			unsuspendMerchant.mutate(vendor.id);
		}
	};

	const doBlock = () => {
		if (window.confirm(`Block ${vendor.shopname}? This is more severe than suspension.`)) {
			blockMerchant.mutate(vendor.id);
		}
	};

	const doUnblock = () => {
		if (window.confirm(`Remove block on ${vendor.shopname}?`)) {
			unblockMerchant.mutate(vendor.id);
		}
	};

	const doVerify = () => {
		if (window.confirm(`Mark ${vendor.shopname} as verified?`)) {
			verifyMerchant.mutate(vendor.id);
		}
	};

	return (
		<div className="flex flex-col sm:flex-row gap-16 max-w-3xl">
			<Card
				component={motion.div}
				variants={item}
				className="w-full mb-32 rounded-16 shadow"
			>
				<div className="px-24 pt-24">
					<Typography className="text-lg font-semibold leading-tight">Merchant Compliance</Typography>
				</div>
				<CardContent className="px-16">
					<List className="p-0">
						<ListItem className="px-0 space-x-8 justify-between">
							<ListItemText
								primary={
									<Typography className="font-medium" color={vendor.verified ? 'green' : 'text.secondary'}>
										{vendor.verified ? 'Verified' : 'Not Verified'}
									</Typography>
								}
							/>
						</ListItem>
						<ListItem className="px-0 space-x-8 justify-between">
							<ListItemText
								primary={
									<Typography className="font-medium" color={vendor.isSuspended ? 'red' : 'green'}>
										{vendor.isSuspended ? 'Suspended' : 'Not Suspended'}
									</Typography>
								}
							/>
						</ListItem>
						<ListItem className="px-0 space-x-8 justify-between">
							<ListItemText
								primary={
									<Typography className="font-medium" color={vendor.isBlocked ? 'red' : 'green'}>
										{vendor.isBlocked ? 'Blocked' : 'Not Blocked'}
									</Typography>
								}
							/>
						</ListItem>
					</List>
				</CardContent>
			</Card>

			<Card
				component={motion.div}
				variants={item}
				className="w-full mb-32 rounded-16 shadow"
			>
				<div className="px-24 pt-24">
					<Typography className="text-lg font-semibold leading-tight">Moderation Actions</Typography>
				</div>
				<CardContent className="px-16">
					<List className="p-0">
						{!vendor.verified && (
							<ListItem className="px-0 space-x-8 justify-between">
								<ListItemText primary={<Typography className="font-medium">Verify shop</Typography>} />
								<Chip
									label="Verify"
									className="cursor-pointer bg-green-600 hover:bg-green-800 text-white"
									size="small"
									onClick={doVerify}
								/>
							</ListItem>
						)}

						{!vendor.isSuspended && (
							<ListItem className="px-0 space-x-8 justify-between">
								<ListItemText primary={<Typography className="font-medium">Suspend shop</Typography>} />
								<Chip
									label="Suspend"
									className="cursor-pointer bg-red-500 hover:bg-red-800 text-white"
									size="small"
									onClick={doSuspend}
								/>
							</ListItem>
						)}

						{vendor.isSuspended && (
							<ListItem className="px-0 space-x-8 justify-between">
								<ListItemText primary={<Typography className="font-medium">Lift suspension</Typography>} />
								<Chip
									label="Lift Suspension"
									className="cursor-pointer bg-orange-500 hover:bg-orange-800 text-white"
									size="small"
									onClick={doUnsuspend}
								/>
							</ListItem>
						)}

						{!vendor.isBlocked && (
							<ListItem className="px-0 space-x-8 justify-between">
								<ListItemText primary={<Typography className="font-medium">Block shop</Typography>} />
								<Chip
									label="Block"
									className="cursor-pointer bg-red-500 hover:bg-red-800 text-white"
									size="small"
									onClick={doBlock}
								/>
							</ListItem>
						)}

						{vendor.isBlocked && (
							<ListItem className="px-0 space-x-8 justify-between">
								<ListItemText primary={<Typography className="font-medium">Unblock shop</Typography>} />
								<Chip
									label="Unblock"
									className="cursor-pointer bg-orange-500 hover:bg-orange-800 text-white"
									size="small"
									onClick={doUnblock}
								/>
							</ListItem>
						)}
					</List>
				</CardContent>
			</Card>
		</div>
	);
}

export default ComplianceTab;
