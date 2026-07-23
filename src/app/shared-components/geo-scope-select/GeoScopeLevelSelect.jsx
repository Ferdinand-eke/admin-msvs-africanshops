import { MenuItem, Select, Typography } from '@mui/material';
import { useState } from 'react';
import useOperationalCountries from 'src/app/api/countries/useCountries';
import { useOperationalStatesByCountry } from 'src/app/api/states/useStates';
import { useLgasByState } from 'src/app/api/lgas/useLgas';
import { useMarketsByLga } from 'src/app/api/markets/useMarkets';

const LEVELS = ['COUNTRY', 'STATE', 'LGA', 'MARKET'];

/**
 * Single-level geo-scope picker for GEO_ASSET admin assignment
 * (`PUT /authadmin/admin/:adminId/assign-geo-scope`). Unlike
 * `JurisdictionSelect` (which always collects all 3 name fields for
 * civic-vertical jurisdiction data), this collects exactly one level's
 * places-service **id** as `geoRefId` -- the backend resolves that id to
 * the place's canonical name server-side before persisting it.
 *
 * WARD is intentionally not offered yet: no frontend hook exists for it
 * and its district/LGA hierarchy isn't confirmed here.
 *
 * `value` is `{ geoLevel, geoRefId }`, `onChange` receives the same shape.
 */
function GeoScopeLevelSelect({ value, onChange }) {
	const [countryId, setCountryId] = useState('');
	const [stateId, setStateId] = useState('');
	const [lgaId, setLgaId] = useState('');

	const geoLevel = value?.geoLevel ?? '';

	const { data: countriesRes } = useOperationalCountries();
	const { data: statesRes } = useOperationalStatesByCountry(countryId);
	const { data: lgasRes } = useLgasByState(stateId);
	const { data: marketsRes } = useMarketsByLga(lgaId);

	const countries = countriesRes?.data?.countries ?? [];
	const states = statesRes?.data?.states ?? [];
	const lgas = lgasRes?.data?.lgas ?? [];
	const markets = marketsRes?.data?.markets ?? [];

	function handleLevelChange(level) {
		setCountryId('');
		setStateId('');
		setLgaId('');
		onChange({ geoLevel: level, geoRefId: '' });
	}

	function handleCountryChange(id) {
		setCountryId(id);
		setStateId('');
		setLgaId('');
		onChange({ geoLevel, geoRefId: geoLevel === 'COUNTRY' ? id : '' });
	}

	function handleStateChange(id) {
		setStateId(id);
		setLgaId('');
		onChange({ geoLevel, geoRefId: geoLevel === 'STATE' ? id : '' });
	}

	function handleLgaChange(id) {
		setLgaId(id);
		onChange({ geoLevel, geoRefId: geoLevel === 'LGA' ? id : '' });
	}

	function handleMarketChange(id) {
		onChange({ geoLevel, geoRefId: id });
	}

	return (
		<div className="flex flex-col gap-16">
			<div>
				<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Scope Level</Typography>
				<Select
					className="mt-8"
					fullWidth
					value={geoLevel}
					onChange={(e) => handleLevelChange(e.target.value)}
					displayEmpty
				>
					<MenuItem value="">Select a level</MenuItem>
					{LEVELS.map((level) => (
						<MenuItem key={level} value={level}>
							{level}
						</MenuItem>
					))}
				</Select>
			</div>

			{geoLevel && (
				<div>
					<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Country</Typography>
					<Select
						className="mt-8"
						fullWidth
						value={countryId}
						onChange={(e) => handleCountryChange(e.target.value)}
						displayEmpty
					>
						<MenuItem value="">Select a country</MenuItem>
						{countries.map((c) => (
							<MenuItem key={c.id} value={c.id}>
								{c.name}
							</MenuItem>
						))}
					</Select>
				</div>
			)}

			{['STATE', 'LGA', 'MARKET'].includes(geoLevel) && (
				<div>
					<Typography style={{ fontSize: '12px', fontWeight: '800' }}>State</Typography>
					<Select
						className="mt-8"
						fullWidth
						value={stateId}
						onChange={(e) => handleStateChange(e.target.value)}
						displayEmpty
						disabled={!countryId}
					>
						<MenuItem value="">Select a state</MenuItem>
						{states.map((s) => (
							<MenuItem key={s.id} value={s.id}>
								{s.name}
							</MenuItem>
						))}
					</Select>
				</div>
			)}

			{['LGA', 'MARKET'].includes(geoLevel) && (
				<div>
					<Typography style={{ fontSize: '12px', fontWeight: '800' }}>LGA</Typography>
					<Select
						className="mt-8"
						fullWidth
						value={lgaId}
						onChange={(e) => handleLgaChange(e.target.value)}
						displayEmpty
						disabled={!stateId}
					>
						<MenuItem value="">Select an LGA</MenuItem>
						{lgas.map((l) => (
							<MenuItem key={l.id} value={l.id}>
								{l.name}
							</MenuItem>
						))}
					</Select>
				</div>
			)}

			{geoLevel === 'MARKET' && (
				<div>
					<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Market</Typography>
					<Select
						className="mt-8"
						fullWidth
						value={value?.geoRefId ?? ''}
						onChange={(e) => handleMarketChange(e.target.value)}
						displayEmpty
						disabled={!lgaId}
					>
						<MenuItem value="">Select a market</MenuItem>
						{markets.map((m) => (
							<MenuItem key={m.id ?? m._id} value={m.id ?? m._id}>
								{m.name}
							</MenuItem>
						))}
					</Select>
				</div>
			)}
		</div>
	);
}

export default GeoScopeLevelSelect;
