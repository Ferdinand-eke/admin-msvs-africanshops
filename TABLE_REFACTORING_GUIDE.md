# Table Refactoring Guide

This guide provides a template for refactoring all tables in the application to use optimized server-side pagination, following the pattern established in `OrdersTable.jsx`.

## Reference Implementation

The optimized OrdersTable is located at:
`src/app/main/africanshops-control-dashboard/manage-markets-shops-products/orders/orders/OrdersTable.jsx`

## Step-by-Step Refactoring Process

### Step 1: Update API Route

**Location**: `src/app/api/apiRoutes.js`

**Before**:
```javascript
export const getItems = () => authApi().get("/items");
```

**After**:
```javascript
export const getItems = (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.limit) queryParams.append('limit', params.limit);
  if (params.offset) queryParams.append('offset', params.offset);
  if (params.search) queryParams.append('search', params.search);
  // Add any filters specific to your entity
  if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);

  const queryString = queryParams.toString();
  const url = queryString ? `/items?${queryString}` : '/items';

  return authApi().get(url);
};
```

### Step 2: Update React Query Hook

**Location**: `src/app/api/[entity]/use[Entity].js`

**Add new paginated hook**:
```javascript
import { useQuery } from 'react-query';
import { getItems } from '../apiRoutes';

// Existing hook - update to accept params
export default function useGetItems(params = {}) {
  return useQuery(
    ['items', params],
    () => getItems(params),
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  );
}

// New paginated hook
export function useGetItemsPaginated({ page = 0, limit = 20, search = '', filters = {} }) {
  const offset = page * limit;

  return useQuery(
    ['items_paginated', { page, limit, search, filters }],
    () => getItems({
      limit,
      offset,
      search,
      ...filters
    }),
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  );
}
```

### Step 3: Refactor Table Component

**Template Structure**:

