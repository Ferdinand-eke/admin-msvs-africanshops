import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

/**
 * The products header.
 */
function ReservationsMenuOrdersHeader(props) {
	const {active, setActive, allReservations, allCancelledReservations} = props

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	return (
		<div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
			<motion.span
				initial={{ x: -20 }}
				animate={{ x: 0, transition: { delay: 0.2 } }}
			>
				<Typography className="text-16 md:text-24 font-extrabold tracking-tight">Reservations/orders On RCS</Typography>
			</motion.span>

			<div className="flex flex-1 items-center justify-end space-x-8">
				<motion.div
					className="flex flex-grow-0 gap-4"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
				>
					<Button
						className={` ${active === 1 ? "bg-orange-500 hover:bg-orange-800" : ""}`}
						variant="contained"
						size={isMobile ? 'small' : 'small'}
						onClick={() => setActive(1)}
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-24">
						<path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
						</svg>

						<span className="mx-4 sm:mx-8">Reservations/Menu Orders  
						{/* ({(allReservations?.length)}) */}
						</span>
					</Button>
					{/* <Button
						className={` ${active === 2 ? "bg-orange-500 hover:bg-orange-800" : ""}`}
						variant="contained"
						size={isMobile ? 'small' : 'small'}
						onClick={() => setActive(2)}
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-24">
						<path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
						</svg>

						<span className="mx-4 sm:mx-8">Cancelled Reservations  
						({allCancelledReservations?.length})
						</span>
					</Button> */}
				</motion.div>
			</div>
		</div>
	);
}

export default ReservationsMenuOrdersHeader;
