# Table Refactoring Progress

## Completed ✅

### 1. OrdersTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-markets-shops-products/orders/orders/OrdersTable.jsx`
- **API Route**: Updated `adminGetOrders` in `apiRoutes.js`
- **Hook**: Added `useAdminGetOrdersPaginated` in `useAdminGetShopOrders.js`
- **Status**: ✅ COMPLETE - Fully paginated with search

### 2. CountriesTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-countries/products/CountriesTable.jsx`
- **API Route**: Updated `getCountries` in `apiRoutes.js`
- **Hook**: Added `useCountriesPaginated` in `useCountries.js`
- **Status**: ✅ COMPLETE - Fully paginated with search

## Remaining Tables - Priority Order

### Priority 1: Location Management (High Traffic)

#### 3. StatesTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-states/products/StatesTable.jsx`
- **API Route**: Update `getBStates` in `apiRoutes.js` (line ~216)
- **Hook File**: `src/app/api/states/useStates.js`
- **Hook Pattern**:
```javascript
export function useStatesPaginated({ page = 0, limit = 20, search = '', filters = {} }) {
  const offset = page * limit;
  return useQuery(
    ['__states_paginated', { page, limit, search, filters }],
    () => getBStates({ limit, offset, search, ...filters }),
    { keepPreviousData: true, staleTime: 30000 }
  );
}
```

#### 4. LgaCountiesTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-lgasorcounties/products/LgaCountiesTable.jsx`
- **API Route**: Update `getBLgas` in `apiRoutes.js` (line ~248)
- **Hook File**: `src/app/api/lgas/useLgas.js`

### Priority 2: Management Tables

#### 5. DepartmentsTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-departments/products/DepartmentsTable.jsx`
- **API Route**: Update `getDepts` in `apiRoutes.js` (line ~104)
- **Hook File**: `src/app/api/departments/useDepartments.js`

#### 6. DesignationsTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-designations/products/DesignationsTable.jsx`
- **API Route**: Update `getDesigs` in `apiRoutes.js` (line ~127)
- **Hook File**: `src/app/api/designations/useDesignations.js`

#### 7. MarketCategoriesTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-markets-shops-products/marketcategories/all-marketcategories/MarketCategoriesTable.jsx`
- **API Route**: Update `getMarketCategories` in `apiRoutes.js` (line ~377)
- **Hook File**: `src/app/api/market-category/useMarketCats.js`

#### 8. MarketsTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-markets-shops-products/markets/all-markets/MarketsTable.jsx`
- **API Route**: Update `getMarkets` in `apiRoutes.js` (line ~404)
- **Hook File**: `src/app/api/markets/useMarkets.js`

#### 9. TradehubsTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-markets-shops-products/tradhubs/all-tradehubs/TradehubsTable.jsx`
- **API Route**: Update `getTradehubs` in `apiRoutes.js` (line ~275)
- **Hook File**: `src/app/api/tradehubs/useTradeHubs.js`

#### 10. VendorPlansTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-vendorplans/vendorplans/VendorPlansTable.jsx`
- **API Route**: Update `getShopPlans` in `apiRoutes.js` (line ~435)
- **Hook File**: `src/app/api/shopplans/useShopPlans.js`

#### 11. AllVendorsTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-allvendors/vendors/AllVendorsTable.jsx`
- **API Route**: Update `getShops` in `apiRoutes.js` (line ~458)
- **Hook File**: `src/app/api/shops/useAdminShops.js`

### Priority 3: Product Management

#### 12. ProductCategoriesTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-markets-shops-products/product-categories/products/ProductCategoriesTable.jsx`
- **API Route**: Update `getProdCats` in `apiRoutes.js` (line ~303)
- **Hook File**: Create `src/app/api/product-categories/useProdCats.js`

#### 13. ProductProductUnitsTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-markets-shops-products/product-units/products/ProductProductUnitsTable.jsx`
- **API Route**: Update `getProdUnits` in `apiRoutes.js` (line ~335)
- **Hook File**: Create `src/app/api/product-units/useProdUnits.js`

#### 14. OrderItemsTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-markets-shops-products/orders/orderitems/OrderItemsTable.jsx`
- **API Route**: Update `adminGet_OrderItems` in `apiRoutes.js` (line ~662)
- **Hook**: Use `useAdminGetOrderItems` in `useAdminGetShopOrders.js`

### Priority 4: Editorial Content

#### 15. PostsTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-editorials/posts/posts/PostsTable.jsx`
- **API Route**: Update `getAdminPosts` in `apiRoutes.js` (line ~574)
- **Hook File**: Create `src/app/api/posts/usePosts.js`

#### 16. PostCategoriesTable
- **Path**: `src/app/main/africanshops-control-dashboard/manage-editorials/post-categories/products/PostCategoriesTable.jsx`
- **API Route**: Update `getPostcats` in `apiRoutes.js` (line ~552)
- **Hook File**: Create `src/app/api/post-categories/usePostCats.js`

## Quick Refactoring Checklist

For each table, follow these steps:

### Step 1: Update API Route (apiRoutes.js)
```javascript
export const get[Entity] = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.offset) queryParams.append('offset', params.offset);
  if (params.search) queryParams.append('search', params.search);
  // Add entity-specific filters

  const queryString = queryParams.toString();
  const url = queryString ? `/endpoint?${queryString}` : '/endpoint';
  return authApi().get(url);
};
```

### Step 2: Update/Create Hook File
```javascript
// Update existing default export
export default function use[Entity](params = {}) {
  return useQuery(
    ["__entity", params],
    () => get[Entity](params),
    { keepPreviousData: true, staleTime: 30000 }
  );
}

// Add new paginated hook
export function use[Entity]Paginated({ page = 0, limit = 20, search = '', filters = {} }) {
  const offset = page * limit;
  return useQuery(
    ['__entity_paginated', { page, limit, search, filters }],
    () => get[Entity]({ limit, offset, search, ...filters }),
    { keepPreviousData: true, staleTime: 30000 }
  );
}
```

### Step 3: Refactor Table Component
1. Import `useState`, `useCallback`, `useMemo` from React
2. Import the paginated hook
3. Add pagination state
4. Update data fetching to use paginated hook
5. Extract data with useMemo
6. Add pagination handlers
7. Update DataTable props with:
   - `manualPagination`
   - `rowCount`, `pageCount`
   - `onPaginationChange`, `onGlobalFilterChange`
   - Update `state` and `initialState`
   - Add `muiPaginationProps`
8. Update loading/error states
9. Add empty state fallback

### Step 4: Test
- [ ] Initial load shows 20 items
- [ ] Pagination works
- [ ] Search works
- [ ] Loading states display
- [ ] No console errors

## Common Patterns

### API Response Structure Expected
```json
{
  "success": true,
  "data": {
    "[entities]": [...],
    "pagination": {
      "total": 100,
      "totalPages": 5,
      "currentPage": 1
    }
  }
}
```

### Fallback if no pagination in API
If API doesn't return pagination, use:
```javascript
const totalCount = useMemo(() =>
  response?.data?.pagination?.total || items.length,
  [response, items.length]
);
```

## Completed Tables Summary

✅ **2 of 16 tables refactored** (12.5% complete)

Remaining: 14 tables

## Next Steps

Continue with **StatesTable** next, as it's high-traffic and follows the same pattern as CountriesTable.
