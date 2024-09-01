import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useAdminOrderItems } from 'src/app/api/orders/useAdminGetShopOrders';
import { useParams } from 'react-router';

const Root = styled('div')(({ theme }) => ({
	'& table ': {
		'& th:first-of-type, & td:first-of-type': {
			paddingLeft: `${0}!important`
		},
		'& th:last-child, & td:last-child': {
			paddingRight: `${0}!important`
		}
	},
	'& .divider': {
		width: 1,
		backgroundColor: theme.palette.divider,
		height: 144
	},
	'& .seller': {
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.getContrastText(theme.palette.primary.dark),
		marginRight: -88,
		paddingRight: 66,
		width: 480,
		'& .divider': {
			backgroundColor: theme.palette.getContrastText(theme.palette.primary.dark),
			opacity: 0.5
		}
	}
}));

/**
 * The invoice tab.
 */
function InvoiceTab(props) {
	const { order } = props;
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'NGN',
		minimumFractionDigits: 2
	});

	const routeParams = useParams();
	const { orderId } = routeParams;
	const { data: orderItems } = useAdminOrderItems(orderId, {
		skip: !orderId
	});


	return (
		<Root className="grow shrink-0 p-0">
			{order && (
				<Card className="w-xl mx-auto shadow-0">
					<CardContent className="p-88 print:p-0">
						<Typography
							color="text.secondary"
							className="mb-32"
						>
							{order?.createdAT}
						</Typography>

						<div className="flex justify-between">
							<div>
								<table className="mb-16">
									<tbody>
										<tr>
											<td className="pb-4">
												<Typography
													className="font-light"
													variant="h6"
													color="text.secondary"
												>
													INVOICE
												</Typography>
											</td>
											<td className="pb-4 px-8">
												<Typography
													className="font-light"
													variant="h6"
													color="inherit"
												>
											 {order?._id}
												</Typography>
											</td>
										</tr>
									</tbody>
								</table>

								<Typography color="text.secondary">
									{/* {`${order?.customer?.firstName} ${order?.customer?.lastName}`} */}
									{`${order?.shippingAddress?.fullName} `}
								</Typography>

								{order?.shippingAddress?.address && (
									<Typography color="text.secondary">
										{order?.shippingAddress?.address}
									</Typography>
								)}
								{order?.shippingAddress?.phone && (
									<Typography color="text.secondary">{order?.shippingAddress?.phone}</Typography>
								)}
								{order?.shippingAddress?.prefContact && (
									<Typography color="text.secondary">{order?.shippingAddress?.prefContact}</Typography>
								)}
							</div>

							<div className="seller flex items-center p-16">
								<img
									className="w-80"
									// src="assets/images/logo/logo.svg"
									src="assets/images/afslogo/afLogo.svg"
									alt="logo"
								/>

								<div className="divider mx-8 h-96" />

								<div className="px-8">
									<Typography color="inherit">AFRICANSHOPS.</Typography>

									<Typography color="inherit">The Paradise Court, Idu, Abuja, 900288</Typography>
									<Typography color="inherit">+234 803 586 8983</Typography>
									<Typography color="inherit">africanshops.africanshops.org</Typography>
									<Typography color="inherit">www.africanshops.org</Typography>
								</div>
							</div>
						</div>

						<div className="mt-64">
							<Table className="simple">
								<TableHead>
									<TableRow>
										<TableCell>PRODUCT</TableCell>
										<TableCell>PRICE</TableCell>
										<TableCell align="right">QUANTITY</TableCell>
										<TableCell align="right">TOTAL</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{orderItems?.data?.map((product) => (
										<TableRow key={product?._id}>
											<TableCell>
												<Typography variant="subtitle1">{product?.name}</Typography>
											</TableCell>
											<TableCell align="right">
												{product?.price && formatter.format(+product?.price)}
											</TableCell>
											<TableCell align="right">{product?.quantity}</TableCell>
											<TableCell align="right">
												{product?.price &&
													product?.quantity &&
													formatter.format(+product?.price * product?.quantity)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							<Table className="simple mt-32">
								<TableBody>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												SUBTOTAL
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												{formatter.format(+order?.itemsPrice)}
											</Typography>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												TAX
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												{formatter.format(+order?.taxPrice)}
											</Typography>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												DISCOUNT
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												{formatter.format(+order?.discount || 0)}
											</Typography>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography
												className="font-light"
												variant="h4"
												color="text.secondary"
											>
												TOTAL
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-light"
												variant="h4"
												color="text.secondary"
											>
												{formatter.format(+order?.totalPrice)}
											</Typography>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>

						<div className="mt-96">
							<Typography
								className="mb-24 print:mb-12"
								variant="body1"
							>
								Please pay within 15 days. Thank you for your business.
							</Typography>

							<div className="flex">
								<div className="shrink-0">
									<img
										className="w-32"
										// src="assets/images/logo/logo.svg"
										src="assets/images/afslogo/afLogo.svg"
										alt="logo"
									/>
								</div>

								<Typography
									className="font-normal mb-64 px-24"
									variant="caption"
									color="text.secondary"
								>
									In condimentum malesuada efficitur. Mauris volutpat placerat auctor. Ut ac congue
									dolor. Quisque scelerisque lacus sed feugiat fermentum. Cras aliquet facilisis
									pellentesque. Nunc hendrerit quam at leo commodo, a suscipit tellus dapibus. Etiam
									at felis volutpat est mollis lacinia. Mauris placerat sem sit amet velit mollis, in
									porttitor ex finibus. Proin eu nibh id libero tincidunt lacinia et eget eros.
								</Typography>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</Root>
	);
}

export default memo(InvoiceTab);
