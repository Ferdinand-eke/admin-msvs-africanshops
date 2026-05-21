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

function DistrictShippingTablesHeader({
	countries,
	states,
	lgas,
	districts,
	selectedCountryId,
	selectedStateId,
	selectedLgaId,
	selectedDistrictId,
	onCountryChange,
	onStateChange,
	onLgaChange,
	onDistrictChange,
	onAddRoute,
	isLoading,
	loadingStates,
	loadingLgas,
	loadingDistricts
}) {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const selectedCountry = countries?.find((c) => (c._id || c.id) === selectedCountryId) || null;
	const selectedState = states?.find((s) => (s._id || s.id) === selectedStateId) || null;
	const selectedLga = lgas?.find((l) => (l._id || l.id) === selectedLgaId) || null;
	const selectedDistrict = districts?.find((d) => (d._id || d.id) === selectedDistrictId) || null;

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
						District Shipping Routes
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ mt: 0.5, display: 'block' }}
					>
						Manage intra-LGA district-to-district freight rates for road, air &amp; bulk logistics
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
						disabled={!selectedDistrictId || isLoading || loadingDistricts}
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
						sx={{ minWidth: { xs: '100%', sm: 180 } }}
					>
						<InputLabel id="dst-origin-country-label">Country</InputLabel>
						<Select
							labelId="dst-origin-country-label"
							value={selectedCountryId}
							onChange={(e) => onCountryChange(e.target.value)}
							label="Country"
							disabled={isLoading}
							sx={{ borderRadius: 2 }}
							renderValue={(value) => {
								const c = countries.find((x) => (x._id || x.id) === value);
								if (!c) return <em>Country…</em>;
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

					{/* Step 2 — state */}
					<FormControl
						size="small"
						sx={{ minWidth: { xs: '100%', sm: 175 } }}
						disabled={!selectedCountryId || loadingStates}
					>
						<InputLabel id="dst-origin-state-label">State</InputLabel>
						<Select
							labelId="dst-origin-state-label"
							value={selectedStateId}
							onChange={(e) => onStateChange(e.target.value)}
							label="State"
							sx={{ borderRadius: 2 }}
							renderValue={(value) => {
								const s = states.find((x) => (x._id || x.id) === value);
								if (!s) return <em>State…</em>;
								return (
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<Avatar
											sx={{
												width: 20,
												height: 20,
												fontSize: 8,
												fontWeight: 800,
												bgcolor: 'secondary.light',
												color: 'secondary.dark',
												borderRadius: '4px'
											}}
										>
											{(s.isoCode || s.name || '').slice(0, 2).toUpperCase()}
										</Avatar>
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

					{/* Step 3 — LGA */}
					<FormControl
						size="small"
						sx={{ minWidth: { xs: '100%', sm: 180 } }}
						disabled={!selectedStateId || loadingLgas}
					>
						<InputLabel id="dst-origin-lga-label">LGA</InputLabel>
						<Select
							labelId="dst-origin-lga-label"
							value={selectedLgaId}
							onChange={(e) => onLgaChange(e.target.value)}
							label="LGA"
							sx={{ borderRadius: 2 }}
							renderValue={(value) => {
								const l = lgas.find((x) => (x._id || x.id) === value);
								if (!l) return <em>LGA…</em>;
								return (
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<Avatar
											sx={{
												width: 20,
												height: 20,
												fontSize: 8,
												fontWeight: 800,
												bgcolor: 'primary.light',
												color: 'primary.dark',
												borderRadius: '4px'
											}}
										>
											{(l.name || '').slice(0, 2).toUpperCase()}
										</Avatar>
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
								<em>Select an LGA</em>
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
										primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
									/>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Step 4 — origin district (unlocked after LGA) */}
					<FormControl
						size="small"
						sx={{ minWidth: { xs: '100%', sm: 200 } }}
						disabled={!selectedLgaId || loadingDistricts}
					>
						<InputLabel id="dst-origin-district-label">Origin District</InputLabel>
						<Select
							labelId="dst-origin-district-label"
							value={selectedDistrictId}
							onChange={(e) => onDistrictChange(e.target.value)}
							label="Origin District"
							sx={{ borderRadius: 2 }}
							renderValue={(value) => {
								const d = districts.find((x) => (x._id || x.id) === value);
								if (!d) return <em>District…</em>;
								return (
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
									>
										<Avatar
											sx={{
												width: 20,
												height: 20,
												fontSize: 8,
												fontWeight: 800,
												bgcolor: 'warning.light',
												color: 'warning.dark',
												borderRadius: '4px'
											}}
										>
											{(d.name || '').slice(0, 2).toUpperCase()}
										</Avatar>
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{d.name}
										</Typography>
									</Stack>
								);
							}}
						>
							<MenuItem value="">
								<em>Select an origin district</em>
							</MenuItem>
							{districts.map((district) => (
								<MenuItem
									key={district._id || district.id}
									value={district._id || district.id}
								>
									<ListItemIcon sx={{ minWidth: 36 }}>
										<Avatar
											sx={{
												width: 24,
												height: 24,
												fontSize: 9,
												fontWeight: 800,
												bgcolor: 'warning.light',
												color: 'warning.dark'
											}}
										>
											{(district.name || '').slice(0, 2).toUpperCase()}
										</Avatar>
									</ListItemIcon>
									<ListItemText
										primary={district.name}
										secondary={`${district.shippingTable?.length || 0} route${district.shippingTable?.length !== 1 ? 's' : ''}`}
										primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
										secondaryTypographyProps={{ variant: 'caption' }}
									/>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{(isLoading || loadingStates || loadingLgas || loadingDistricts) && (
						<CircularProgress
							size={18}
							thickness={5}
						/>
					)}

					{selectedDistrict && (
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
									label={selectedState.name}
									size="small"
									variant="outlined"
									sx={{ borderRadius: 2, fontWeight: 700 }}
								/>
							)}
							{selectedLga && (
								<Chip
									icon={<FuseSvgIcon size={14}>heroicons-outline:location-marker</FuseSvgIcon>}
									label={selectedLga.name}
									size="small"
									variant="outlined"
									sx={{ borderRadius: 2, fontWeight: 700 }}
								/>
							)}
							<Chip
								icon={<FuseSvgIcon size={14}>heroicons-outline:office-building</FuseSvgIcon>}
								label={selectedDistrict.name}
								size="small"
								color="secondary"
								variant="outlined"
								sx={{ borderRadius: 2, fontWeight: 700 }}
							/>
							<Chip
								label={`${selectedDistrict.shippingTable?.length || 0} route${selectedDistrict.shippingTable?.length !== 1 ? 's' : ''}`}
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

export default DistrictShippingTablesHeader;
