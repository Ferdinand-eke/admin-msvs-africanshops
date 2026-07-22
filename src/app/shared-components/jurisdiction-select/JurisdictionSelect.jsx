import { MenuItem, Select, Typography } from '@mui/material';
import { useState } from 'react';
import useOperationalCountries from 'src/app/api/countries/useCountries';
import { useOperationalStatesByCountry } from 'src/app/api/states/useStates';
import { useLgasByState } from 'src/app/api/lgas/useLgas';

/**
 * Cascading country/state/LGA picker for civic-vertical jurisdiction fields
 * (YouthProgram/SportsTournament/TalentSpotlight etc. all store these as
 * plain name strings, not places-service ids -- see CivicJurisdiction in
 * africanshops-microservices). Reads from the same operational
 * country/state/lga source used platform-wide for shop/merchant onboarding.
 *
 * `value` is `{ country, state, lga }` (names, not ids) and `onChange`
 * receives the same shape on every field change.
 */
function JurisdictionSelect({ value, onChange }) {
	const [countryId, setCountryId] = useState('');
	const [stateId, setStateId] = useState('');

	const { data: countriesRes } = useOperationalCountries();
	const { data: statesRes } = useOperationalStatesByCountry(countryId);
	const { data: lgasRes } = useLgasByState(stateId);

	// Response shapes confirmed against the backend (country/state/lga.service.ts):
	// { success, statusCode, countries/states/lgas: [...] } -- not a generic "data" key.
	const countries = countriesRes?.data?.countries ?? [];
	const states = statesRes?.data?.states ?? [];
	const lgas = lgasRes?.data?.lgas ?? [];

	function handleCountryChange(id) {
		const country = countries.find((c) => c.id === id);
		setCountryId(id);
		setStateId('');
		onChange({ country: country?.name ?? '', state: '', lga: '' });
	}

	function handleStateChange(id) {
		const state = states.find((s) => s.id === id);
		setStateId(id);
		onChange({ ...value, state: state?.name ?? '', lga: '' });
	}

	function handleLgaChange(id) {
		const lga = lgas.find((l) => l.id === id);
		onChange({ ...value, lga: lga?.name ?? '' });
	}

	return (
		<div className="flex flex-col gap-16">
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
						<MenuItem
							key={c.id}
							value={c.id}
						>
							{c.name}
						</MenuItem>
					))}
				</Select>
			</div>

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
						<MenuItem
							key={s.id}
							value={s.id}
						>
							{s.name}
						</MenuItem>
					))}
				</Select>
			</div>

			<div>
				<Typography style={{ fontSize: '12px', fontWeight: '800' }}>LGA</Typography>
				<Select
					className="mt-8"
					fullWidth
					value={lgas.find((l) => l.name === value?.lga)?.id ?? ''}
					onChange={(e) => handleLgaChange(e.target.value)}
					displayEmpty
					disabled={!stateId}
				>
					<MenuItem value="">Select an LGA</MenuItem>
					{lgas.map((l) => (
						<MenuItem
							key={l.id}
							value={l.id}
						>
							{l.name}
						</MenuItem>
					))}
				</Select>
			</div>
		</div>
	);
}

export default JurisdictionSelect;
