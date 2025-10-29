/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState } from "react";
import DataTable from "app/shared-components/data-table/DataTable";
import { Box, Chip, CircularProgress, LinearProgress, Paper } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import useAdminGetEstateProperties from "src/app/api/admin-handle-estateproperties/useAdminHandleEstateProperties";

function ShopOnEstatePropertiesTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const [globalFilter, setGlobalFilter] = useState('');

  // Calculate offset from pageIndex and pageSize
  const offset = pagination.pageIndex * pagination.pageSize;
  const limit = pagination.pageSize;

  const { data: propertiesData, isLoading, isFetching, isError } = useAdminGetEstateProperties({
    limit,
    offset,
    title: globalFilter || undefined,
  });

  // Extract properties and pagination info from response
  const properties = propertiesData?.data?.properties || [];
  const paginationInfo = propertiesData?.data?.pagination || {
    total: 0,
    limit: pagination.pageSize,
    offset: 0,
    currentPage: 1,
    totalPages: 0,
  };

  const usercolumns = useMemo(
    () => [
      {
        accessorKey: "shopname",
        header: "Shop Name",
        Cell: ({ row }) => (
          <Typography
            className="underline"
            color="secondary"
            role="button"
          >
            {row?.original?.merchant?.shopname || 'N/A'}
          </Typography>
        ),
      },
      {
        accessorKey: "title",
        header: "Property Title",
        Cell: ({ row }) => (
          <Typography variant="body2">
            {row?.original?.title || 'N/A'}
          </Typography>
        ),
      },
      {
        accessorKey: "propertyUseCase",
        header: "Property Type",
        Cell: ({ row }) => (
          <Chip
            className="text-11"
            size="small"
            color="primary"
            label={row?.original?.propertyUseCase || 'N/A'}
          />
        ),
      },
      {
        accessorKey: "numberOfRooms",
        header: "Rooms",
        Cell: ({ row }) => (
          <Typography variant="body2">
            {row?.original?.numberOfRooms || 0}
          </Typography>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        Cell: ({ row }) => (
          <Typography variant="body2">
            {row?.original?.price ? `$${row.original.price.toLocaleString()}` : 'N/A'}
          </Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => (
          <Chip
            className="text-11"
            size="small"
            color={row?.original?.status === 'active' ? 'success' : 'default'}
            label={row?.original?.status || 'N/A'}
          />
        ),
      },
      {
        accessorKey: "shopemail",
        header: "Shop Email",
        Cell: ({ row }) => (
          <div className="flex flex-wrap space-x-2">
            <Chip
              className="text-11"
              size="small"
              color="default"
              label={row?.original?.merchant?.shopemail || 'N/A'}
            />
          </div>
        ),
      },
      {
        accessorKey: "active",
        header: "Active",
        Cell: ({ row }) => (
          <div className="flex items-center">
            {row?.original?.merchant?.isSuspended ? (
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
              to={`/userlistings/managed-user-listings/${row.original.id}/monitor-evaluate`}
              className="bg-green-400 text-11 cursor-pointer"
              size="small"
              color="default"
              label="Manage this User & listing(s)"
            />
          </div>
        ),
      },
    ],
    []
  );

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="error" variant="h5">
          Error loading properties. Please try again.
        </Typography>
      </div>
    );
  }

  return (
    <Paper
      className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
      elevation={0}
    >
      {/* Loading indicator at the top */}
      {isFetching && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color="secondary" />
        </Box>
      )}

      {/* Overlay loading spinner for initial load */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Fade effect while fetching */}
      <Box sx={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.3s ease-in-out' }}>
        <DataTable
          data={properties}
          columns={usercolumns}
          manualPagination
          rowCount={paginationInfo.total}
          state={{
            pagination,
            isLoading,
            showProgressBars: isFetching,
            globalFilter,
          }}
          onPaginationChange={setPagination}
          onGlobalFilterChange={setGlobalFilter}
          enableGlobalFilter={true}
          muiCircularProgressProps={{
            color: 'secondary',
            thickness: 5,
            size: 55,
          }}
          muiLinearProgressProps={{
            color: 'secondary',
          }}
        />
      </Box>

      {!isLoading && properties.length === 0 && (
        <Box className="flex flex-1 items-center justify-center p-32">
          <Typography color="text.secondary" variant="h5">
            No properties found!
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default ShopOnEstatePropertiesTable;
