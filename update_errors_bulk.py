#!/usr/bin/env python3
"""
Script to bulk update error handlers in React Query hook files
"""

import os
import re

# List of files to update with their base paths
files_to_update = [
    "src/app/api/tradehubs/useTradeHubs.js",
    "src/app/api/users/useUsers.js",
    "src/app/api/lgas/useLgas.js",
    "src/app/api/post-category/usePostCats.js",
    "src/app/api/posts/usePosts.js",
    "src/app/api/product-categories/useProductCategories.js",
    "src/app/api/product-units/useProductUnits.js",
    "src/app/api/admin-handle-bookingsproperties/useAdminHandleBookingsProperties.js",
    "src/app/api/adverts/useAdverts.js",
    "src/app/api/auth/admin-auth.js",
    "src/app/api/banners/useBanners.js",
    "src/app/api/departments/useCreateUpdateDept.js",
    "src/app/api/designations/useCreateUpdateDesig.js",
    "src/app/api/faqs/useFaqs.js",
    "src/app/api/largeproduct-units/useLargeProductUnits.js",
    "src/app/api/legaldocs/useLegalDocs.js",
    "src/app/api/newsposts/useNews.js",
    "src/app/api/offices/useAdminOffices.js",
    "src/app/api/orders/useAdminGetShopOrders.js",
    "src/app/api/partners/usePartners.js",
    "src/app/api/real-estate-acquisitions/useAcquisitions.js",
    "src/app/api/real-estate-inspections/useInspections.js",
    "src/app/api/real-estate-offers/useOffers.js",
]

def add_import_if_missing(content):
    """Add createErrorHandler import if not present"""
    if "import { createErrorHandler } from" in content:
        return content, False

    # Find the line with react-toastify import
    lines = content.split('\n')
    import_added = False
    new_lines = []

    for i, line in enumerate(lines):
        new_lines.append(line)
        if "from 'react-toastify'" in line and not import_added:
            new_lines.append("import { createErrorHandler } from '../utils/errorHandler';")
            import_added = True

    if not import_added:
        # Add after first import if react-toastify not found
        for i, line in enumerate(lines):
            if line.startswith('import '):
                new_lines.insert(i + 1, "import { createErrorHandler } from '../utils/errorHandler';")
                import_added = True
                break

    return '\n'.join(new_lines) if import_added else content, import_added

def replace_error_handlers(content):
    """Replace old error handlers with createErrorHandler"""

    # Pattern 1: Simple error handler without rollback
    pattern1 = r"onError:\s*\((?:err|error)\)\s*=>\s*{\s*toast\.error\((err|error)\.response\s*&&\s*\1\.response\.data\.message\s*\?\s*\1\.response\.data\.message\s*:\s*\1\.message\);?\s*}"

    #Pattern 2: Error handler with rollback
    pattern2 = r"onError:\s*\((?:err|error),\s*(?:values|data|variables),\s*rollback\)\s*=>\s*{\s*toast\.error\(\s*(?:err|error)\.response\s*&&\s*(?:err|error)\.response\.data\.message\s*\?\s*(?:err|error)\.response\.data\.message\s*:\s*(?:err|error)\.message\s*\);?\s*rollback\(\);?\s*}"

    # Count replacements
    count = 0

    # Simple replacement with generic message - would need context-specific messages
    result = re.sub(pattern1, "onError: createErrorHandler({ defaultMessage: 'Operation failed' })", content)
    if result != content:
        count += result.count('createErrorHandler') - content.count('createErrorHandler')

    result2 = re.sub(pattern2, "onError: createErrorHandler({ defaultMessage: 'Operation failed' })", result)
    if result2 != result:
        count += result2.count('createErrorHandler') - result.count('createErrorHandler')

    return result2, count

def process_file(filepath):
    """Process a single file"""
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        return False

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add import
    new_content, import_added = add_import_if_missing(content)

    # Replace error handlers
    final_content, replacements = replace_error_handlers(new_content)

    if import_added or replacements > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(final_content)

        status = []
        if import_added:
            status.append("import added")
        if replacements > 0:
            status.append(f"{replacements} handlers replaced")

        print(f"✅ {filepath}: {', '.join(status)}")
        return True
    else:
        print(f"⏭️  {filepath}: No changes needed")
        return False

def main():
    print("Starting bulk error handler update...\n")

    updated = 0
    for filepath in files_to_update:
        if process_file(filepath):
            updated += 1

    print(f"\n✅ Updated {updated}/{len(files_to_update)} files")
    print("\nNote: Review the changes and update 'Operation failed' messages to be more specific")

if __name__ == "__main__":
    main()
