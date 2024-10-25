import { motion } from "framer-motion";
import FusePageSimple from "@fuse/core/FusePageSimple";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";

import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { format } from "date-fns/format";
import {
  Button,
  Card,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import clsx from "clsx";
import { useTheme } from "@mui/material/styles";
import { Controller, useForm, useFormContext } from "react-hook-form";
// import { useTransferToShopWalletMutation } from "app/configs/data/server-calls/shopwithdrawals/useShopWithdrawals";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  useCountriesWithShippingTableOriginExcluded,
  useCountryAddShippingTableMutation,
  // useCountryUpdateShippingMutation,
} from "src/app/api/countries/useCountries";
import { useParams } from "react-router";
/**
 * The activities page.
 */

const item = {
  image: "",
  name: "John Doe",
  description:
    "Receive orders from intending buyers, package products ordered and make available at our order collation units within your market,",
};

function AddCountryShipmentForm(props) {
  const {
    toggleNewEntryDrawer,
  } = props;
  const routeParams = useParams();
  const { productId } = routeParams;
  const {
    data: countries,
    isLoading,
    isError,
  } = useCountriesWithShippingTableOriginExcluded(productId);
  // // , {
  // 	skip: !productId || productId === 'new'
  // }
  const [drawerError, setDrawerError] = useState("");

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      countryCheckOrigin: "",
      countryToShipTo: "",
      perCbmFreightFee: "",
      airKilogramFreightFee: "",
      landKilogramFreightFee: "",
    },
    // resolver: zodResolver(schema)
  });
  // const methods = useFormContext();
  const { control, formState, watch, getValues, reset, setValue } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const addToCountryShipmentTable = useCountryAddShippingTableMutation();
  // const updateCountryShipmentTable = useCountryUpdateShippingMutation();


  // const handleClosseDrawer = () => {
  //   console.log("Closing and resetting...");
  //   // toggleDrawer(false)
  //   reset({});
  // };

  function handleSaveShipmentRoute() {
   
    setValue("countryCheckOrigin", productId);
    addToCountryShipmentTable.mutate(getValues());
  }

  // console.log("singelSHIPMENT-COMPONENT_ID", shipmentData?.countryToShipTo?._id)

  useEffect(() =>{
if(addToCountryShipmentTable?.isSuccess){
  reset({})
}
  },[
    addToCountryShipmentTable?.isSuccess

  ])

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageSimple
      content={
        <>
          <div className="flex flex-auto flex-col px-12 py-40 sm:px-6 sm:pb-80 sm:pt-72">
            <div className="flex flex-auto justify-between items-center">
              <Typography
                className="text-2xl font-extrabold leading-none tracking-tight mb-20"
              >
                Manage shipping route.
              </Typography>
              {/* <Typography className="mt-6 text-lg" color="text.secondary">
              You can move your funds from merchant acounts to wallet for onward
              withdrawal.
            </Typography> */}

              <Typography
                className="font-extrabold leading-none tracking-tight mb-20"
                onClick={toggleNewEntryDrawer(false)}
              >
                {" "}
                close form
              </Typography>
            </div>

            <>
              <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
                Shipment Destination Country?
              </Typography>
              <Controller
                name="countryToShipTo"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                  <Select
                    className="mt-8 mb-16"
                    id="countryToShipTo"
                    label="Shipment Destination Country"
                    fullWidth
                    defaultValue=""
                    onChange={onChange}
                    value={value === undefined || null ? "" : value}
                    error={!!errors.countryToShipTo}
                    helpertext={errors?.countryToShipTo?.message}
                  >
                    <MenuItem value="">Select a country</MenuItem>
                    {countries?.data &&
                      countries?.data?.map((option, id) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </>

            <>
              <Controller
                name="perCbmFreightFee"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 mx-4"
                    label=" Price Per Cbm Fee"
                    id="perCbmFreightFee"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">NGN</InputAdornment>
                      ),
                    }}
                    type="number"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </>

            <>
              <Controller
                name="airKilogramFreightFee"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 mx-4"
                    label="  Price Per Kilo (Air-based)"
                    id="airKilogramFreightFee"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">NGN</InputAdornment>
                      ),
                    }}
                    type="number"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </>

            <>
              <Controller
                name="landKilogramFreightFee"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 mx-4"
                    label=" Price Per Kilo (Land-based)"
                    id="landKilogramFreightFee"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">NGN</InputAdornment>
                      ),
                    }}
                    type="number"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </>

            <Button
              className="whitespace-nowrap mx-4"
              variant="contained"
              color="secondary"
              disabled={_.isEmpty(dirtyFields) || !isValid
              || addToCountryShipmentTable?.isLoading
              }
              onClick={handleSaveShipmentRoute}
            >
              Save Shipment Route
            </Button>
          </div>
        </>
      }
      scroll={isMobile ? "normal" : "page"}
    />
  );
}

export default AddCountryShipmentForm;
