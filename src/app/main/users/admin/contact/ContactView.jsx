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
	useAdminStaffBlockMutation,
	useAdminStaffSuspenMutation,
	useAdminStaffUnBlockMutation,
	useAdminStaffUnSuspednMutation,
	useSingleAdminStaff
} from 'src/app/api/admin-users/useAdmins';
import { Card, CardContent, IconButton, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useEffect } from 'react';

/**
 * The contact view.
 */
function ContactView() {
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

	const handleSuspension = useAdminStaffSuspenMutation();
	const handleLiftSuspension = useAdminStaffUnSuspednMutation();

	const handleBlockAdmin = useAdminStaffBlockMutation();
	const handleUnBlockAdmin = useAdminStaffUnBlockMutation();

	const routeParams = useParams();
	const { id: contactId } = routeParams;

	const {
		data: admin,
		isLoading: adminLoading,
		isError: adminIsError
	} = useSingleAdminStaff(contactId, {
		skip: !contactId
	});

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	/** *Handle Admin-Staff Suspend||Un-suspend */
	const suspendAdmin = (adminId) => {
		if (window.confirm('Suspending a Staff?')) {
			handleSuspension.mutate(adminId);
		}
	};
	const removeAdminSuspension = (adminId) => {
		if (window.confirm('Removing suspension on Staff?')) {
			handleLiftSuspension.mutate(adminId);
		}
	};

	/** *Handle Admin-Staff Block||Un-Block */

	const blockAdmin = (adminId) => {
		if (window.confirm('Blocking a Staff?')) {
			handleBlockAdmin.mutate(adminId);
		}
	};
	const unblockAdmin = (adminId) => {
		if (window.confirm('Removing block on Staff?')) {
			handleUnBlockAdmin.mutate(adminId);
		}
	};

	useEffect(() => {}, [contactId]);

	if (adminLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (adminIsError) {
		setTimeout(() => {
			navigate('/users/admin');
			dispatch(showMessage({ message: 'NOT FOUND okay!' }));
		}, 0);
		return null;
	}

	// if (!admin?.data?.admin) {
	//   return null;
	// }

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				{admin?.data?.admin?.avatar && (
					<img
						className="absolute inset-0 object-cover w-full h-full"
						src={admin?.data?.admin?.avatar}
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
							src={admin?.data?.admin?.avatar}
							alt={admin?.data?.admin?.name}
						>
							{admin?.data?.admin?.name?.charAt(0)}
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

					<Typography className="mt-12 text-4xl font-bold truncate">{admin?.data?.admin?.name}</Typography>

					<div className="flex flex-wrap items-center mt-8">
						<Chip
							label={admin?.data?.admin?.designation?.name}
							className="mr-12 mb-12"
							size="small"
						/>
					</div>

					<Divider className="mt-16 mb-24" />

					<div className="flex flex-col space-y-8">
						{admin?.data?.admin && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:office-building</FuseSvgIcon>
								<div className="ml-24 leading-6">AFRICANSHOPS</div>
							</div>
						)}

						{admin?.data?.admin?.department?.name && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
								<div className="ml-24 leading-6">{admin?.data?.admin?.department?.name}</div>
							</div>
						)}

						{admin?.data?.admin?.email && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
								<div className="min-w-0 ml-24 space-y-4">
									<div className="flex items-center leading-6">
										<a
											className="hover:underline text-primary-500"
											href={`mailto: ${admin?.data?.admin?.email}`}
											target="_blank"
											rel="noreferrer"
										>
											{admin?.data?.admin?.email}
										</a>
										{admin?.data?.admin?.email && (
											<Typography
												className="text-md truncate"
												color="text.secondary"
											>
												<span className="mx-8">&bull;</span>
												<span className="font-medium">{admin?.data?.admin?.email}</span>
											</Typography>
										)}
									</div>
								</div>
							</div>
						)}

						{admin?.data?.admin?.phone && (
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
										<div className="ml-10 font-mono">{admin?.data?.admin?.phone}</div>
									</div>
								</div>
							</div>
						)}

						{admin?.data?.admin?.address && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:location-marker</FuseSvgIcon>
								<div className="ml-24 leading-6">{admin?.data?.admin?.address}</div>
							</div>
						)}

						{admin?.data?.admin?.birthday && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
								<div className="ml-24 leading-6">
									{format(new Date(admin?.data?.admin?.birthday), 'MMMM d, y')}
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
									Admin Compliance
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
													{admin?.data?.admin?.isSuspended && (
														<Typography
															className="font-medium "
															color="red"
															paragraph={false}
														>
															Suspended
														</Typography>
													)}
													{!admin?.data?.admin?.isSuspended && (
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
											{!admin?.data?.admin?.isSuspended && (
												<IconButton size="small">
													<FuseSvgIcon>heroicons-outline:check-circle</FuseSvgIcon>
												</IconButton>
											)}
											{admin?.data?.admin?.isSuspended && (
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
													{admin?.data?.admin?.isBlocked && (
														<Typography
															className="font-medium "
															color="red"
															paragraph={false}
														>
															Blocked
														</Typography>
													)}
													{!admin?.data?.admin?.isBlocked && (
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
											{!admin?.data?.admin?.isBlocked && (
												<IconButton size="small">
													<FuseSvgIcon>heroicons-outline:check-circle</FuseSvgIcon>
												</IconButton>
											)}
											{admin?.data?.admin?.isBlocked && (
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
									Admin Disciplinary
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
										{!admin?.data?.admin?.isSuspended && (
											<ListItem className="px-0 space-x-8 justify-between">
												<ListItemText
													primary={
														<Typography
															className="font-medium "
															color="secondary.main"
															paragraph={false}
														>
															Suspend Admin
														</Typography>
													}
												/>

												<div className="flex flex-wrap items-center mt-8">
													<Chip
														label="Suspend"
														className="mr-12 mb-12 cursor-pointer bg-red-500 hover:bg-red-800 w-full"
														size="small"
														onClick={() => suspendAdmin(admin?.data?.admin?._id)}
													/>
												</div>
											</ListItem>
										)}

										<>
											{!admin?.data?.admin?.isBlocked && (
												<>
													{admin?.data?.admin?.isSuspended && (
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
																		removeAdminSuspension(admin?.data?.admin?._id)
																	}
																/>
															</div>
														</ListItem>
													)}
												</>
											)}

											{admin?.data?.admin?.isBlocked && (
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

								{admin?.data?.admin?.isSuspended && (
									<List className="p-0">
										<>
											{!admin?.data?.admin?.isBlocked && (
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
															onClick={() => blockAdmin(admin?.data?.admin?._id)}
														/>
													</div>
												</ListItem>
											)}

											{admin?.data?.admin?.isBlocked && (
												<>
													{admin?.data?.admin?.isSuspended && (
														<ListItem className="px-0 space-x-8 justify-between">
															<ListItemText
																primary={
																	<Typography
																		className="font-medium "
																		color="secondary.main"
																		paragraph={false}
																	>
																		Un-block Admin
																	</Typography>
																}
															/>

															<div className="flex flex-wrap items-center mt-8">
																<Chip
																	label="Un-Block"
																	className="mr-12 mb-12 cursor-pointer bg-orange-500 hover:bg-orange-800 w-full"
																	size="small"
																	onClick={() =>
																		unblockAdmin(admin?.data?.admin?._id)
																	}
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

export default ContactView;
