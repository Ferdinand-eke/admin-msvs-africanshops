import { useEffect, useMemo } from 'react';
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useLgaAddShippingTableMutation } from '../../../../api/lgas/useLgas';

const blockNonInteger = (e) => {
	if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
};

const parseIntField = (v) => {
	if (v === '' || v === undefined || v === null) return undefined;
	const n = parseInt(v, 10);
	return Number.isNaN(n) ? undefined : n;
};

const schema = z.object({
	lgaToShipTo: z.string().min(1, 'Please select a destination LGA'),
	distanceKm: z.coerce.number({ invalid_type_error: 'Required' }).int('Must be a whole number').min(0, 'Must be 0 or more'),
	landKilogramFreightFee: z.coerce.number({ invalid_type_error: 'Required' }).min(0, 'Must be 0 or more'),
	airKilogramFreightFee: z.coerce.number({ invalid_type_error: 'Required' }).min(0, 'Must be 0 or more'),
	perCbmFreightFee: z.coerce.number({ invalid_type_error: 'Required' }).min(0, 'Must be 0 or more'),
	seaKilogramFreightFee: z.coerce.number().min(0).optional().or(z.literal('')),
	landTransitDaysMin: z.coerce.number().int().min(0).optional().or(z.literal('')),
	landTransitDaysMax: z.coerce.number().int().min(0).optional().or(z.literal('')),
	airTransitDaysMin: z.coerce.number().int().min(0).optional().or(z.literal('')),
	airTransitDaysMax: z.coerce.number().int().min(0).optional().or(z.literal('')),
	seaTransitDaysMin: z.coerce.number().int().min(0).optional().or(z.literal('')),
	seaTransitDaysMax: z.coerce.number().int().min(0).optional().or(z.literal('')),
	notes: z.string().optional()
});

function SectionHeader({ iconName, title, bgColor, iconColor }) {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				py: 0.75,
				px: 1.5,
				borderRadius: 2,
				bgcolor: bgColor,
				mb: 2
			}}
		>
			<FuseSvgIcon
				size={15}
				sx={{ color: iconColor }}
			>
				{iconName}
			</FuseSvgIcon>
			<Typography
				variant="caption"
				sx={{ fontWeight: 800, color: iconColor, textTransform: 'uppercase', letterSpacing: 0.8 }}
			>
				{title}
			</Typography>
		</Box>
	);
}

function TransitDaysRow({ control, minName, maxName }) {
	return (
		<Stack
			direction="row"
			spacing={2}
			mb={3}
		>
			<Controller
				name={minName}
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Min Transit Days"
						type="number"
						size="small"
						fullWidth
						InputProps={{
							endAdornment: <InputAdornment position="end">days</InputAdornment>,
							inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
						}}
						sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
					/>
				)}
			/>
			<Controller
				name={maxName}
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Max Transit Days"
						type="number"
						size="small"
						fullWidth
						InputProps={{
							endAdornment: <InputAdornment position="end">days</InputAdornment>,
							inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
						}}
						sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
					/>
				)}
			/>
		</Stack>
	);
}

function LgaAvatar({ lga, size = 24 }) {
	const code = (lga?.name || '?').slice(0, 2).toUpperCase();
	return (
		<Avatar
			sx={{
				width: size,
				height: size,
				bgcolor: 'primary.light',
				color: 'primary.dark',
				fontSize: size < 28 ? 9 : 11,
				fontWeight: 800,
				borderRadius: '6px'
			}}
		>
			{code}
		</Avatar>
	);
}

