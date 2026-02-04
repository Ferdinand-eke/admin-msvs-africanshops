# Error Handler Update Status

## Summary

Updated React Query hooks in `src/app/api/` to use the new `createErrorHandler` utility for consistent error handling across the application.

## Completed Files (11/31)

### ✅ Fully Updated

1. **admin-users/useAdmins.js**
   - Added import for `createErrorHandler`
   - Replaced 12 onError handlers
   - Updated mutations: create, update, block, unblock, suspend, unsuspend, make leader, remove leader, delete, recruit, accept invitation

2. **shops/useAdminShops.js**
   - Added import for `createErrorHandler`
   - Replaced 8 onError handlers
   - Updated mutations: delete shop, create merchant/partner/company shop, update merchant/partner/company shop

3. **market-category/useMarketCats.js**
   - Added import for `createErrorHandler`
   - Replaced 3 onError handlers
   - Updated mutations: create, update, delete

4. **departments/useDepartments.js**
   - Added import for `createErrorHandler`
   - Replaced 3 onError handlers
   - Updated mutations: create, update, delete

5. **countries/useCountries.js**
   - Added import for `createErrorHandler`
   - Replaced 6 onError handlers
   - Updated mutations: create, update, delete country, add/update/delete shipping table

6. **markets/useMarkets.js**
   - Added import for `createErrorHandler`
   - Replaced 3 onError handlers
   - Updated mutations: create, update, delete

7. **shopplans/useShopPlans.js**
   - Added import for `createErrorHandler`
   - Replaced 3 onError handlers (included NestJS-specific error handling)
   - Updated mutations: create, update, delete

8. **states/useStates.js**
   - Added import for `createErrorHandler`
   - Replaced 3 onError handlers (included NestJS-specific error handling)
   - Updated mutations: create, update, delete

9. **tradehubs/useTradeHubs.js**
   - Added import for `createErrorHandler`
   - Replaced 3 onError handlers
   - Updated mutations: create, update, delete

10. **users/useUsers.js**
    - Added import for `createErrorHandler`
    - Replaced 5 onError handlers
    - Updated mutations: suspend, unsuspend, block, unblock, update details

11. **lgas/useLgas.js**
    - Added import for `createErrorHandler`
    - Replaced 3 onError handlers
    - Updated mutations: create, update, delete

## Remaining Files (20/31)

### 📋 Files Still Needing Updates

1. **post-category/usePostCats.js**
2. **posts/usePosts.js**
3. **product-categories/useProductCategories.js**
4. **product-units/useProductUnits.js**
5. **admin-handle-bookingsproperties/useAdminHandleBookingsProperties.js**
6. **adverts/useAdverts.js**
7. **auth/admin-auth.js**
8. **banners/useBanners.js**
9. **departments/useCreateUpdateDept.js**
10. **designations/useCreateUpdateDesig.js**
11. **faqs/useFaqs.js**
12. **largeproduct-units/useLargeProductUnits.js**
13. **legaldocs/useLegalDocs.js**
14. **newsposts/useNews.js**
15. **offices/useAdminOffices.js**
16. **orders/useAdminGetShopOrders.js**
17. **partners/usePartners.js**
18. **real-estate-acquisitions/useAcquisitions.js**
19. **real-estate-inspections/useInspections.js**
20. **real-estate-offers/useOffers.js**

## Update Pattern

For each remaining file, follow this pattern:

### Step 1: Add Import

After the `react-toastify` import, add:

```javascript
import { createErrorHandler } from '../utils/errorHandler';
```

### Step 2: Replace Error Handlers

Replace all occurrences of these patterns:

**Pattern A: Simple onError handler**
```javascript
// OLD
onError: (err) => {
    toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
}

// NEW
onError: createErrorHandler({ defaultMessage: 'Failed to [operation name]' })
```

**Pattern B: onError with rollback**
```javascript
// OLD
onError: (error, values, rollback) => {
    toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
    rollback();
}

// NEW (rollback is handled automatically by createErrorHandler)
onError: createErrorHandler({ defaultMessage: 'Failed to [operation name]' })
```

