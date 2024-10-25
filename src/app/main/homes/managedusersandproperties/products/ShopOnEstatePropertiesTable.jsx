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
import {
  useDeleteECommerceProductsMutation,
  useGetECommerceProductsQuery,
} from "../ECommerceApi";
import useGetAllListings from "src/app/aaqueryhooks/listingssHandlingQuery";
import useGetAllUsers from "src/app/aaqueryhooks/usersHandlingQuery";
import { useShopOnEstateProperties } from "src/app/api/admin-handle-estateproperties/useAdminHandleEstateProperties";

function ShopOnEstatePropertiesTable() {
  // const { data: products, isLoading } = useGetECommerceProductsQuery();
  const [filteredShop, setFilteredShop] = useState([]);
  const [removeProducts] = useDeleteECommerceProductsMutation();

  // const {data:listingData, isLoading:listingIsLoading} = useGetAllListings()

  // console.log('Listing-MANAGED', listingData?.data?.listings)

  const { data: usresData, isLoading: usersIsLoading } =
    useShopOnEstateProperties();

  // console.log("MANAGED-USER&&LISTINGS", usresData?.data?.shopsOnEstates)

  useEffect(() => {
    if (usresData?.data?.shopsOnEstates?.length > 0) {
      // console.log("11")

      // const shopsOnEstateProperties =  usresData?.data?.shopsOnEstates?.filter((shop) => {
      // 	// console.log("22", shop)
      // 	return console.log("InsideIF", shop?.shopplan?.plankey?.toString() === 'REALESTATES')
      // })
      setFilteredShop(
        usresData?.data?.shopsOnEstates?.filter(
          (shop) => shop?.shopplan?.plankey === "REALESTATES"
        )
      );
      // console.log("InsideIF". shopsOnEstateProperties)
    }
  }, [usresData?.data?.shopsOnEstates]);

  console.log("filtered-USER&&LISTINGS", filteredShop);

  const usercolumns = useMemo(
    () => [
      {
        accessorKey: "shopname",
        header: "Name",
        Cell: ({ row }) => (
          <Typography
            // component={Link}
            // to={`/property/managed-listings/${row.original.id}/${row.original.handle}`}
            className="underline"
            color="secondary"
            role="button"
          >
            {row?.original?.shopname}
          </Typography>
        ),
      },
      {
        accessorKey: "shopemail",
        header: "Email",
        accessorFn: (row) => (
          <div className="flex flex-wrap space-x-2">
            {/* {row.categories.map((item) => (
							<Chip
								key={item}
								className="text-11"
								size="small"
								color="default"
								label={item}
							/>
						))}
						 */}
            <Chip
              // key={item}
              className="text-11"
              size="small"
              color="default"
              label={row?.shopemail}
            />
          </div>
        ),
      },
      // {
      // 	accessorKey: 'priceTaxIncl',
      // 	header: 'Price',
      // 	accessorFn: (row) => `$${row?.price}`
      // },
      // {
      // 	accessorKey: 'quantity',
      // 	header: 'Room Count',
      // 	accessorFn: (row) => (
      // 		<div className="flex items-center space-x-8">
      // 			<span>{row?.roomCount} rooms</span>

      // 		</div>
      // 	)
      // },
      {
        accessorKey: "active",
        header: "Active",
        accessorFn: (row) => (
          <div className="flex items-center">
            {row.isSuspended ? (
              <FuseSvgIcon className="text-red" size={20}>
                heroicons-outline:minus-circle
              </FuseSvgIcon>
            ) : (
              <FuseSvgIcon className="text-green" size={20}>
                heroicons-outline:check-circle
              </FuseSvgIcon>
            )}
          </div>
        ),
      },

      {
        accessorKey: "management",
        header: "Management User Console",
        Cell: ({ row }) => (
          <div className="flex flex-wrap space-x-2">
			<Chip
							
							component={Link}
					to={`/userlistings/managed-user-listings/${row.original._id}/userproperties`}
							className="bg-green-400 text-11 cursor-pointer"
							size="small"
							color="default"
							label="Manage this User & listing(s)"
						/>
            {/* {row?.original?.listings?.length > 0 ? (
              <>
                <Chip
                  component={Link}
                  to={`/userlistings/managed-user-listings/${row.original._id}/userproperties`}
                  className="bg-green-400 text-11 cursor-pointer"
                  size="small"
                  color="default"
                  label="Manage this User & listing(s)"
                />
              </>
            ) : (
              <>
                <Chip
                  className="text-11 cursor-pointer"
                  size="small"
                  color="default"
                  label="User has no listing"
                />
              </>
            )} */}
          </div>
        ),
      },
    ],
    []
  );

  // if (isLoading) {
  // 	return <FuseLoading />;
  // }
  if (usersIsLoading) {
    return <FuseLoading />;
  }
  // if(!listingData?.data?.listings){
  // 	return <></>
  // }

  if (!usresData?.data?.shopsOnEstates) {
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
      {/* <DataTable
				data={listingData?.data?.listings}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							removeProducts([row.original.id]);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
						</ListItemIcon>
						Delete
					</MenuItem>
				]}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows = table.getSelectedRowModel().rows;
								removeProducts(selectedRows.map((row) => row.original.id));
								table.resetRowSelection();
							}}
							className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8"
							color="secondary"
						>
							<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
							<span className="hidden sm:flex mx-8">Delete selected items</span>
						</Button>
					);
				}}
			/> */}

      <DataTable
        data={filteredShop}
        columns={usercolumns}
        renderRowActionMenuItems={({ closeMenu, row, table }) => [
          <MenuItem
            key={0}
            onClick={() => {
              // removeProducts([row.original.id]);
              closeMenu();
              table.resetRowSelection();
            }}
          >
            <ListItemIcon>
              <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
            </ListItemIcon>
            Delete
          </MenuItem>,
        ]}
        renderTopToolbarCustomActions={({ table }) => {
          const { rowSelection } = table.getState();

          if (Object.keys(rowSelection).length === 0) {
            return null;
          }

          return (
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                const selectedRows = table.getSelectedRowModel().rows;
                // removeProducts(selectedRows.map((row) => row.original.id));
                table.resetRowSelection();
              }}
              className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8"
              color="secondary"
            >
              <FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
              <span className="hidden sm:flex mx-8">Delete selected items</span>
            </Button>
          );
        }}
      />
    </Paper>
  );
}

export default ShopOnEstatePropertiesTable;
