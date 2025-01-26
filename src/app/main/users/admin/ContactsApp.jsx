import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import StaffHeader from './StaffHeader';
import UsersList from './StaffUsersList';
import StaffContactsSidebarContent from './StaffContactsSidebarContent';
import useAdminUsers from 'src/app/api/admin-users/useAdmins';

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

	const {data:usersData, isLoading:usersIsLoading} = useAdminUsers()
	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);



	

	return (
		<Root
			header={<StaffHeader 
				usersData={usersData?.data} 
				usersIsLoading={usersIsLoading}
			/>}


			content={<UsersList 
				usersData={usersData?.data} 
				usersIsLoading={usersIsLoading}
			/>}
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
