import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import { MenuItem, Select, Typography } from "@mui/material";
import useCountries from "src/app/api/countries/useCountries";
import {
  getLgaByStateId,
  getMarketsByLgaId,
  getMarketsByStateId,
  getStateByCountryId,
} from "src/app/api/apiRoutes";
import { useEffect, useState } from "react";
import useHubs from "src/app/api/tradehubs/useTradeHubs";
import useShopplans from "src/app/api/shopplans/useShopPlans";

/**
 * The basic info tab.
 */
function BasicInfoTab({vendorId}) {
  console.log("VENDOR-ID CHECK", vendorId)

  const methods = useFormContext();
  const { control, formState, getValues } = methods;
  const { errors } = formState;
  const [loading, setLoading] = useState(false);

  const { data: hubs, isLoading, refetch } = useHubs();
//   const { data: countries, isFetching } = useCountries();
  const { data:countries, isLoading:countriesLoading } = useCountries();
  const { data: plans } = useShopplans();

  const [bstates, setBstates] = useState([]);
  const [blgas, setBlgas] = useState([]);
  const [markets, setBMarkets] = useState([]);

  useEffect(() => {
    if (getValues()?.businessCountry?.length > 0) {
      getStateDFromCountryId(getValues()?.businessCountry);
    }

    if (getValues()?.businezState?.length > 0) {
      getLgasFromState(getValues()?.businezState);
    }

    if (getValues()?.businezLga?.length > 0) {
      getMarketsFromLgaId(getValues()?.businezLga);
    }
  }, [
    // transferData,
    getValues()?.businessCountry,
    getValues()?.businezState,
    getValues()?.businezLga,
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

  //**Get Marketss from state_ID data */
  async function getMarketsFromState(sid) {
    setLoading(true);
    const responseData = await getMarketsByStateId(getValues()?.businezState);
    if (responseData) {
      setBMarkets(responseData?.data);
      setTimeout(
        function () {
          setLoading(false);
        }.bind(this),
        250
      );
    }
  }
  //**Get Marketss from lga_ID data */ getShopById
  async function getMarketsFromLgaId(lid) {
    if (lid) {
      setLoading(true);
      const responseData = await getMarketsByLgaId(lid);
      if (responseData) {
        setBMarkets(responseData?.data);
        setTimeout(
          function () {
            setLoading(false);
          }.bind(this),
          250
        );
      }
    }
  }

  return (
    <div>
      <Controller
        name="shopname"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Name"
            autoFocuss
            id="shopname"
            variant="outlined"
            fullWidth
            error={!!errors.shopname}
            helperText={errors?.shopname?.message}
          />
        )}
      />

<>
<Typography style={{ fontSize: "12px", fontWeight: "800" }}>Choose your shop country location</Typography>
      <Controller
        name="businessCountry"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            // disabled
            className="mt-8 mb-16"
            id="businessCountry"
            label="business country"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.businessCountry}
            helpertext={errors?.businessCountry?.message}
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

{
  getValues()?.businessCountry?.length > 0 && <>
  <Typography style={{ fontSize: "12px", fontWeight: "800" }} >State of your shop location</Typography>
  <Controller
  name="businezState"
  control={control}
  defaultValue={[]}
  render={({ field: { onChange, value } }) => (
    <Select
      // disabled
      className="mt-8 mb-16"
      id="businezState"
      label="business state"
      fullWidth
      defaultValue=""
      onChange={onChange}
      value={value === undefined || null ? "" : value}
      error={!!errors.businezState}
      helpertext={errors?.businezState?.message}
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
      
      {getValues()?.businezState?.length > 0 &&
        <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>L.G.A/County of your shop location</Typography>
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

      {
        getValues()?.businezLga?.length > 0 && <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>Choose a market for your shop</Typography>
        <Controller
        name="market"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            // disabled
            className="mt-8 mb-16"
            id="market"
            label="business state"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.market}
            helpertext={errors?.market?.message}
          >
            <MenuItem value="">Select a state</MenuItem>
            {markets &&
              markets?.map((option, id) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
          </Select>
        )}
      />
        </>
      }

      

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Trading hub operation
        </Typography>
        <Controller
          name="tradehub"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
            //   disabled
              className="mt-8 mb-16"
              id="tradehub"
              label="Trading Hub"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.tradehub}
              helpertext={errors?.tradehub?.message}
            >
              <MenuItem value="">Select a trading hub</MenuItem>
              {hubs?.data?.data &&
                hubs?.data?.data?.map((option, id) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.hubname}
                  </MenuItem>
                ))}
            </Select>
          )}
        />
      </>

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          Shop Plan to subscribe to?
        </Typography>
        <Controller
          name="shopplan"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
            //   disabled
              className="mt-8 mb-16"
              id="shopplan"
              label="Shop Plan to subscribe to?"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.shopplan}
              helpertext={errors?.shopplan?.message}
            >
              <MenuItem value="">Select a trading hub</MenuItem>
              {plans?.data?.data &&
                plans?.data?.data?.map((option, id) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.plansname}
                  </MenuItem>
                ))}
            </Select>
          )}
        />
      </>

      <Controller
        name="shopphone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Shope Phone"
            autoFocuss
            id="shopphone"
            variant="outlined"
            fullWidth
            error={!!errors.shopphone}
            helperText={errors?.shopphone?.message}
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
            label="Shope Addres"
            autoFocuss
            id="address"
            variant="outlined"
            fullWidth
            error={!!errors.address}
            helperText={errors?.address?.message}
          />
        )}
      />


{
  (vendorId || vendorId !== 'new') &&  <Controller
  name="shopemail"
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      // disabled={(vendorId || vendorId !== 'new')  && true}
      className="mb-24"
      label="Shop Email"
      autoFocus
      type="email"
      error={!!errors.shopemail}
      helperText={errors?.shopemail?.message}
      variant="outlined"
      required
      fullWidth
    />
  )}
/>
}

{
  vendorId === 'new' && 
  <Controller
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
/>  }

    </div>
  );
}

export default BasicInfoTab;