function NewLgaShippingRouteDrawer({ originLga, originState, originCountry, lgas, onClose }) {
	// console.log('originLga', originLga);
	const originLgaData = originLga?.lga || originLga;
	const originLgaId = originLgaData?._id || originLgaData?.id;

	const alreadyRoutedIds = useMemo(() => {
		const table = originLga?.lga?.shippingTable || originLga?.shippingTable || [];
		return new Set(
			table.map((r) => {
				if (typeof r.lgaToShipTo === 'object') return r.lgaToShipTo?._id || r.lgaToShipTo?.id;
				return r.lgaToShipTo;
			})
		);
	}, [originLga]);

	const destinations = useMemo(
		() =>
			lgas.filter((l) => {
				const id = l._id || l.id;
				return id !== originLgaId && !alreadyRoutedIds.has(id);
			}),
		[lgas, originLgaId, alreadyRoutedIds]
	);

	const addRoute = useLgaAddShippingTableMutation();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid, isDirty }
	} = useForm({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			lgaToShipTo: '',
			distanceKm: '',
			landKilogramFreightFee: '',
			airKilogramFreightFee: '',
			perCbmFreightFee: '',
			seaKilogramFreightFee: '',
			landTransitDaysMin: '',
			landTransitDaysMax: '',
			airTransitDaysMin: '',
			airTransitDaysMax: '',
			seaTransitDaysMin: '',
			seaTransitDaysMax: '',
			notes: ''
		}
	});

	useEffect(() => {
		if (addRoute.isSuccess) {
			reset();
			onClose();
		}
	}, [addRoute.isSuccess, reset, onClose]);

	function onSubmit(values) {
		const destLga = destinations?.find((l) => (l._id || l.id) === values.lgaToShipTo);
		addRoute.mutate({
			lgaCheckOrigin: originLgaId,
			lgaToShipTo: values.lgaToShipTo,
			lgaToShipToName: destLga?.name,
			distanceKm: parseInt(values.distanceKm, 10),
			landKilogramFreightFee: parseInt(values.landKilogramFreightFee, 10),
			airKilogramFreightFee: parseInt(values.airKilogramFreightFee, 10),
			perCbmFreightFee: parseInt(values.perCbmFreightFee, 10),
			seaKilogramFreightFee: parseIntField(values.seaKilogramFreightFee),
			landTransitDaysMin: parseIntField(values.landTransitDaysMin),
			landTransitDaysMax: parseIntField(values.landTransitDaysMax),
			airTransitDaysMin: parseIntField(values.airTransitDaysMin),
			airTransitDaysMax: parseIntField(values.airTransitDaysMax),
			seaTransitDaysMin: parseIntField(values.seaTransitDaysMin),
			seaTransitDaysMax: parseIntField(values.seaTransitDaysMax),
			notes: values.notes
		});
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Gradient header */}
			<Box
				sx={{
					background: 'linear-gradient(135deg, #1a237e 0%, #283593 60%, #3949ab 100%)',
					px: 3,
					pt: 4,
					pb: 3,
					position: 'relative',
					flexShrink: 0
				}}
			>
				<IconButton
					onClick={onClose}
					size="small"
					sx={{
						position: 'absolute',
						top: 12,
						right: 12,
						color: 'white',
						bgcolor: 'rgba(255,255,255,0.15)',
						'&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
					}}
				>
					<FuseSvgIcon size={18}>heroicons-outline:x</FuseSvgIcon>
				</IconButton>

				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<Stack
						direction="row"
						alignItems="center"
						spacing={1.5}
						mb={0.75}
					>
						{originCountry?.flag && (
							<Avatar
								src={originCountry.flag}
								sx={{ width: 28, height: 28, border: '2px solid rgba(255,255,255,0.3)' }}
							/>
						)}
						<LgaAvatar
							lga={originLgaData}
							size={38}
						/>
						<Box>
							<Typography
								variant="caption"
								sx={{ color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: 1 }}
							>
								New Route From
							</Typography>
							<Typography
								variant="h6"
								fontWeight={800}
								sx={{ color: 'white', lineHeight: 1.1 }}
							>
								{originLgaData?.name || '…'}
							</Typography>
							{originState && (
								<Typography
									variant="caption"
									sx={{ color: 'rgba(255,255,255,0.55)' }}
								>
									{originState.name}
									{originCountry ? ` · ${originCountry.name}` : ''}
								</Typography>
							)}
						</Box>
					</Stack>
					<Typography
						variant="caption"
						sx={{ color: 'rgba(255,255,255,0.55)' }}
					>
						Define freight rates and transit times to a destination LGA
					</Typography>
				</motion.div>
			</Box>

			{/* Form */}
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
			>
				<Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 3 }}>
					{/* Destination */}
					<SectionHeader
						iconName="heroicons-outline:location-marker"
						title="Route Destination"
						bgColor="rgba(26, 35, 126, 0.08)"
						iconColor="rgb(26, 35, 126)"
					/>

					<Controller
						name="lgaToShipTo"
						control={control}
						render={({ field }) => (
							<FormControl
								fullWidth
								size="small"
								error={!!errors.lgaToShipTo}
								sx={{ mb: 3 }}
							>
								<InputLabel>Destination LGA *</InputLabel>
								<Select
									{...field}
									label="Destination LGA *"
									disabled={!originLgaId}
									sx={{ borderRadius: 2 }}
									renderValue={(value) => {
										const l = destinations?.find((x) => (x._id || x.id) === value);
										if (!l) return null;
										return (
											<Stack
												direction="row"
												alignItems="center"
												spacing={1}
											>
												<LgaAvatar
													lga={l}
													size={20}
												/>
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
										<em>Select destination LGA</em>
									</MenuItem>
									{destinations?.map((lga) => (
										<MenuItem
											key={lga._id || lga.id}
											value={lga._id || lga.id}
										>
											<ListItemIcon sx={{ minWidth: 36 }}>
												<LgaAvatar lga={lga} />
											</ListItemIcon>
											<ListItemText
												primary={lga.name}
												primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
											/>
										</MenuItem>
									))}
								</Select>
								{errors.lgaToShipTo && <FormHelperText>{errors.lgaToShipTo.message}</FormHelperText>}
							</FormControl>
						)}
					/>

					<Divider sx={{ mb: 3 }} />

					{/* Route Distance */}
					<SectionHeader
						iconName="heroicons-outline:arrows-expand"
						title="Route Distance"
						bgColor="rgba(0, 121, 107, 0.08)"
						iconColor="rgb(0, 77, 64)"
					/>

					<Controller
						name="distanceKm"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Road Distance (km) *"
								type="number"
								size="small"
								fullWidth
								error={!!errors.distanceKm}
								helperText={errors.distanceKm?.message}
								InputProps={{
									endAdornment: <InputAdornment position="end">km</InputAdornment>,
									inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
								}}
								sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
							/>
						)}
					/>

					<Divider sx={{ mb: 3 }} />

					{/* Land / Road Freight */}
					<SectionHeader
						iconName="heroicons-outline:truck"
						title="Land / Road Freight"
						bgColor="rgba(46, 125, 50, 0.08)"
						iconColor="rgb(27, 94, 32)"
					/>

					<Controller
						name="landKilogramFreightFee"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Rate per KG (Road) *"
								type="number"
								size="small"
								fullWidth
								error={!!errors.landKilogramFreightFee}
								helperText={errors.landKilogramFreightFee?.message}
								InputProps={{
									startAdornment: <InputAdornment position="start">₦</InputAdornment>,
									inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
								}}
								sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
							/>
						)}
					/>

					<TransitDaysRow
						control={control}
						minName="landTransitDaysMin"
						maxName="landTransitDaysMax"
					/>

					<Divider sx={{ mb: 3 }} />

					{/* Air Freight */}
					<SectionHeader
						iconName="heroicons-outline:paper-airplane"
						title="Air Freight"
						bgColor="rgba(25, 118, 210, 0.08)"
						iconColor="rgb(21, 101, 192)"
					/>

					<Controller
						name="airKilogramFreightFee"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Rate per KG (Air) *"
								type="number"
								size="small"
								fullWidth
								error={!!errors.airKilogramFreightFee}
								helperText={errors.airKilogramFreightFee?.message}
								InputProps={{
									startAdornment: <InputAdornment position="start">₦</InputAdornment>,
									inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
								}}
								sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
							/>
						)}
					/>

					<TransitDaysRow
						control={control}
						minName="airTransitDaysMin"
						maxName="airTransitDaysMax"
					/>

					<Divider sx={{ mb: 3 }} />

					{/* Bulk & Sea */}
					<SectionHeader
						iconName="heroicons-outline:archive"
						title="Bulk / Sea Freight"
						bgColor="rgba(230, 81, 0, 0.08)"
						iconColor="rgb(191, 54, 12)"
					/>

					<Stack
						direction="row"
						spacing={2}
						mb={2}
					>
						<Controller
							name="perCbmFreightFee"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Rate per CBM *"
									type="number"
									size="small"
									fullWidth
									error={!!errors.perCbmFreightFee}
									helperText={errors.perCbmFreightFee?.message}
									InputProps={{
										startAdornment: <InputAdornment position="start">₦</InputAdornment>,
										inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
									}}
									sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
								/>
							)}
						/>
						<Controller
							name="seaKilogramFreightFee"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Rate per KG (Sea)"
									type="number"
									size="small"
									fullWidth
									InputProps={{
										startAdornment: <InputAdornment position="start">₦</InputAdornment>,
										inputProps: { min: 0, step: 1, onKeyDown: blockNonInteger }
									}}
									sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
								/>
							)}
						/>
					</Stack>

					<TransitDaysRow
						control={control}
						minName="seaTransitDaysMin"
						maxName="seaTransitDaysMax"
					/>

					<Divider sx={{ mb: 3 }} />

					{/* Admin Notes */}
					<SectionHeader
						iconName="heroicons-outline:annotation"
						title="Admin Notes"
						bgColor="rgba(0,0,0,0.04)"
						iconColor="text.secondary"
					/>

					<Controller
						name="notes"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Notes (optional)"
								multiline
								rows={3}
								size="small"
								fullWidth
								placeholder="Special handling notes or route-specific instructions…"
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
							/>
						)}
					/>
				</Box>

				{/* Footer */}
				<Box
					sx={{
						px: 3,
						py: 2,
						borderTop: '1px solid',
						borderColor: 'divider',
						bgcolor: 'background.paper',
						flexShrink: 0
					}}
				>
					<Stack
						direction="row"
						spacing={2}
					>
						<Button
							variant="outlined"
							onClick={onClose}
							fullWidth
							sx={{ borderRadius: 2 }}
							disabled={addRoute.isLoading}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="secondary"
							fullWidth
							type="submit"
							disabled={!isValid || !isDirty || addRoute.isLoading}
							sx={{ borderRadius: 2, fontWeight: 700 }}
							startIcon={
								addRoute.isLoading ? (
									<CircularProgress
										size={16}
										color="inherit"
									/>
								) : null
							}
						>
							{addRoute.isLoading ? 'Saving…' : 'Create Route'}
						</Button>
					</Stack>
				</Box>
			</Box>
		</Box>
	);
}

export default NewLgaShippingRouteDrawer;
