import { useState } from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Drawer } from '@mui/material';
import DistrictShippingTablesHeader from './DistrictShippingTablesHeader';
import DistrictShippingTable from './DistrictShippingTable';
import NewDistrictShippingRouteDrawer from './NewDistrictShippingRouteDrawer';
import EditDistrictShippingRouteDrawer from './EditDistrictShippingRouteDrawer';
import { useCountriesWithShippingTable } from '../../../../api/countries/useCountries';
import { useStatesByCountry } from '../../../../api/states/useStates';
import { useLgasWithShippingTable } from '../../../../api/lgas/useLgas';
import { useDistrictsWithShippingTable } from '../../../../api/districts/useDistricts';

function DistrictShippingTables() {
	const [selectedCountryId, setSelectedCountryId] = useState('');
	const [selectedStateId, setSelectedStateId] = useState('');
	const [selectedLgaId, setSelectedLgaId] = useState('');
	const [selectedDistrictId, setSelectedDistrictId] = useState('');
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

	// Step 3 — LGAs scoped by state
	const { data: lgasData, isLoading: loadingLgas } = useLgasWithShippingTable(selectedStateId);
	const lgas = lgasData?.data?.lgas || lgasData?.data || [];
	const selectedLga = lgas.find((l) => (l._id || l.id) === selectedLgaId) || null;

	// Step 4 — districts scoped by LGA (includes shippingTable for route-count hint in picker)
	const { data: districtsData, isLoading: loadingDistricts } = useDistrictsWithShippingTable(selectedLgaId);
	const districts = districtsData?.data?.districts || districtsData?.data || [];

	// Full district record (populated shippingTable) for the selected origin district
	// const { data: districtFullData, isLoading: loadingDistrictRecord } = useDistrictFullRecord(selectedDistrictId);
	// const districtFullRecord = districtFullData?.data?.district || districtFullData?.data || null;
	// districtFullRecord ||
	// || loadingDistrictRecord

	// Prefer the fully populated record; fall back to the list entry while fetch is in flight
	const listDistrict = districts.find((d) => (d._id || d.id) === selectedDistrictId) || null;
	const originDistrict = listDistrict;

	function handleCountryChange(countryId) {
		setSelectedCountryId(countryId);
		setSelectedStateId('');
		setSelectedLgaId('');
		setSelectedDistrictId('');
	}

	function handleStateChange(stateId) {
		setSelectedStateId(stateId);
		setSelectedLgaId('');
		setSelectedDistrictId('');
	}

	function handleLgaChange(lgaId) {
		setSelectedLgaId(lgaId);
		setSelectedDistrictId('');
	}

	function handleEditRoute(route) {
		setSelectedRoute(route);
		setEditRouteOpen(true);
	}

	return (
		<>
			<GlobalStyles styles={() => ({ '#root': { maxHeight: '100vh' } })} />
			<div className="w-full h-full flex flex-col">
				<DistrictShippingTablesHeader
					countries={countries}
					states={states}
					lgas={lgas}
					districts={districts}
					selectedCountryId={selectedCountryId}
					selectedStateId={selectedStateId}
					selectedLgaId={selectedLgaId}
					selectedDistrictId={selectedDistrictId}
					onCountryChange={handleCountryChange}
					onStateChange={handleStateChange}
					onLgaChange={handleLgaChange}
					onDistrictChange={setSelectedDistrictId}
					onAddRoute={() => setNewRouteOpen(true)}
					isLoading={loadingCountries}
					loadingStates={loadingStates}
					loadingLgas={loadingLgas}
					loadingDistricts={loadingDistricts}
				/>

				<DistrictShippingTable
					originDistrict={originDistrict}
					selectedLga={selectedLga}
					selectedState={selectedState}
					selectedCountry={selectedCountry}
					districts={districts}
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
					<NewDistrictShippingRouteDrawer
						originDistrict={originDistrict}
						originLga={selectedLga}
						originState={selectedState}
						originCountry={selectedCountry}
						districts={districts}
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
					<EditDistrictShippingRouteDrawer
						route={selectedRoute}
						originDistrict={originDistrict}
						originCountry={selectedCountry}
						districts={districts}
						onClose={() => setEditRouteOpen(false)}
					/>
				</Drawer>
			</div>
		</>
	);
}

export default DistrictShippingTables;