```javascript
/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetItemsPaginated } from 'src/app/api/[entity]/use[Entity]';

function ItemsTable() {
	// Pagination state
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [globalFilter, setGlobalFilter] = useState('');

	// Fetch items with pagination
	const { data: itemsResponse, isLoading, isError, isFetching } = useGetItemsPaginated({
		page,
		limit: rowsPerPage,
		search: globalFilter,
		filters: {}
	});

	// Extract items and pagination info from response
	const items = useMemo(() => itemsResponse?.data?.payload?.items || [], [itemsResponse]);
	const totalCount = useMemo(() => itemsResponse?.data?.payload?.pagination?.total || 0, [itemsResponse]);
	const pagination = useMemo(() => itemsResponse?.data?.payload?.pagination, [itemsResponse]);

	// Pagination handlers
	const handlePageChange = useCallback((newPage) => {
		setPage(newPage);
	}, []);

	const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
		setRowsPerPage(newRowsPerPage);
		setPage(0);
	}, []);

	const handleGlobalFilterChange = useCallback((value) => {
		setGlobalFilter(value);
		setPage(0);
	}, []);

	// Define columns
	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'ID',
				size: 120,
				enableSorting: false,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/path/${row.original?.id}`}
						className="underline font-medium"
						color="secondary"
					>
						{row.original?.id}
					</Typography>
				)
			},
			{
				accessorKey: 'name',
				header: 'Name',
				size: 180,
				Cell: ({ row }) => (
					<Typography className="font-medium">
						{row.original?.name || 'N/A'}
					</Typography>
				)
			},
			// Add more columns as needed
			{
				accessorKey: 'createdAt',
				header: 'Date Created',
				size: 140,
				Cell: ({ row }) => (
					<Typography className="text-13">
						{new Date(row.original?.createdAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric'
						})}
					</Typography>
				)
			}
		],
		[]
	);

	// Loading state
	if (isLoading && !isFetching) {
		return <FuseLoading />;
	}

	// Error state
	if (isError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="text.secondary" variant="h5">
					Network Error While Retrieving items!
				</Typography>
				<Button
					className="mt-24"
					variant="outlined"
					onClick={() => window.location.reload()}
					color="secondary"
				>
					<FuseSvgIcon size={20}>heroicons-outline:refresh</FuseSvgIcon>
					<span className="mx-8">Retry</span>
				</Button>
			</motion.div>
		);
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			<DataTable
				data={items}
				columns={columns}
				manualPagination
				rowCount={totalCount}
				pageCount={pagination?.totalPages || Math.ceil(totalCount / rowsPerPage)}
				onPaginationChange={(updater) => {
					const newPagination = typeof updater === 'function'
						? updater({ pageIndex: page, pageSize: rowsPerPage })
						: updater;

					if (newPagination.pageIndex !== page) {
						handlePageChange(newPagination.pageIndex);
					}
					if (newPagination.pageSize !== rowsPerPage) {
						handleRowsPerPageChange(newPagination.pageSize);
					}
				}}
				onGlobalFilterChange={handleGlobalFilterChange}
				state={{
					pagination: {
						pageIndex: page,
						pageSize: rowsPerPage
					},
					globalFilter,
					isLoading: isFetching,
					showProgressBars: isFetching
				}}
				initialState={{
					density: 'comfortable',
					showGlobalFilter: true,
					showColumnFilters: false,
					pagination: {
						pageIndex: 0,
						pageSize: 20
					}
				}}
				muiPaginationProps={{
					rowsPerPageOptions: [10, 20, 50, 100],
					showFirstButton: true,
					showLastButton: true
				}}
				renderRowActionMenuItems={({ closeMenu, row }) => {
					const item = row.original;
					return [
						<MenuItem
							key="view"
							component={Link}
							to={`/path/${item.id}`}
							onClick={closeMenu}
						>
							<ListItemIcon>
								<FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
							</ListItemIcon>
							View Details
						</MenuItem>,
						<MenuItem
							key="edit"
							component={Link}
							to={`/path/${item.id}/edit`}
							onClick={closeMenu}
						>
							<ListItemIcon>
								<FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
							</ListItemIcon>
							Edit
						</MenuItem>
					];
				}}
				renderEmptyRowsFallback={() => (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { delay: 0.1 } }}
						className="flex flex-col flex-1 items-center justify-center h-full py-48"
					>
						<Typography color="text.secondary" variant="h5">
							No items found!
						</Typography>
						<Typography color="text.secondary" variant="body1" className="mt-8">
							{globalFilter ? 'Try adjusting your search terms' : 'Items will appear here once added'}
						</Typography>
					</motion.div>
				)}
			/>
		</Paper>
	);
}

