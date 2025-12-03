import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createProdCat, deleteProdCatById, getProdCatById, getProdCats, updateProdCatById } from '../apiRoutes';

export default function useProductCats() {
	return useQuery(['__productcats'], getProdCats);
} // (Msvs => Done)

// get single product category
export function useSingleProductCat(proCatId) {
	if (!proCatId || proCatId === 'new') {
		return {};
	}

	return useQuery(['__productcatsById', proCatId], () => getProdCatById(proCatId), {
		enabled: Boolean(proCatId)
		// staleTime: 5000,
	});
} // (Msvs => Done)

// create new product category
export function useAddProductCatMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newProdCat) => {
			return createProdCat(newProdCat);
		},

		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success('product category added successfully!');
					queryClient.invalidateQueries(['__productcats']);
					queryClient.refetchQueries('__productcats', { force: true });
					navigate('/productcategories/list');
				}
			}
		},
		{
			onError: (error, values, rollback) => {
				// Handle NestJS error responses comprehensively
				let errorMessage = 'An unexpected error occurred';

				if (error.response?.data) {
					const { message, error: errorType, statusCode } = error.response.data;

					// NestJS validation errors return message as an array
					if (Array.isArray(message)) {
						errorMessage = message.join(', ');
					}
					// Single message string
					else if (message) {
						errorMessage = message;
					}
					// Fallback to error type with status code
					else if (errorType) {
						errorMessage = `${errorType}${statusCode ? ` (${statusCode})` : ''}`;
					}
				}
				// Network or other errors
				else if (error.message) {
					errorMessage = error.message;
				}

				toast.error(errorMessage);
				rollback();
			}
		}
	);
}

// update new product category
export function useProductCatUpdateMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(updateProdCatById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('product category updated successfully...!');
				queryClient.invalidateQueries('__productcats');
				queryClient.refetchQueries('__productcats', { force: true });
				navigate('/productcategories/list');
			}
		},
		onError: (error) => {
			// Handle NestJS error responses comprehensively
			let errorMessage = 'An unexpected error occurred';

			if (error.response?.data) {
				const { message, error: errorType, statusCode } = error.response.data;

				// NestJS validation errors return message as an array
				if (Array.isArray(message)) {
					errorMessage = message.join(', ');
				}
				// Single message string
				else if (message) {
					errorMessage = message;
				}
				// Fallback to error type with status code
				else if (errorType) {
					errorMessage = `${errorType}${statusCode ? ` (${statusCode})` : ''}`;
				}
			}
			// Network or other errors
			else if (error.message) {
				errorMessage = error.message;
			}

			toast.error(errorMessage);
		}
	});
} // (Msvs => Done)

export function useDeleteProductCategory() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteProdCatById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('category deleted successfully!!');
				queryClient.invalidateQueries('shopplans');
				queryClient.refetchQueries('shopplans', { force: true });
				navigate('/productcategories/list');
			}
		},
		onError: (error) => {
			// Handle NestJS error responses comprehensively
			let errorMessage = 'An unexpected error occurred';

			if (error.response?.data) {
				const { message, error: errorType, statusCode } = error.response.data;

				// NestJS validation errors return message as an array
				if (Array.isArray(message)) {
					errorMessage = message.join(', ');
				}
				// Single message string
				else if (message) {
					errorMessage = message;
				}
				// Fallback to error type with status code
				else if (errorType) {
					errorMessage = `${errorType}${statusCode ? ` (${statusCode})` : ''}`;
				}
			}
			// Network or other errors
			else if (error.message) {
				errorMessage = error.message;
			}

			toast.error(errorMessage);
		}
	});
}
