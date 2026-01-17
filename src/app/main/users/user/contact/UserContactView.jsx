import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useNavigate, useParams } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import { format } from 'date-fns/format';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'app/store/hooks';
import {
	useAdminBlockUserMutation,
	useAdminSuspendUserMutation,
	useAdminUnBlockUserMutation,
	useAdminUnSuspendUserMutation,
	usePopulatedSingleUser
} from 'src/app/api/users/useUsers';
import { Card, CardContent, IconButton, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

/**
 * The contact view.
 */
function UserContactView() {
	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};
	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	// const { data: countries } = useGetContactsCountriesQuery();
	// const { data: tags } = useGetContactsTagsQuery();
	// const routeParams = useParams();
	// const { id: contactId } = routeParams;
	// const {
	// 	data: contact,
	// 	isLoading,
	// 	isError
	// } = useGetContactsItemQuery(contactId, {
	// 	skip: !contactId
	// });
	// const dispatch = useAppDispatch();
	// const navigate = useNavigate();

	// function getCountryByIso(iso) {
	// 	return countries?.find((country) => country.iso === iso);
	// }

	// if (isLoading) {
	// 	return <FuseLoading className="min-h-screen" />;
	// }

	// if (isError) {
	// 	setTimeout(() => {
	// 		navigate('/users/list');
	// 		dispatch(showMessage({ message: 'NOT FOUND' }));
	// 	}, 0);
	// 	return null;
	// }

	// if (!contact) {
	// 	return null;
	// }

	const handleSuspension = useAdminSuspendUserMutation();
	const handleLiftSuspension = useAdminUnSuspendUserMutation();

	const handleBlockUser = useAdminBlockUserMutation();
	const handleUnBlockUser = useAdminUnBlockUserMutation();

	const routeParams = useParams();
	const { id: contactId } = routeParams;
	console.log('contactId', contactId);

	const {
		data: userInfo,
		isLoading: userInfoLoading,
		isError: userInfoIsError
	} = usePopulatedSingleUser(contactId, {
		skip: !contactId
	});

	console.log('contactId', userInfo);


	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	/** *Handle User Suspend||Un-suspend */
	const suspendUserOnPlatform = (adminId) => {
		if (window.confirm('Suspending a Staff?')) {
			handleSuspension.mutate(adminId);
		}
	};
	const removeUserSuspension = (adminId) => {
		if (window.confirm('Removing suspension on Staff?')) {
			handleLiftSuspension.mutate(adminId);
		}
	};

	/** *Handle User Block||Un-Block */
	const blockUser = (adminId) => {
		if (window.confirm('Blocking a user?')) {
			handleBlockUser.mutate(adminId);
		}
	};
	const unblockUser = (adminId) => {
		if (window.confirm('Removing block on user?')) {
			handleUnBlockUser.mutate(adminId);
		}
	};

	// function getCountryByIso(iso) {
	//   return countries?.find((country) => country.iso === iso);
	// }

	if (userInfoLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (userInfoIsError) {
		setTimeout(() => {
			navigate('/users/list');
			dispatch(showMessage({ message: 'NOT FOUND okay!' }));
		}, 0);
		return null;
	}

	if (!userInfo?.data?.user) {
		return null;
	}

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				{userInfo?.data?.user?.avatar && (
					<img
						className="absolute inset-0 object-cover w-full h-full"
						src={userInfo?.data?.user?.avatar}
						alt="user background"
					/>
				)}
			</Box>

			<div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
				<div className="w-full max-w-3xl">
					<div className="flex flex-auto items-end -mt-64">
						<Avatar
							sx={{
								borderWidth: 4,
								borderStyle: 'solid',
								borderColor: 'background.paper',
								backgroundColor: 'background.default',
								color: 'text.secondary'
							}}
							className="w-128 h-128 text-64 font-bold"
							src={userInfo?.data?.user?.avatar}
							alt={userInfo?.data?.user?.name}
						>
							{userInfo?.data?.user?.name?.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-4">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to="edit"
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
								<span className="mx-8">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-12 text-4xl font-bold truncate">{userInfo?.data?.user?.name}</Typography>

					<div className="flex flex-wrap items-center mt-8">
						{userInfo?.data?.user?.gender && (
							<Chip
								label={userInfo?.data?.user?.gender}
								className="mr-12 mb-12"
								size="small"
							/>
						)}
					</div>

					<Divider className="mt-16 mb-24" />

					<div className="flex flex-col space-y-8">
						{userInfo?.data?.user && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:office-building</FuseSvgIcon>
								<div className="ml-24 leading-6">AFRICANSHOPS</div>
							</div>
						)}

						{userInfo?.data?.user?.department?.name && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
								<div className="ml-24 leading-6">{userInfo?.data?.user?.department?.name}</div>
							</div>
						)}

						{userInfo?.data?.user?.email && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
								<div className="min-w-0 ml-24 space-y-4">
									<div className="flex items-center leading-6">
										<a
											className="hover:underline text-primary-500"
											href={`mailto: ${userInfo?.data?.user?.email}`}
											target="_blank"
											rel="noreferrer"
										>
											{userInfo?.data?.user?.email}
										</a>
										{userInfo?.data?.user?.email && (
											<Typography
												className="text-md truncate"
												color="text.secondary"
											>
												<span className="mx-8">&bull;</span>
												<span className="font-medium">{userInfo?.data?.user?.email}</span>
											</Typography>
										)}
									</div>
								</div>
							</div>
						)}

						{userInfo?.data?.user?.phone && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
								<div className="min-w-0 ml-24 space-y-4">
									<div className="flex items-center leading-6">
										<Box
											className="hidden sm:flex w-24 h-16 overflow-hidden"
											sx={{
												background:
													"url('/assets/images/apps/contacts/flags.png') no-repeat 0 0",
												backgroundSize: '24px 3876px'
											}}
										/>
										<div className="ml-10 font-mono">{userInfo?.data?.user?.phone}</div>
									</div>
								</div>
							</div>
						)}

						{userInfo?.data?.user?.address && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:location-marker</FuseSvgIcon>
								<div className="ml-24 leading-6">{userInfo?.data?.user?.address}</div>
							</div>
						)}

						{userInfo?.data?.user?.birthday && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
								<div className="ml-24 leading-6">
									{format(new Date(userInfo?.data?.user?.birthday), 'MMMM d, y')}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="mt-10 flex flex-row gap-8">
					<div className="items-center justify-start">
						<Card
							component={motion.div}
							variants={item}
							className="w-full mb-32 rounded-16 shadow"
						>
							<div className="px-8 gap-8 pt-24 flex justify-between items-center">
								<Typography className="flex flex-1 text-start text-lg font-semibold leading-tight">
									User Compliance
								</Typography>
								<div className="-mx-8">
									<Button
										color="inherit"
										size="small"
									>
										See status
									</Button>
								</div>
							</div>
							<CardContent className="px-16">
								<List className="p-0">
									<ListItem className="px-0 space-x-8 justify-between">
										<ListItemText
											primary={
												<>
													{userInfo?.data?.user?.isSuspended && (
														<Typography
															className="font-medium "
															color="red"
															paragraph={false}
														>
															Suspended
														</Typography>
													)}
													{!userInfo?.data?.user?.isSuspended && (
														<Typography
															className="font-medium "
															color="green"
															paragraph={false}
														>
															Not Suspended
														</Typography>
													)}
												</>
											}
										/>

										<>
											{!userInfo?.data?.user?.isSuspended && (
												<IconButton size="small">
													<FuseSvgIcon>heroicons-outline:check-circle</FuseSvgIcon>
												</IconButton>
											)}
											{userInfo?.data?.user?.isSuspended && (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													className="size-24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
													/>
												</svg>
											)}
										</>
									</ListItem>

									<ListItem className="px-0 space-x-8 justify-between">
										<ListItemText
											primary={
												<>
													{userInfo?.data?.user?.isBlocked && (
														<Typography
															className="font-medium "
															color="red"
															paragraph={false}
														>
															Blocked
														</Typography>
													)}
													{!userInfo?.data?.user?.isBlocked && (
														<Typography
															className="font-medium "
															color="green"
															paragraph={false}
														>
															Not Blocked
														</Typography>
													)}
												</>
											}
										/>

										<>
											{!userInfo?.data?.user?.isBlocked && (
												<IconButton size="small">
													<FuseSvgIcon>heroicons-outline:check-circle</FuseSvgIcon>
												</IconButton>
											)}
											{userInfo?.data?.user?.isBlocked && (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													className="size-24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
													/>
												</svg>
											)}
										</>
									</ListItem>
								</List>
							</CardContent>
						</Card>
					</div>
					<div className="items-start">
						<Card
							component={motion.div}
							variants={item}
							className="w-full mb-32 rounded-16 shadow"
						>
							<div className="px-24 gap-8 pt-24 flex items-center">
								<Typography className="flex flex-1 text-lg font-semibold leading-tight">
									User Disciplinary
								</Typography>
								<div className="-mx-8">
									<Button
										color="inherit"
										size="small"
									>
										Act
									</Button>
								</div>
							</div>

							<CardContent className="px-16">
								<List className="p-0">
									<>
										{!userInfo?.data?.user?.isSuspended && (
											<ListItem className="px-0 space-x-8 justify-between">
												<ListItemText
													primary={
														<Typography
															className="font-medium "
															color="secondary.main"
															paragraph={false}
														>
															Suspend User
														</Typography>
													}
												/>

												<div className="flex flex-wrap items-center mt-8">
													<Chip
														label="Suspend"
														className="mr-12 mb-12 cursor-pointer bg-red-500 hover:bg-red-800 w-full"
														size="small"
														onClick={() => suspendUserOnPlatform(userInfo?.data?.user?._id || userInfo?.data?.user?.id)}
													/>
												</div>
											</ListItem>
										)}

										<>
											{!userInfo?.data?.user?.isBlocked && (
												<>
													{userInfo?.data?.user?.isSuspended && (
														<ListItem className="px-0 space-x-8 justify-between">
															<ListItemText
																primary={
																	<Typography
																		className="font-medium "
																		color="secondary.main"
																		paragraph={false}
																	>
																		Remove Suspension
																	</Typography>
																}
															/>

															<div className="flex flex-wrap items-center mt-8">
																<Chip
																	label="Lift Suspension"
																	className="mr-12 mb-12 cursor-pointer bg-orange-500 hover:bg-orange-800 w-full"
																	size="small"
																	onClick={() =>
																		removeUserSuspension(userInfo?.data?.user?._id || userInfo?.data?.user?.id)
																	}
																/>
															</div>
														</ListItem>
													)}
												</>
											)}

											{userInfo?.data?.user?.isBlocked && (
												<div className="flex flex-wrap items-center mt-8">
													<Chip
														label="Unblock Admin Before lifting Suspension"
														className="mr-12 mb-12 bg-orange-500 hover:bg-orange-800 w-full"
														size="small"
													/>
												</div>
											)}
										</>
									</>
								</List>

								{userInfo?.data?.user?.isSuspended && (
									<List className="p-0">
										<>
											{!userInfo?.data?.user?.isBlocked && (
												<ListItem className="px-0 space-x-8 justify-between">
													<ListItemText
														primary={
															<Typography
																className="font-medium "
																color="secondary.main"
																paragraph={false}
															>
																Block Admin
															</Typography>
														}
													/>

													<div className="flex flex-wrap items-center mt-8">
														<Chip
															label="Block"
															className="mr-12 mb-12 cursor-pointer bg-red-500 hover:bg-red-800 w-full"
															size="small"
															onClick={() => blockUser(userInfo?.data?.user?._id || userInfo?.data?.user?.id)}
														/>
													</div>
												</ListItem>
											)}

											{userInfo?.data?.user?.isBlocked && (
												<>
													{userInfo?.data?.user?.isSuspended && (
														<ListItem className="px-0 space-x-8 justify-between">
															<ListItemText
																primary={
																	<Typography
																		className="font-medium "
																		color="secondary.main"
																		paragraph={false}
																	>
																		Un-block User
																	</Typography>
																}
															/>

															<div className="flex flex-wrap items-center mt-8">
																<Chip
																	label="Un-Block"
																	className="mr-12 mb-12 cursor-pointer bg-orange-500 hover:bg-orange-800 w-full"
																	size="small"
																	onClick={() => unblockUser(userInfo?.data?.user?._id || userInfo?.data?.user?.id)}
																/>
															</div>
														</ListItem>
													)}
												</>
											)}
										</>
									</List>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}

export default UserContactView;
