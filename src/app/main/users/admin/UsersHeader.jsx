import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { useEffect } from 'react';
import { setSearchText, resetSearchText, selectSearchText } from './contactsAppSlice';
import { selectFilteredContactList, useGetContactsListQuery } from './ContactsApi';
import useGetAllUsers from 'src/app/aaqueryhooks/usersHandlingQuery';
import useGetAllAdminUsers from 'src/app/aaqueryhooks/adminHandlingQuery';

/**
 * The contacts header.
 */
function UsersHeader() {
	const dispatch = useAppDispatch();
	const searchText = useAppSelector(selectSearchText);
	// const { data, isLoading } = useGetContactsListQuery();
	

	// const filteredData = useAppSelector(selectFilteredContactList(data)); 

	// const {data:usersData1, isLoading:usersIsLoading2} = useGetAllAdminUsers()
	// const {data:usersData, isLoading:usersIsLoading} = useGetAllUsers()
	const {data:usersData, isLoading:usersIsLoading} = useGetAllAdminUsers()

	// console.log("ADMIN-Staff11", usersData?.data)

	const filteredData = useAppSelector(selectFilteredContactList(usersData?.data));
	useEffect(() => {
		return () => {
			dispatch(resetSearchText());
		};
	}, []);


	// if (isLoading) {
	// 	return null;
	// }
	if (usersIsLoading) {
		return null;
	}

	return (
		<div className="p-24 sm:p-32 w-full border-b-1">
			<div className="flex flex-col">
				<motion.span
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
				>
					<Typography className="text-24 md:text-32 font-extrabold tracking-tight leading-none">
						Staff
					</Typography>
				</motion.span>
				<motion.span
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
				>
					<Typography
						component={motion.span}
						className="text-14 font-medium ml-2"
						color="text.secondary"
					>
						{`${filteredData?.length} contacts`}
					</Typography>
				</motion.span>
			</div>
			<div className="flex flex-1 items-center mt-16 -mx-8">
				<Box
					component={motion.div}
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className="flex flex-1 w-full sm:w-auto items-center px-16 mx-8 border-1 rounded-full"
				>
					<FuseSvgIcon
						color="action"
						size={20}
					>
						heroicons-outline:search
					</FuseSvgIcon>

					<Input
						placeholder="Search contacts"
						className="flex flex-1 px-16"
						disableUnderline
						fullWidth
						value={searchText}
						inputProps={{
							'aria-label': 'Search'
						}}
						onChange={(ev) => dispatch(setSearchText(ev))}
					/>
				</Box>
				<Button
					className="mx-8"
					variant="contained"
					color="secondary"
					component={NavLinkAdapter}
					// to="new/edit"
					to="new/create"

				
					// component={NavLinkAdapter}
					// to="/users/admin/operate/edit"
					// to="/users/admin/operate/new"
						// size={isMobile ? 'small' : 'medium'}
				>
					<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
					<span className="hidden sm:flex mx-8">Add Admin Staff</span>
				</Button>
				
			</div>
		</div>
	);
}


export default UsersHeader;
