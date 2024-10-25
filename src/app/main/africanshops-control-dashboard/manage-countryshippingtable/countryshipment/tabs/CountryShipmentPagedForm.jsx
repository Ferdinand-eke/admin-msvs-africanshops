// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import { Controller, useFormContext } from "react-hook-form";
// import { Chip, InputAdornment, MenuItem, Paper, Select, Typography, useTheme } from "@mui/material";
// import DataTable from 'app/shared-components/data-table/DataTable';
// import { useMemo } from "react";
// import { motion, useAnimation } from "framer-motion";

// /**
//  * The basic info tab.
//  */
// function CountryShipmentPagedForm({toggleDrawer}) {
//   const methods = useFormContext();
// //   const { control, formState, getValues } = methods;
// //   const { errors } = formState;

//   return (
//     <>

// 			<h3
// 			 onClose={() => toggleDrawer(false)}
// 			>Form to add Country shipment datas</h3>
// 	</>
//   );
// }

// export default CountryShipmentPagedForm;

import { motion } from "framer-motion";
import FusePageSimple from "@fuse/core/FusePageSimple";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
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
  useCountryUpdateShippingMutation,
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

function CountryShipmentPagedForm(props) {
  //   const tranferFunds = useTransferToShopWalletMutation();
  const {
    shipmentData,

    // toggleDrawer
  } = props;
  const defaultId = "new";
  // console.log("singleShipment-IN-ShipmentForm", shipmentData)
  const routeParams = useParams();
  const { productId } = routeParams;
  const { destinationId } = routeParams;

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
  const updateCountryShipmentTable = useCountryUpdateShippingMutation();
  // const methods = useFormContext();

  //   const { data: shopData, isLoading, isError } = useGetMyShopDetails();
  //   const {
  //     data: shopAccount,
  //     isLoading: accountLoading,
  //     isError: accountError,
  //   } = useGetShopAccountBalance();

  //   function handleMoveFunds() {
  //     console.log("move ammount", getValues());
  //     if (
  //       getValues()?.transferAmount === "" ||
  //       getValues()?.transferAmount === null ||
  //       parseInt(getValues()?.transferAmount) === 0
  //     ) {
  //       setDrawerError("transfer amount required");
  //       return toast.error("transfer amount required");
  //     }

  //     if (
  //       shopData?.data?.data?.shopaccount?.accountbalance <
  //       getValues()?.transferAmount
  //     ) {
  //       setDrawerError("insufficient balance to transfer");
  //       return toast.error("insufficient balance to transfer");
  //     }

  //     tranferFunds.mutate(getValues());
  //   }

  //   useEffect(() => {
  //     if (tranferFunds?.isSuccess) {
  //       setDrawerError("");
  //       reset();
  //     }
  //   }, [tranferFunds?.isSuccess]);

  useEffect(() => {
    if (destinationId) {
      // reset({
      //   ...shipmentData,
      //   countryToShipTo: shipmentData?.countryToShipTo?._id,
      // });
    }
  }, [
    shipmentData?.countryToShipTo?._id,
    destinationId,
    reset,
    // shipmentData, reset
  ]);
  useEffect(() => {
		if (destinationId === 'new') {
			reset({});
		}
	}, [productId, reset]);

  const handleClosseDrawer = () => {
    console.log("Closing and resetting...");
    // toggleDrawer(false)
    reset({});
  };

  function handleSaveShipmentRoute() {
    if (destinationId === 'new') {
      console.log("adding New Shipment-Route", getValues());
      setValue("countryCheckOrigin", productId);
      addToCountryShipmentTable.mutate(getValues());
      
    } else {
     
      //update country shipment table
      console.log("updating Shipment-Route", getValues());
      updateCountryShipmentTable.mutate(getValues());
    }
  }

  // console.log(
  //   "singelSHIPMENT-COMPONENT_ID",
  //   shipmentData?.countryToShipTo?._id
  // );

  console.log("OriginCountry", productId)
  console.log("destinatioCountry", destinationId)

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

              {/* <Typography
                className="font-extrabold leading-none tracking-tight mb-20"
                onClick={() => handleClosseDrawer()}
              >
                {" "}
                clear form
              </Typography> */}
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
                    //  {...other}
                    //  {...(error && {error: true, helperText: error})}
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
              disabled={
                _.isEmpty(dirtyFields) || !isValid
                //   ||
                //   tranferFunds?.isLoading
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

export default CountryShipmentPagedForm;
