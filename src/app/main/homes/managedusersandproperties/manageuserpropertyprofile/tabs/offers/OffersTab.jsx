import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  LinearProgress,
  Paper,
  Avatar,
  Divider,
  Grid,
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from 'app/shared-components/data-table/DataTable';
// import useAdminOffers, { useManageOffer, useDeleteOffer } from '../../../../../../api/real-estate-offers/useOffers';
import { format } from 'date-fns';
import useAdminOffers, { useDeleteOffer, useManageOffer } from 'src/app/api/real-estate-offers/useOffers';

function OffersTab({ propertyId }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });


  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [actionType, setActionType] = useState('');
  const [actionData, setActionData] = useState({ counterAmount: '', reason: '' });
  const [anchorEl, setAnchorEl] = useState(null);

  const offset = pagination.pageIndex * pagination.pageSize;
  const limit = pagination.pageSize;

  const { data: offersData, isLoading, isFetching } = useAdminOffers({
    limit,
    offset,
    propertyId,
  });

  console.log("OFERS_ON_CLIENT", offersData?.data)

  const manageOfferMutation = useManageOffer();
  const deleteOfferMutation = useDeleteOffer();

  const offers = offersData?.data?.payload?.offers || [];
  const paginationInfo = offersData?.data?.payload?.pagination || {
    total: 0,
    limit: pagination.pageSize,
    offset: 0,
  };

  const handleMenuOpen = (event, offer) => {
    setAnchorEl(event.currentTarget);
    setSelectedOffer(offer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action) => {
    setActionType(action);
    setActionDialogOpen(true);
    handleMenuClose();
  };

  const handleActionConfirm = () => {
    if (!selectedOffer) return;

    const payload = {
      offerId: selectedOffer.id,
      action: actionType,
      data: actionType === 'counter' ? { counterAmount: actionData.counterAmount } : undefined,
    };

    manageOfferMutation.mutate(payload, {
      onSuccess: () => {
        setActionDialogOpen(false);
        setActionData({ counterAmount: '', reason: '' });
        setSelectedOffer(null);
      },
    });
  };

  const handleDeleteOffer = () => {
    if (!selectedOffer) return;

    deleteOfferMutation.mutate(selectedOffer.id, {
      onSuccess: () => {
        handleMenuClose();
        setSelectedOffer(null);
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'declined':
      case 'rejected':
        return 'error';
      case 'countered':
        return 'info';
      default:
        return 'default';
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'buyer',
        header: 'Buyer',
        Cell: ({ row }) => (
          <Box className="flex items-center gap-12">
            <Avatar
              src={row.original.buyer?.avatar}
              alt={row.original.buyer?.name}
              className="w-32 h-32"
            >
              {row.original.buyer?.name?.charAt(0) || 'B'}
            </Avatar>
            <Box>
              <Typography variant="body2" className="font-semibold">
                {row.original.buyer?.name || 'Unknown'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.original.buyer?.email || 'N/A'}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: 'offerAmount',
        header: 'Offer Amount',
        Cell: ({ row }) => (
          <Typography variant="body2" className="font-semibold text-green-600">
            ${row.original.offerAmount?.toLocaleString() || '0'}
          </Typography>
        ),
      },
      {
        accessorKey: 'offerType',
        header: 'Type',
        Cell: ({ row }) => (
          <Chip
            label={row.original.offerType || 'N/A'}
            size="small"
            variant="outlined"
            className="text-11"
          />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ row }) => (
          <Chip
            label={row.original.status || 'pending'}
            size="small"
            color={getStatusColor(row.original.status)}
            className="text-11"
          />
        ),
      },
      {
        accessorKey: 'submittedAt',
        header: 'Submitted',
        Cell: ({ row }) => (
          <Typography variant="body2" color="text.secondary">
            {row.original.submittedAt
              ? format(new Date(row.original.submittedAt), 'MMM dd, yyyy')
              : 'N/A'}
          </Typography>
        ),
      },
      {
        accessorKey: 'expiresAt',
        header: 'Expires',
        Cell: ({ row }) => (
          <Typography variant="body2" color="text.secondary">
            {row.original.expiresAt
              ? format(new Date(row.original.expiresAt), 'MMM dd, yyyy')
              : 'N/A'}
          </Typography>
        ),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen(e, row.original)}
            disabled={row.original.status === 'accepted'}
          >
            <FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
          </IconButton>
        ),
      },
    ],
    []
  );

  return (
    <Box className="w-full">
      {/* Summary Cards */}
      <Grid container spacing={2} className="mb-24">
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1}>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Offers
                  </Typography>
                  <Typography variant="h5" className="font-bold">
                    {paginationInfo.total || 0}
                  </Typography>
                </Box>
                <FuseSvgIcon size={32} color="primary">
                  heroicons-outline:clipboard-list
                </FuseSvgIcon>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1}>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pending Review
                  </Typography>
                  <Typography variant="h5" className="font-bold">
                    {offers.filter((o) => o.status === 'pending').length}
                  </Typography>
                </Box>
                <FuseSvgIcon size={32} className="text-yellow-600">
                  heroicons-outline:clock
                </FuseSvgIcon>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1}>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Accepted
                  </Typography>
                  <Typography variant="h5" className="font-bold">
                    {offers.filter((o) => o.status === 'accepted').length}
                  </Typography>
                </Box>
                <FuseSvgIcon size={32} className="text-green-600">
                  heroicons-outline:check-circle
                </FuseSvgIcon>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={1}>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Declined
                  </Typography>
                  <Typography variant="h5" className="font-bold">
                    {offers.filter((o) => o.status === 'declined').length}
                  </Typography>
                </Box>
                <FuseSvgIcon size={32} className="text-red-600">
                  heroicons-outline:x-circle
                </FuseSvgIcon>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Offers Table */}
      <Paper elevation={1}>
        {isFetching && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress color="secondary" />
          </Box>
        )}

        {isLoading && (
          <Box className="flex justify-center items-center p-48">
            <CircularProgress size={60} />
          </Box>
        )}

        <Box sx={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.3s ease-in-out' }}>
          <DataTable
            data={offers}
            columns={columns}
            manualPagination
            rowCount={paginationInfo.total}
            state={{
              pagination,
              isLoading,
              showProgressBars: isFetching,
            }}
            onPaginationChange={setPagination}
            enableGlobalFilter={false}
            muiLinearProgressProps={{
              color: 'secondary',
            }}
          />
        </Box>

        {!isLoading && offers.length === 0 && (
          <Box className="flex flex-col items-center justify-center p-48">
            <FuseSvgIcon size={64} color="disabled">
              heroicons-outline:inbox
            </FuseSvgIcon>
            <Typography color="text.secondary" className="mt-16" variant="h6">
              No offers received yet
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleActionClick('accept')}>
          <FuseSvgIcon size={20} className="mr-8 text-green-600">
            heroicons-outline:check
          </FuseSvgIcon>
          Accept Offer
        </MenuItem>
        <MenuItem onClick={() => handleActionClick('decline')}>
          <FuseSvgIcon size={20} className="mr-8 text-red-600">
            heroicons-outline:x
          </FuseSvgIcon>
          Decline Offer
        </MenuItem>
        <MenuItem onClick={() => handleActionClick('counter')}>
          <FuseSvgIcon size={20} className="mr-8 text-blue-600">
            heroicons-outline:reply
          </FuseSvgIcon>
          Counter Offer
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteOffer} className="text-red-600">
          <FuseSvgIcon size={20} className="mr-8">
            heroicons-outline:trash
          </FuseSvgIcon>
          Delete Offer
        </MenuItem>
      </Menu>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'accept' && 'Accept Offer'}
          {actionType === 'decline' && 'Decline Offer'}
          {actionType === 'counter' && 'Counter Offer'}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedOffer && (
            <Box className="space-y-16">
              <Typography variant="body2">
                Buyer: <strong>{selectedOffer.buyer?.name}</strong>
              </Typography>
              <Typography variant="body2">
                Original Offer: <strong>${selectedOffer.offerAmount?.toLocaleString()}</strong>
              </Typography>

              {actionType === 'counter' && (
                <TextField
                  fullWidth
                  label="Counter Offer Amount"
                  type="number"
                  value={actionData.counterAmount}
                  onChange={(e) => setActionData({ ...actionData, counterAmount: e.target.value })}
                  placeholder="Enter counter offer amount"
                  variant="outlined"
                />
              )}

              {actionType === 'decline' && (
                <TextField
                  fullWidth
                  label="Reason for Declining"
                  multiline
                  rows={3}
                  value={actionData.reason}
                  onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                  placeholder="Optional: Provide a reason"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions className="px-24 pb-16">
          <Button onClick={() => setActionDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleActionConfirm}
            variant="contained"
            color={actionType === 'decline' ? 'error' : 'primary'}
            disabled={manageOfferMutation.isLoading}
          >
            {manageOfferMutation.isLoading ? <CircularProgress size={20} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OffersTab;
