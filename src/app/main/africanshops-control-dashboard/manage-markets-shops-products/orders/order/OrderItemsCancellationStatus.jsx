import clsx from 'clsx';
import { useHandleRefundApprovalAndPayment } from 'src/app/api/orders/useAdminGetShopOrders';

/**
 * The order item cancellation status component.
 */

function OrderItemsCancellationStatus(props) {
	const { isCanceled, isRefundRequested, orderItemId, isApprovedAndRefundedByAfricanshops } = props;

	const approveRefundAndPay = useHandleRefundApprovalAndPayment();

	const initiateRefund = (itemId) => {
		if (window.confirm('Approving refund?')) {
			approveRefundAndPay.mutate(itemId);
		}
	};

	return (
		<>
			{isCanceled && !isRefundRequested && (
				<div
					className={clsx(
						'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
						'bg-yellow text-white'
					)}
				>
					Item Cancelled & Refund Request Pending{' '}
				</div>
			)}

			{isCanceled && isRefundRequested && !isApprovedAndRefundedByAfricanshops && (
				<div
					className={clsx(
						'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
						'bg-orange text-white cursor-pointer'
					)}
					onClick={() => initiateRefund(orderItemId)}
				>
					Refund Requested: Iniiate Refund{' '}
				</div>
			)}

			{isApprovedAndRefundedByAfricanshops && (
				<div
					className={clsx(
						'inline text-12 font-semibold py-4 px-12 rounded-full truncate ',
						'bg-orange-900 text-white'
					)}
				>
					Refund Paid
				</div>
			)}

			{!isCanceled && !isRefundRequested && (
				<div
					className={clsx(
						'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
						'bg-gray-400 text-white'
					)}
				>
					View Item
				</div>
			)}
		</>
	);
}

export default OrderItemsCancellationStatus;