export default ItemsTable;
```

## Key Features to Include

### 1. Performance Optimizations
- ✅ `useMemo` for data extraction
- ✅ `useCallback` for event handlers
- ✅ Server-side pagination (only fetch what's needed)
- ✅ React Query `keepPreviousData` for smooth transitions
- ✅ 30-second cache time to reduce API calls

### 2. User Experience
- ✅ Loading states with progress bars
- ✅ Error states with retry button
- ✅ Empty states with helpful messages
- ✅ Global search with auto page reset
- ✅ Multiple page size options (10, 20, 50, 100)
- ✅ First/Last page navigation buttons

### 3. Visual Enhancements
- ✅ Color-coded status chips where applicable
- ✅ Clickable links with proper styling
- ✅ Row action menus
- ✅ Consistent typography and spacing
- ✅ Smooth animations with Framer Motion

## Expected API Response Structure

Your API should return data in this format:

```json
{
  "success": true,
  "statusCode": 200,
  "payload": {
    "items": [ /* array of items */ ],
    "pagination": {
      "total": 100,
      "count": 20,
      "perPage": 20,
      "currentPage": 1,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false,
      "nextPage": 2,
      "previousPage": null,
      "offset": 0,
      "limit": 20
    }
  }
}
```

## Tables to Refactor

### Priority 1: High-Traffic Tables
1. ✅ **OrdersTable** (already done)
2. [ ] **AllVendorsTable** - `manage-allvendors/vendors/AllVendorsTable.jsx`
3. [ ] **CountriesTable** - `manage-countries/products/CountriesTable.jsx`
4. [ ] **StatesTable** - `manage-states/products/StatesTable.jsx`
5. [ ] **LgaCountiesTable** - `manage-lgasorcounties/products/LgaCountiesTable.jsx`
6. [ ] **MarketsTable** - `markets/all-markets/MarketsTable.jsx`
7. [ ] **MarketCategoriesTable** - `marketcategories/all-marketcategories/MarketCategoriesTable.jsx`
8. [ ] **TradehubsTable** - `tradhubs/all-tradehubs/TradehubsTable.jsx`

### Priority 2: Management Tables
9. [ ] **DepartmentsTable** - `manage-departments/products/DepartmentsTable.jsx`
10. [ ] **DesignationsTable** - `manage-designations/products/DesignationsTable.jsx`
11. [ ] **VendorPlansTable** - `manage-vendorplans/vendorplans/VendorPlansTable.jsx`
12. [ ] **ProductCategoriesTable** - `product-categories/products/ProductCategoriesTable.jsx`
13. [ ] **ProductProductUnitsTable** - `product-units/products/ProductProductUnitsTable.jsx`
14. [ ] **OrderItemsTable** - `orders/orderitems/OrderItemsTable.jsx`

### Priority 3: Additional Tables
15. [ ] **PostsTable** - `manage-editorials/posts/posts/PostsTable.jsx`
16. [ ] **PostCategoriesTable** - `manage-editorials/post-categories/products/PostCategoriesTable.jsx`
17. [ ] **ShopOnEstatePropertiesTable** - `homes/managedusersandproperties/products/ShopOnEstatePropertiesTable.jsx`
18. [ ] **ReservationsOnBookingsListTable** - `bookings-homes/managebookingsusersandproperties/reservations/ReservationsOnBookingsListTable.jsx`

## Common Issues & Solutions

### Issue 1: API doesn't return pagination object
**Solution**: Update backend to return pagination metadata or calculate it on frontend:
```javascript
const totalCount = useMemo(() => {
  // If API returns total in different location
  return itemsResponse?.data?.total || itemsResponse?.data?.payload?.totalCount || 0;
}, [itemsResponse]);
```

### Issue 2: API uses different parameter names
**Solution**: Map parameters in the API route function:
```javascript
export const getItems = (params = {}) => {
  const queryParams = new URLSearchParams();

  // API expects 'pageSize' instead of 'limit'
  if (params.limit) queryParams.append('pageSize', params.limit);
  // API expects 'page' (1-indexed) instead of 'offset'
  if (params.offset !== undefined) {
    const page = Math.floor(params.offset / (params.limit || 20)) + 1;
    queryParams.append('page', page);
  }

  // ... rest of implementation
};
```

### Issue 3: Circular dependency warnings
**Solution**: Ensure proper import order and avoid importing parent from child components.

### Issue 4: Table doesn't show loading state between pages
**Solution**: Make sure `isFetching` is used in the state:
```javascript
state={{
  isLoading: isFetching,
  showProgressBars: isFetching
}}
```

## Testing Checklist

After refactoring each table, verify:

- [ ] Initial page loads with 20 items (or configured default)
- [ ] Page navigation works (Next, Previous, First, Last)
- [ ] Page size selector works (10, 20, 50, 100)
- [ ] Global search filters results and resets to page 1
- [ ] Loading indicator shows during data fetch
- [ ] Error state displays properly with retry button
- [ ] Empty state displays when no data
- [ ] Row actions menu works correctly
- [ ] Links navigate to correct pages
- [ ] Performance: No unnecessary re-renders
- [ ] Console: No errors or warnings

## Performance Metrics

Expected improvements after refactoring:
- **Initial Load Time**: 50-70% faster (only loads 20 items vs all)
- **Memory Usage**: 60-80% reduction for large datasets
- **Interaction Responsiveness**: Near instant (< 16ms)
- **API Requests**: Reduced by caching and pagination

## Need Help?

Refer to the reference implementation:
`src/app/main/africanshops-control-dashboard/manage-markets-shops-products/orders/orders/OrdersTable.jsx`

Or check the StaffUsersList for another example:
`src/app/main/users/admin/StaffUsersList.jsx`
