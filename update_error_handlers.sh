#!/bin/bash

# Script to update all React Query hook files with the new error handler

# Array of files to update (remaining files from the list)
FILES=(
  "src/app/api/countries/useCountries.js"
  "src/app/api/markets/useMarkets.js"
  "src/app/api/real-estate-acquisitions/useAcquisitions.js"
  "src/app/api/real-estate-inspections/useInspections.js"
  "src/app/api/real-estate-offers/useOffers.js"
  "src/app/api/shopplans/useShopPlans.js"
  "src/app/api/states/useStates.js"
  "src/app/api/tradehubs/useTradeHubs.js"
  "src/app/api/users/useUsers.js"
  "src/app/api/post-category/usePostCats.js"
  "src/app/api/posts/usePosts.js"
  "src/app/api/product-categories/useProductCategories.js"
  "src/app/api/product-units/useProductUnits.js"
  "src/app/api/admin-handle-bookingsproperties/useAdminHandleBookingsProperties.js"
  "src/app/api/adverts/useAdverts.js"
  "src/app/api/auth/admin-auth.js"
  "src/app/api/banners/useBanners.js"
  "src/app/api/departments/useCreateUpdateDept.js"
  "src/app/api/designations/useCreateUpdateDesig.js"
  "src/app/api/faqs/useFaqs.js"
  "src/app/api/largeproduct-units/useLargeProductUnits.js"
  "src/app/api/legaldocs/useLegalDocs.js"
  "src/app/api/lgas/useLgas.js"
  "src/app/api/newsposts/useNews.js"
  "src/app/api/offices/useAdminOffices.js"
  "src/app/api/orders/useAdminGetShopOrders.js"
  "src/app/api/partners/usePartners.js"
)

echo "Starting error handler updates..."

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."

    # Check if file already has the import
    if ! grep -q "import { createErrorHandler } from" "$file"; then
      # Add import after the last import from react-toastify or at the top
      if grep -q "from 'react-toastify'" "$file"; then
        # Add after react-toastify import
        sed -i "/from 'react-toastify';/a import { createErrorHandler } from '../utils/errorHandler';" "$file" 2>/dev/null || \
        sed -i '' "/from 'react-toastify';/a\\
import { createErrorHandler } from '../utils/errorHandler';" "$file"
      else
        # Add after the first import statement
        sed -i "1a import { createErrorHandler } from '../utils/errorHandler';" "$file" 2>/dev/null || \
        sed -i '' "1a\\
import { createErrorHandler } from '../utils/errorHandler';" "$file"
      fi
      echo "  ✓ Added error handler import"
    else
      echo "  - Already has error handler import"
    fi

  else
    echo "⚠ File not found: $file"
  fi
done

echo ""
echo "Import additions complete!"
echo "Note: Manual replacement of onError handlers still needed for each file."
