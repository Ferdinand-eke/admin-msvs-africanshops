import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import { getLgaByStateId, getStateByCountryId } from "src/app/api/apiRoutes";
import useCountries from "src/app/api/countries/useCountries";
import { useEffect, useState } from "react";
import { MenuItem, Select, Typography } from "@mui/material";
import { useParams } from "react-router";

/**
 * The basic info tab.
 */
function BasicInfoTab() {
  const routeParams = useParams();
	const { productId } = routeParams;
  const methods = useFormContext();
  const { control, formState, getValues } = methods;
  const { errors } = formState;

  const {
    data: countries,
    isLoading: countriesLoading,
    refetch,
  } = useCountries();
  const [loading, setLoading] = useState(false);
  const [bstates, setBstates] = useState([]);
  const [blgas, setBlgas] = useState([]);

  useEffect(() => {
    if (getValues()?.officeCountry?.length > 0) {
      getStateDFromCountryId(getValues()?.officeCountry);
    }

    if (getValues()?.officeState?.length > 0) {
      getLgasFromState(getValues()?.officeState);
    }
  }, [getValues()?.officeCountry, getValues()?.officeState]);

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

  //**Get L.G.As from state_ID data */
  async function getLgasFromState(sid) {
    setLoading(true);
    const responseData = await getLgaByStateId(sid);
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

  //   console.log("Office States", bstates)

  return (
    <div>
      <Controller
        name="officeName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Name"
            autoFocus
            id="officeName"
            variant="outlined"
            fullWidth
            error={!!errors.officeName}
            helperText={errors?.officeName?.message}
          />
        )}
      />

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Country of Office
        </Typography>
        <Controller
          name="officeCountry"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
              //   disabled
              className="mt-8 mb-16"
              id="officeCountry"
              label="business country"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.officeCountry}
              helpertext={errors?.officeCountry?.message}
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
      </>

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          State of Office
        </Typography>
        <Controller
          name="officeState"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
              //   disabled
              className="mt-8 mb-16"
              id="officeState"
              label="business state"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.officeState}
              helpertext={errors?.officeState?.message}
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

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          L.G.A/County of Office
        </Typography>
        <Controller
          name="officeLga"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
              //   disabled
              className="mt-8 mb-16"
              id="officeLga"
              label="business state"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.officeLga}
              helpertext={errors?.officeLga?.message}
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

      <Controller
        name="officePhone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Office Phone"
            autoFocus
            id="officePhone"
            variant="outlined"
            fullWidth
            error={!!errors.officePhone}
            helperText={errors?.officePhone?.message}
          />
        )}
      />

      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Address"
            autoFocus
            id="address"
            variant="outlined"
            fullWidth
            error={!!errors.address}
            helperText={errors?.address?.message}
          />
        )}
      />

      <Controller
        name="officeMail"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Office Mail"
            autoFocus
            id="officeMail"
            variant="outlined"
            fullWidth
            error={!!errors.officeMail}
            helperText={errors?.officeMail?.message}
          />
        )}
      />

{
	 productId === 'new' &&  <Controller
	name="password"
	control={control}
	render={({ field }) => (
		<TextField
			{...field}
			className="mb-24"
			label="Password"
			type="password"
			error={!!errors.password}
			helperText={errors?.password?.message}
			variant="outlined"
			required
			fullWidth
		/>
	)}
/>
}

	  <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Are we operational in this country?
        </Typography>
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
            >
              <MenuItem value="">Select an operations status</MenuItem>
              <MenuItem value={false}>Not Operational</MenuItem>

              <MenuItem value={true}>Operational</MenuItem>
            </Select>
          )}
        />
      </>

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Publish this country?
        </Typography>

        <Controller
          name="isPublished"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
              className="mt-8 mb-16"
              id="isPublished"
              label="Operational Status"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.isPublished}
              helpertext={errors?.isPublished?.message}
            >
              <MenuItem value="">Select a publish status</MenuItem>
              <MenuItem value={false}>Not Published</MenuItem>

              <MenuItem value={true}>Published</MenuItem>
            </Select>
          )}
        />
      </>

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Feature this country?
        </Typography>

        <Controller
          name="isFeatured"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
              className="mt-8 mb-16"
              id="isFeatured"
              label="Operational Status"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.isFeatured}
              helpertext={errors?.isFeatured?.message}
            >
              <MenuItem value="">Select an fetaured status</MenuItem>
              <MenuItem value={false}>Not Featured</MenuItem>

              <MenuItem value={true}>Featured</MenuItem>
            </Select>
          )}
        />
      </>
	  
	   
    </div>
  );
}

export default BasicInfoTab;
