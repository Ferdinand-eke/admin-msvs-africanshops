import { useState } from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Drawer } from '@mui/material';
import LgaShippingTablesHeader from './LgaShippingTablesHeader';
import LgaShippingTable from './LgaShippingTable';
import NewLgaShippingRouteDrawer from './NewLgaShippingRouteDrawer';
import EditLgaShippingRouteDrawer from './EditLgaShippingRouteDrawer';
import { useCountriesWithShippingTable } from '../../../../api/countries/useCountries';
import { useStatesByCountry } from '../../../../api/states/useStates';
import {  useLgasWithShippingTable } from '../../../../api/lgas/useLgas';

function LgaShippingTables() {
	const [selectedCountryId, setSelectedCountryId] = useState('');
	const [selectedStateId, setSelectedStateId] = useState('');
	const [selectedLgaId, setSelectedLgaId] = useState('');
	const [newRouteOpen, setNewRouteOpen] = useState(false);
	const [editRouteOpen, setEditRouteOpen] = useState(false);
	const [selectedRoute, setSelectedRoute] = useState(null);

	// Step 1 — countries
	const { data: countriesData, isLoading: loadingCountries } = useCountriesWithShippingTable();
	const countries = countriesData?.data?.countries || [];
	const selectedCountry = countries.find((c) => (c._id || c.id) === selectedCountryId) || null;

	// Step 2 — states scoped by country
	const { data: statesData, isLoading: loadingStates } = useStatesByCountry(selectedCountryId);
	const states = statesData?.data?.states || statesData?.data || [];
	const selectedState = states.find((s) => (s._id || s.id) === selectedStateId) || null;

	// Step 3 — LGAs scoped by state (includes shippingTable for route-count hint in picker)
	const { data: lgasData, isLoading: loadingLgas } = useLgasWithShippingTable(selectedStateId);
	const lgas = lgasData?.data?.lgas || lgasData?.data || [];


	// Prefer the fully populated record; fall back to the list entry so the UI
	// never goes blank while the full-record fetch is in flight.
	const listLga = lgas.find((l) => (l._id || l.id) === selectedLgaId) || null;
	const originLga = listLga;

	function handleCountryChange(countryId) {
		setSelectedCountryId(countryId);
		setSelectedStateId('');
		setSelectedLgaId('');
	}

	function handleStateChange(stateId) {
		setSelectedStateId(stateId);
		setSelectedLgaId('');
	}

	function handleEditRoute(route) {
		setSelectedRoute(route);
		setEditRouteOpen(true);
	}

	return (
		<>
			<GlobalStyles styles={() => ({ '#root': { maxHeight: '100vh' } })} />
			<div className="w-full h-full flex flex-col">
				<LgaShippingTablesHeader
					countries={countries}
					states={states}
					lgas={lgas}
					selectedCountryId={selectedCountryId}
					selectedStateId={selectedStateId}
					selectedLgaId={selectedLgaId}
					onCountryChange={handleCountryChange}
					onStateChange={handleStateChange}
					onLgaChange={setSelectedLgaId}
					onAddRoute={() => setNewRouteOpen(true)}
					isLoading={loadingCountries}
					loadingStates={loadingStates}
					loadingLgas={loadingLgas}
				/>

				<LgaShippingTable
					originLga={originLga}
					selectedState={selectedState}
					selectedCountry={selectedCountry}
					lgas={lgas}
					onEditRoute={handleEditRoute}
				/>

				<Drawer
					anchor="right"
					open={newRouteOpen}
					onClose={() => setNewRouteOpen(false)}
					PaperProps={{
						sx: {
							width: { xs: '100%', sm: 520 },
							borderRadius: '16px 0 0 16px',
							overflow: 'hidden'
						}
					}}
				>
					<NewLgaShippingRouteDrawer
						originLga={originLga}
						originState={selectedState}
						originCountry={selectedCountry}
						lgas={lgas}
						onClose={() => setNewRouteOpen(false)}
					/>
				</Drawer>

				<Drawer
					anchor="right"
					open={editRouteOpen}
					onClose={() => setEditRouteOpen(false)}
					PaperProps={{
						sx: {
							width: { xs: '100%', sm: 520 },
							borderRadius: '16px 0 0 16px',
							overflow: 'hidden'
						}
					}}
				>
					<EditLgaShippingRouteDrawer
						route={selectedRoute}
						originLga={originLga}
						originState={selectedState}
						originCountry={selectedCountry}
						lgas={lgas}
						onClose={() => setEditRouteOpen(false)}
					/>
				</Drawer>
			</div>
		</>
	);
}

export default LgaShippingTables;