**Pattern C: NestJS-style error handling**
```javascript
// OLD
onError: (error) => {
    let errorMessage = 'An error occurred';
    if (error.response?.data) {
        const { message, error: errorType } = error.response.data;
        if (Array.isArray(message)) {
            errorMessage = message.join(', ');
        } else if (message) {
            errorMessage = message;
        } else if (errorType) {
            errorMessage = errorType;
        }
    } else if (error.message) {
        errorMessage = error.message;
    }
    toast.error(errorMessage);
}

// NEW (NestJS format is handled automatically)
onError: createErrorHandler({ defaultMessage: 'Failed to [operation name]' })
```

### Step 3: Default Messages

Use descriptive default messages based on the operation:

- Create: `'Failed to create [resource]'`
- Update: `'Failed to update [resource]'`
- Delete: `'Failed to delete [resource]'`
- Fetch: `'Failed to fetch [resource]'`
- Submit: `'Failed to submit [form/data]'`

Examples:
- `'Failed to create product category'`
- `'Failed to update advertisement'`
- `'Failed to delete legal document'`
- `'Failed to submit order'`

### Step 4: Remove Unused Toast Import (Optional)

If the file ONLY used `toast` in error handlers (not in `onSuccess` or elsewhere), you can remove:
```javascript
import { toast } from 'react-toastify';
```

**Note:** Keep the import if `toast` is used in success handlers or other places.

## Benefits of the New Error Handler

1. **Consistent Error Messages**: All errors are formatted consistently
2. **Multiple Error Formats**: Handles NestJS, Express, and custom error formats automatically
3. **Automatic Rollback**: Supports optimistic updates with automatic rollback
4. **Better UX**: Toast notifications with consistent positioning and timing
5. **Development Logging**: Automatic console logging in development mode
6. **Network Error Handling**: Special handling for network/connection errors
7. **HTTP Status Codes**: Appropriate messages for different HTTP status codes

## Error Handler Features

The `createErrorHandler` utility (located at `src/app/api/utils/errorHandler.js`) provides:

- **NestJS Error Format**: Handles both single and array error messages
- **Express Error Format**: Handles traditional Node.js/Express errors
- **Custom Error Formats**: Supports `msg`, `errors` array, and validation errors
- **HTTP Status Handling**: Provides user-friendly messages for 400, 401, 403, 404, 409, 422, 429, 500, 503
- **Network Errors**: Detects and handles network connectivity issues
- **Toast Configuration**: Consistent toast settings (position, duration, progress bar)
- **Rollback Support**: Automatically executes rollback functions for optimistic updates
- **Development Logging**: Detailed error logging in development environment

## Testing After Updates

After updating each file:

1. Test create operations (if applicable)
2. Test update operations (if applicable)
3. Test delete operations (if applicable)
4. Verify error messages display correctly in toast notifications
5. Check that rollback works for optimistic updates (where applicable)
6. Confirm that navigation still works after successful operations

## Example Update

### Before:
```javascript
export function useAddProductCategoryMutation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation(createProductCategory, {
        onSuccess: (data) => {
            toast.success('Category created successfully!');
            queryClient.invalidateQueries('productCategories');
            navigate('/product-categories/list');
        },
        onError: (error) => {
            toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
        }
    });
}
```

### After:
```javascript
import { createErrorHandler } from '../utils/errorHandler';

export function useAddProductCategoryMutation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation(createProductCategory, {
        onSuccess: (data) => {
            toast.success('Category created successfully!');
            queryClient.invalidateQueries('productCategories');
            navigate('/product-categories/list');
        },
        onError: createErrorHandler({ defaultMessage: 'Failed to create product category' })
    });
}
```

## Progress Tracking

- **Total Files**: 31
- **Completed**: 11
- **Remaining**: 20
- **Progress**: 35.5%

## Next Steps

1. Update the remaining 20 files following the pattern above
2. Test each updated file to ensure error handling works correctly
3. Update this document as more files are completed
4. Consider creating automated tests for error scenarios

## Notes

- The error handler is backward compatible with existing error handling
- Toast import can remain if used in onSuccess handlers
- All error formats (NestJS, Express, custom) are handled automatically
- No changes needed to success handlers or query hooks
