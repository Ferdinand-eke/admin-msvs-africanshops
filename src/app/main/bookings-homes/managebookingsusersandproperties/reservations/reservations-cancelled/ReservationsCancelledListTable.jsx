/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useMemo, useState } from "react";
import DataTable from "app/shared-components/data-table/DataTable";
import FuseLoading from "@fuse/core/FuseLoading";
import { Chip, ListItemIcon, MenuItem, Paper } from "@mui/material";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import Button from "@mui/material/Button";
import {  useCancelledBookingsReservationsByAdmin } from "src/app/api/admin-handle-bookingsproperties/useAdminHandleBookingsProperties";

function ReservationsCancelledListTable(props) {
  const {active} = props
 
  const { data: allCancelledReservations, isLoading: allCancelledReservationsIsLoading } =
  useCancelledBookingsReservationsByAdmin();



  const usercolumns = useMemo(
    () => [
      {
        accessorKey: "userCreatorId",
        header: "Guest",
        Cell: ({ row }) => (
          <Typography className="" color="secondary" role="button">
            {row?.original?.userCreatorId?.name}
          </Typography>
        ),
      },

      {
        accessorKey: "bookingPropertyId",
        header: "Host Apartment",
        Cell: ({ row }) => (
          <Typography className="" color="secondary" role="button">
            {row?.original?.bookingPropertyId?.title}
          </Typography>
        ),
      },
      {
        accessorKey: "isPaid",
        header: "Payment status",
        accessorFn: (row) => (
          <div className="flex items-center">
            {row.isPaid ? (
              <FuseSvgIcon className="text-green" size={20}>
              heroicons-outline:check-circle
            </FuseSvgIcon>
             
            ) : (
              <FuseSvgIcon className="text-red" size={20}>
              heroicons-outline:minus-circle
            </FuseSvgIcon>
            )}
          </div>
        ),
      },

    ],
    []
  );

  if (allCancelledReservationsIsLoading) {
    return <FuseLoading />;
  }

  if (!allCancelledReservations?.data?.payload) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          There are no listings!
        </Typography>
      </div>
    );
  }

  return (
    <Paper
      className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
      elevation={0}
    >
      {active === 2 &&  <DataTable data={ allCancelledReservations?.data?.payload} columns={usercolumns} />}
     
    </Paper>
  );
}

export default ReservationsCancelledListTable;

