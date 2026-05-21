import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
	Avatar,
	Box,
	Chip,
	CircularProgress,
	FormControl,
	InputLabel,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Select,
	Stack
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

function LgaShippingTablesHeader({
	countries,
	states,
	lgas,
	selectedCountryId,
	selectedStateId,
	selectedLgaId,
	onCountryChange,
	onStateChange,
	onLgaChange,
	onAddRoute,
	isLoading,
	loadingStates,
	loadingLgas
}) {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const selectedCountry = countries?.find((c) => (c._id || c.id) === selectedCountryId) || null;
	const selectedState = states?.find((s) => (s._id || s.id) === selectedStateId) || null;
	const selectedLga = lgas?.find((l) => (l._id || l.id) === selectedLgaId) || null;

	// console.log('LgaShippingTablesHeader render', {
	// 	// selectedCountryId,
	// 	// selectedStateId,
	// 	selectedLgaId,
	// 	// onCountryChange,
	// 	// onStateChange,
	// 	// onLgaChange,
	// 	// isLoading,
	// 	// loadingStates,
	// 	// loadingLgas
	// });

	return (
		<Box
			sx={{
				borderBottom: '1px solid',
				borderColor: 'divider',
				bgcolor: 'background.paper',
				px: { xs: 2, md: 3 },
				py: { xs: 2, md: 2.5 }
			}}
		>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				alignItems={{ xs: 'flex-start', sm: 'center' }}
				justifyContent="space-between"
				spacing={2}
				mb={2.5}
			>
				<motion.div
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.1 } }}
				>
					<Typography
						variant={isMobile ? 'h6' : 'h5'}
						fontWeight={800}
						lineHeight={1.1}
					>
						LGA Shipping Routes
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ mt: 0.5, display: 'block' }}
					>
						Manage intra-state LGA-to-LGA freight rates for road, air &amp; bulk logistics
					</Typography>
				</motion.div>

				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.15 } }}
				>
					<Button
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon size={18}>heroicons-outline:plus</FuseSvgIcon>}
						onClick={onAddRoute}
						disabled={!selectedLgaId || isLoading || loadingLgas}
						size={isMobile ? 'small' : 'medium'}
						sx={{ borderRadius: 2, fontWeight: 700, px: 2.5, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
					>
						Add Route
					</Button>
				</motion.div>
			</Stack>

			<motion.div
				initial={{ y: 8, opacity: 0 }}
				animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					alignItems={{ xs: 'flex-start', sm: 'center' }}
					spacing={2}
					flexWrap="wrap"
				>
					{/* Step 1 — country */}
					<FormControl
						size="small"
						sx={{ minWidth: { xs: '100%', sm: 200 } }}
					>
						<InputLabel id="lga-origin-country-label">Country</InputLabel>
						<Select
							labelId="lga-origin-country-label"
							value={selectedCountryId}
							onChange={(e) => onCountryChange(e.target.value)}
							label="Country"
							disabled={isLoading}
							sx={{ borderRadius: 2 }}
							renderValue={(value) => {
								const c = countries.find((x) => (x._id || x.id) === value);
								if (!c) return <em>Select country…</em>;
								return (
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										{c.flag && (
											<Avatar
												src={c.flag}
												sx={{ width: 18, height: 18 }}
											/>
										)}
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{c.name}
										</Typography>
									</Stack>
								);
							}}
						>
							<MenuItem value="">
								<em>Select a country</em>
							</MenuItem>
							{countries.map((country) => (
								<MenuItem
									key={country._id || country.id}
									value={country._id || country.id}
								>
									<ListItemIcon sx={{ minWidth: 36 }}>
										{country.flag ? (
											<Avatar
												src={country.flag}
												sx={{ width: 24, height: 24 }}
											/>
										) : (
											<Avatar sx={{ width: 24, height: 24, fontSize: 10, bgcolor: 'grey.300' }}>
												{country.isoCode}
											</Avatar>
										)}
									</ListItemIcon>
									<ListItemText
										primary={country.name}
										secondary={country.isoCode}
										primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
										secondaryTypographyProps={{ variant: 'caption' }}
									/>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Step 2 — state (unlocked after country) */}
					<FormControl
						size="small"
						sx={{ minWidth: { xs: '100%', sm: 200 } }}
						disabled={!selectedCountryId || loadingStates}
					>
						<InputLabel id="lga-origin-state-label">State</InputLabel>
						<Select
							labelId="lga-origin-state-label"
							value={selectedStateId}
							onChange={(e) => onStateChange(e.target.value)}
							label="State"
							sx={{ borderRadius: 2 }}
							renderValue={(value) => {
								const s = states.find((x) => (x._id || x.id) === value);
								if (!s) return <em>Select state…</em>;
								return (
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<Box
											sx={{
												width: 20,
												height: 20,
												borderRadius: '4px',
												bgcolor: 'secondary.light',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Typography sx={{ fontSize: 9, fontWeight: 800, color: 'secondary.dark', lineHeight: 1 }}>
												{(s.isoCode || s.name || '').slice(0, 2).toUpperCase()}
											</Typography>
										</Box>
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{s.name}
										</Typography>
									</Stack>
								);
							}}
						>
							<MenuItem value="">
								<em>Select a state</em>
							</MenuItem>
							{states.map((state) => (
								<MenuItem
									key={state._id || state.id}
									value={state._id || state.id}
								>
									<ListItemIcon sx={{ minWidth: 36 }}>
										<Avatar
											sx={{
												width: 24,
												height: 24,
												fontSize: 9,
												fontWeight: 800,
												bgcolor: 'secondary.light',
												color: 'secondary.dark'
											}}
										>
											{(state.isoCode || state.name || '').slice(0, 2).toUpperCase()}
										</Avatar>
									</ListItemIcon>
									<ListItemText
										primary={state.name}
										primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
									/>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Step 3 — origin LGA (unlocked after state) */}
					<FormControl
						size="small"
						sx={{ minWidth: { xs: '100%', sm: 220 } }}
						disabled={!selectedStateId || loadingLgas}
					>
						<InputLabel id="lga-origin-lga-label">Origin LGA</InputLabel>
						<Select
							labelId="lga-origin-lga-label"
							value={selectedLgaId}
							onChange={(e) => onLgaChange(e.target.value)}
							label="Origin LGA"
							sx={{ borderRadius: 2 }}
							renderValue={(value) => {
								const l = lgas.find((x) => (x._id || x.id) === value);
								if (!l) return <em>Select LGA…</em>;
								return (
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<Box
											sx={{
												width: 20,
												height: 20,
												borderRadius: '4px',
												bgcolor: 'primary.light',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Typography sx={{ fontSize: 9, fontWeight: 800, color: 'primary.dark', lineHeight: 1 }}>
												{(l.name || '').slice(0, 2).toUpperCase()}
											</Typography>
										</Box>
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{l.name}
										</Typography>
									</Stack>
								);
							}}
						>
							<MenuItem value="">
								<em>Select an origin LGA</em>
							</MenuItem>
							{lgas.map((lga) => (
								<MenuItem
									key={lga._id || lga.id}
									value={lga._id || lga.id}
								>
									<ListItemIcon sx={{ minWidth: 36 }}>
										<Avatar
											sx={{
												width: 24,
												height: 24,
												fontSize: 9,
												fontWeight: 800,
												bgcolor: 'primary.light',
												color: 'primary.dark'
											}}
										>
											{(lga.name || '').slice(0, 2).toUpperCase()}
										</Avatar>
									</ListItemIcon>
									<ListItemText
										primary={lga.name}
										secondary={`${lga.shippingTable?.length || 0} route${lga.shippingTable?.length !== 1 ? 's' : ''}`}
										primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
										secondaryTypographyProps={{ variant: 'caption' }}
									/>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{(isLoading || loadingStates || loadingLgas) && (
						<CircularProgress
							size={18}
							thickness={5}
						/>
					)}

					{selectedLga && (
						<Stack
							direction="row"
							spacing={1}
							flexWrap="wrap"
						>
							{selectedCountry?.flag && (
								<Chip
									avatar={<Avatar src={selectedCountry.flag} />}
									label={selectedCountry.name}
									size="small"
									variant="outlined"
									sx={{ borderRadius: 2, fontWeight: 700 }}
								/>
							)}
							{selectedState && (
								<Chip
									icon={<FuseSvgIcon size={14}>heroicons-outline:location-marker</FuseSvgIcon>}
									label={selectedState.name}
									size="small"
									variant="outlined"
									sx={{ borderRadius: 2, fontWeight: 700 }}
								/>
							)}
							<Chip
								icon={<FuseSvgIcon size={14}>heroicons-outline:office-building</FuseSvgIcon>}
								label={selectedLga.name}
								size="small"
								color="secondary"
								variant="outlined"
								sx={{ borderRadius: 2, fontWeight: 700 }}
							/>
							<Chip
								label={`${selectedLga.shippingTable?.length || 0} route${selectedLga.shippingTable?.length !== 1 ? 's' : ''}`}
								size="small"
								color="default"
								sx={{ borderRadius: 2 }}
							/>
						</Stack>
					)}
				</Stack>
			</motion.div>
		</Box>
	);
}

export default LgaShippingTablesHeader;
