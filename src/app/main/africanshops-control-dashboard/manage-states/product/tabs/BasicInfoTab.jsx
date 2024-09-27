import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import useCountries from "src/app/api/countries/useCountries";
import { MenuItem, Select, Typography } from "@mui/material";
import StateSelect from "src/app/apselects/stateselect";
import { 
  // Country, 
  State, 
  // City
 }  from 'country-state-city';
import { useCallback, useEffect, useState } from "react";

/**
 * The basic info tab.
 */
function BasicInfoTab() {
  const {
    data: countries,
    isLoading: countriesLoading,
    refetch,
  } = useCountries();

  const methods = useFormContext();
  const { control, formState, getValues, setValue, watch,  } = methods;
  const { errors } = formState;
  const [filteredCountry, setFilteredCountry] = useState({})

  const statelocation = watch("statelocation");

  
  const setCustomValue = (id, value) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  useEffect(()=>{
    if(getValues().businessCountry){
      // const filteredCountry = countries?.data?.data?.filter((county) => county._id === getValues().businessCountry )
      setFilteredCountry(countries?.data?.data?.filter((county) => county._id === getValues().businessCountry )[0])
     
    }
   
  },[getValues().businessCountry])


  // console.log("statesREPO", State.getStateByCodeAndCountry(stateCode, countryCode))

  // console.log("filteredCountry", filteredCountry)
  // console.log("statesREPO", State.getStatesOfCountry(filteredCountry?.isoCode))
  // console.log("countryOdState", getValues().businessCountry)
  return (
    <div>
      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Country of this state?
        </Typography>
        <Controller
          name="businessCountry"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
              className="mt-8 mb-16"
              id="businessCountry"
              label="business country"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.businessCountry}
              helpertext={errors?.businessCountry?.message}
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
      </>

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
            disabled
          />
        )}
      />

      {/* <StateSelect /> */}
      <StateSelect
            value={statelocation}
            onChange={(value) => setCustomValue("statelocation", value)}
            countryCode={filteredCountry?.isoCode}
          />

      {/* <Controller
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
      /> */}

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Are we operational in this state?
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
          Publish this state?
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
          Feature this state?
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
