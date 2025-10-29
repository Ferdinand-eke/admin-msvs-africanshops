# useAdminUsers Hook - Usage Examples

This document provides examples of how to use the refactored `useAdminUsers` hook with pagination and search capabilities.

## Basic Usage (Without Parameters)

```javascript
import useAdminUsers from 'src/app/api/admin-users/useAdmins';

function AdminList() {
  const { data: usersData, isLoading: usersIsLoading } = useAdminUsers();

  if (usersIsLoading) return <div>Loading...</div>;

  return (
    <div>
      {usersData?.data?.admins?.map(admin => (
        <div key={admin._id}>{admin.name}</div>
      ))}
    </div>
  );
}
```

## With Pagination

```javascript
import { useState } from 'react';
import useAdminUsers from 'src/app/api/admin-users/useAdmins';

function AdminListWithPagination() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: usersData, isLoading: usersIsLoading } = useAdminUsers({
    limit: rowsPerPage,
    offset: page * rowsPerPage
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      {/* Your table/list rendering */}
      <TablePagination
        component="div"
        count={usersData?.data?.total || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
```

## With Search by Name

```javascript
import { useState } from 'react';
import useAdminUsers from 'src/app/api/admin-users/useAdmins';

function AdminListWithSearch() {
  const [searchName, setSearchName] = useState('');

  const { data: usersData, isLoading: usersIsLoading } = useAdminUsers({
    name: searchName
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      {usersIsLoading ? (
        <div>Loading...</div>
      ) : (
        usersData?.data?.admins?.map(admin => (
          <div key={admin._id}>{admin.name}</div>
        ))
      )}
    </div>
  );
}
```

## Complete Example: Pagination + Search

```javascript
import { useState } from 'react';
import useAdminUsers from 'src/app/api/admin-users/useAdmins';
import { TextField, TablePagination } from '@mui/material';

function CompleteAdminList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState('');

  const {
    data: usersData,
    isLoading: usersIsLoading,
    isFetching
  } = useAdminUsers({
    limit: rowsPerPage,
    offset: page * rowsPerPage,
    name: searchName
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchName(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  return (
    <div>
      <TextField
        label="Search by name"
        variant="outlined"
        value={searchName}
        onChange={handleSearch}
        fullWidth
        margin="normal"
      />

      {usersIsLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Your table/list rendering */}
          <div>
            {usersData?.data?.admins?.map(admin => (
              <div key={admin._id}>
                {admin.name} - {admin.email}
              </div>
            ))}
          </div>

          <TablePagination
            component="div"
            count={usersData?.data?.total || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </>
      )}

      {isFetching && <div>Updating...</div>}
    </div>
  );
}
```

## Using with Material React Table

```javascript
import { useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import useAdminUsers from 'src/app/api/admin-users/useAdmins';

function AdminTableMRT() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState('');

  const { data: usersData, isLoading } = useAdminUsers({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    name: globalFilter
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      // ... more columns
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={usersData?.data?.admins || []}
      manualPagination
      manualFiltering
      onPaginationChange={setPagination}
      onGlobalFilterChange={setGlobalFilter}
      rowCount={usersData?.data?.total || 0}
      state={{
        isLoading,
        pagination,
        globalFilter,
      }}
    />
  );
}
```

## Notes

1. **Query Key Caching**: The hook now includes `limit`, `offset`, and `name` in the query key, so React Query will cache results separately for different parameter combinations.

2. **keepPreviousData**: This option is enabled to show previous data while fetching new pages, providing a better UX during pagination.

3. **Backend Requirements**: Ensure your backend endpoint `/authadmin/get-all-admins` supports these query parameters:
   - `limit`: Number of records to return
   - `offset`: Number of records to skip
   - `name`: Filter by admin name (partial match recommended)

4. **Response Format**: The backend should ideally return:
   ```json
   {
     "success": true,
     "admins": [...],
     "total": 100,  // Total count for pagination
     "limit": 10,
     "offset": 0
   }
   ```
