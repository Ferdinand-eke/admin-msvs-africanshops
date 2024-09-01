import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import useCountries from "src/app/api/countries/useCountries";
import { useEffect, useState } from "react";
import {
  getOperationalLgaByStateId,
  getStateByCountryId,
} from "src/app/api/apiRoutes";
import { MenuItem, Select, Typography } from "@mui/material";
import useMarketCats from "src/app/api/market-category/useMarketCats";

/**
 * The basic info tab.
 */
function BasicInfoTab() {
  const {
    data: countries,
    isLoading: countriesLoading,
    refetch,
  } = useCountries();
  const [loading, setLoading] = useState(false);
  const [bstates, setBstates] = useState([]);
  const [blgas, setBlgas] = useState([]);
  const { data: marketCatData } = useMarketCats();

  const methods = useFormContext();
  const { control, formState, getValues } = methods;
  const { errors } = formState;

  useEffect(() => {
    if (getValues()?.businesscountry?.length > 0 ) {
      getStateDFromCountryId(getValues()?.businesscountry);
    }

    if (getValues()?.businezstate?.length > 0 ) {
      getLgasFromState(getValues()?.businezstate);
    }
  }, [
    getValues()?.businesscountry,
    getValues()?.businezstate,
    getValues()?.businezLga,
    getValues()?.makeWarehouse,
  ]);

  async function getStateDFromCountryId(pid) {
    setLoading(true);

    const responseData = await getStateByCountryId(pid);

    if (responseData) {
      setBstates(responseData?.data);
      setTimeout(
        function () {
          setLoading(false);
        }.bind(this),
        250
      );
    }
  }

  async function getLgasFromState(sid) {
    setLoading(true);
    const responseData = await getOperationalLgaByStateId(sid);
    if (responseData) {
      setBlgas(responseData?.data);
      setTimeout(
        function () {
          setLoading(false);
        }.bind(this),
        250
      );
    }
  }

  return (
    <div>
		<Typography style={{ fontSize: "12px", fontWeight: "800" }}>Select a country</Typography>
      <Controller
        name="businesscountry"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            // disabled
            className="mt-8 mb-16"
            id="businesscountry"
            label="business country"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.businesscountry}
            // helpertext={errors?.businesscountry?.message ? errors?.businesscountry?.message : "Select a country"}
			variant="outlined"
			helperText="Select a country"
            //  {...other}
            //  {...(error && {error: true, helperText: error})}
          >
            <MenuItem value="">Select a country</MenuItem>
            {countries?.data?.data &&
              countries?.data?.data?.map((option, id) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
          </Select>
        )}
      />

{
	getValues()?.businesscountry?.length > 0 && 
	<>
	<Typography style={{ fontSize: "12px", fontWeight: "800" }}>Select a state</Typography>
	<Controller
	name="businezstate"
	control={control}
	defaultValue={[]}
	render={({ field: { onChange, value } }) => (
	  <Select
		// disabled
		className="mt-8 mb-16"
		id="businezstate"
		label="business state"
		fullWidth
		defaultValue=""
		onChange={onChange}
		value={value === undefined || null ? "" : value}
		error={!!errors.businezstate}
		helpertext={errors?.businezstate?.message}
		//  {...other}
		//  {...(error && {error: true, helperText: error})}
	  >
		<MenuItem value="">Select a state</MenuItem>
		{bstates &&
		  bstates?.map((option, id) => (
			<MenuItem key={option._id} value={option._id}>
			  {option.name}
			</MenuItem>
		  ))}
	  </Select>
	)}
  />
	</>
}
      
{
	 getValues()?.businezstate?.length > 0 && 
	<>
	 <Typography style={{ fontSize: "12px", fontWeight: "800" }}>Select an L.G.A/County</Typography>
	 <Controller
	 name="businezLga"
	 control={control}
	 defaultValue={[]}
	 render={({ field: { onChange, value } }) => (
	   <Select
		 // disabled
		 className="mt-8 mb-16"
		 id="businezLga"
		 label="business state"
		 fullWidth
		 defaultValue=""
		 onChange={onChange}
		 value={value === undefined || null ? "" : value}
		 error={!!errors.businezLga}
		 helpertext={errors?.businezLga?.message}
		 //  {...other}
		 //  {...(error && {error: true, helperText: error})}
	   >
		 <MenuItem value="">Select a state</MenuItem>
		 {blgas &&
		   blgas?.map((option, id) => (
			 <MenuItem key={option._id} value={option._id}>
			   {option.name}
			 </MenuItem>
		   ))}
	   </Select>
	 )}
   />
	</>
}

<Typography style={{ fontSize: "12px", fontWeight: "800" }}>Select a market category</Typography>
<Controller
        name="marketcategory"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            // disabled
            className="mt-8 mb-16"
            id="marketcategory"
            label="business state"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.marketcategory}
            helpertext={errors?.marketcategory?.message}
            //  {...other}
            //  {...(error && {error: true, helperText: error})}
          >
            <MenuItem value="">Select a state</MenuItem>
            {marketCatData?.data?.data &&
              marketCatData?.data?.data?.map((option, id) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
          </Select>
        )}
      />

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Name"
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
            error={!!errors.name}
            helperText={errors?.name?.message}
          />
        )}
      />

      
<Controller
        name="localityaddress"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Address"
            autoFocus
            id="localityaddress"
            variant="outlined"
            fullWidth
            error={!!errors.localityaddress}
            helperText={errors?.localityaddress?.message}
          />
        )}
      />

<Controller
        name="zipCode"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Zip Code"
            autoFocus
            id="zipCode"
            variant="outlined"
            fullWidth
            error={!!errors.zipCode}
            helperText={errors?.zipCode?.message}
          />
        )}
      />

<Controller
        name="lat"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Geo Latitude"
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
            error={!!errors.lat}
            helperText={errors?.lat?.message}
          />
        )}
      />

<Controller
        name="lng"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Geo Longitude"
            autoFocus
            id="lng"
            variant="outlined"
            fullWidth
            error={!!errors.lng}
            helperText={errors?.lng?.message}
          />
        )}
      />

<Typography style={{ fontSize: "12px", fontWeight: "800" }}>Is this market operational?</Typography>
<Controller
        name="isInOperation"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="isInOperation"
            label="Operational Status"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.isInOperation}
            helpertext={errors?.isInOperation?.message}
            //  {...other}
            //  {...(error && {error: true, helperText: error})}
          >
            <MenuItem value="">Select an operations status</MenuItem>
                <MenuItem 
				 value={false}>
                  Not Operational
                </MenuItem>

				<MenuItem 
				 value={true}>
                  Operational
                </MenuItem>
       
          </Select>
        )}
      />

<Typography style={{ fontSize: "12px", fontWeight: "800" }}>Is this market a warehouse location?</Typography>
<Controller
        name="makeWarehouse"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="makeWarehouse"
            label="Operational Status"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.makeWarehouse}
            helpertext={errors?.makeWarehouse?.message}
            //  {...other}
            //  {...(error && {error: true, helperText: error})}
          >
            <MenuItem value="">Select a Warehouse status</MenuItem>
                <MenuItem 
				 value={false}>
                  Not Warehouse
                </MenuItem>

				<MenuItem 
				 value={true}>
                  Warehouse
                </MenuItem>
       
          </Select>
        )}
      />

    </div>
  );
}

export default BasicInfoTab;
