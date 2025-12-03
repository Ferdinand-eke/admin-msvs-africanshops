import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useAdminUsers from 'src/app/api/admin-users/useAdmins';
import StaffHeader from './StaffHeader';
import UsersList from './StaffUsersList';
import StaffContactsSidebarContent from './StaffContactsSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper
	}
}));

/**
 * The ContactsApp page.
 */

function ContactsApp() {
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	// Pagination state
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [searchName, setSearchName] = useState('');

	// Fetch admin users with pagination and search
	const { data: usersData, isLoading: usersIsLoading } = useAdminUsers({
		limit: rowsPerPage,
		offset: page * rowsPerPage,
		name: searchName
	});

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

	// Handlers for pagination
	const handleChangePage = (_event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (value) => {
		setRowsPerPage(value);
		setPage(0); // Reset to first page
	};

	const handleSearchChange = (value) => {
		setSearchName(value);
		setPage(0); // Reset to first page when searching
	};

	return (
		<Root
			header={
				<StaffHeader
					usersData={usersData?.data?.admins}
					usersIsLoading={usersIsLoading}
					onSearchChange={handleSearchChange}
					searchValue={searchName}
				/>
			}
			content={
				<UsersList
					usersData={usersData?.data?.admins}
					usersIsLoading={usersIsLoading}
					totalCount={usersData?.data?.total || 0}
					page={page}
					rowsPerPage={rowsPerPage}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			}
			ref={pageLayout}
			rightSidebarContent={<StaffContactsSidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default ContactsApp;
