import { toast } from 'react-toastify';

/**
 * Comprehensive error handler for React Query mutations and queries
 * Handles both NestJS and Express error formats
 *
 * @param {Error} error - The error object from the API request
 * @param {Function} rollback - Optional rollback function for optimistic updates
 * @param {Object} options - Additional options
 * @param {boolean} options.showToast - Whether to show a toast notification (default: true)
 * @param {string} options.defaultMessage - Default error message if none found
 * @returns {string} The formatted error message
 */
export const handleQueryError = (error, rollback = null, options = {}) => {
	const {
		showToast = true,
		defaultMessage = 'An unexpected error occurred. Please try again.'
	} = options;

	let errorMessage = defaultMessage;

	try {
		// Check if error exists and has a response
		if (error?.response) {
			const { data, status } = error.response;

			// Handle NestJS error format
			if (data?.message) {
				if (Array.isArray(data.message)) {
					// NestJS validation errors (class-validator)
					errorMessage = data.message.join(', ');
				} else if (typeof data.message === 'string') {
					// Single NestJS error message
					errorMessage = data.message;
				}
			}
			// Handle Express/Node.js error format
			else if (data?.error) {
				if (typeof data.error === 'string') {
					errorMessage = data.error;
				} else if (data.error.message) {
					errorMessage = data.error.message;
				}
			}
			// Handle custom error formats
			else if (data?.msg) {
				errorMessage = data.msg;
			}
			else if (data?.errors) {
				// Handle validation errors array
				if (Array.isArray(data.errors)) {
					errorMessage = data.errors.map(err => err.msg || err.message || err).join(', ');
				} else if (typeof data.errors === 'object') {
					// Handle validation errors object (e.g., { field: 'error message' })
					errorMessage = Object.values(data.errors).join(', ');
				}
			}
			// Handle HTTP status-specific messages
			else {
				switch (status) {
					case 400:
						errorMessage = 'Invalid request. Please check your input and try again.';
						break;
					case 401:
						errorMessage = 'Unauthorized. Please log in again.';
						break;
					case 403:
						errorMessage = 'Access denied. You do not have permission to perform this action.';
						break;
					case 404:
						errorMessage = 'Resource not found.';
						break;
					case 409:
						errorMessage = 'Conflict. This resource already exists.';
						break;
					case 422:
						errorMessage = 'Validation failed. Please check your input.';
						break;
					case 429:
						errorMessage = 'Too many requests. Please try again later.';
						break;
					case 500:
						errorMessage = 'Server error. Please try again later.';
						break;
					case 503:
						errorMessage = 'Service unavailable. Please try again later.';
						break;
					default:
						errorMessage = `Error ${status}: ${defaultMessage}`;
				}
			}
		}
		// Handle network errors
		else if (error?.request) {
			errorMessage = 'Network error. Please check your internet connection and try again.';
		}
		// Handle other error types
		else if (error?.message) {
			errorMessage = error.message;
		}
	} catch (parseError) {
		console.error('Error parsing error response:', parseError);
		errorMessage = defaultMessage;
	}

	// Show toast notification if enabled
	if (showToast) {
		toast.error(errorMessage, {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true
		});
	}

	// Execute rollback if provided (for optimistic updates)
	if (rollback && typeof rollback === 'function') {
		try {
			rollback();
		} catch (rollbackError) {
			console.error('Error during rollback:', rollbackError);
		}
	}

	// Log error to console in development
	if (process.env.NODE_ENV === 'development') {
		console.error('Query Error:', {
			message: errorMessage,
			originalError: error,
			response: error?.response,
			status: error?.response?.status
		});
	}

	return errorMessage;
};

/**
 * Create an onError handler for React Query with optional custom options
 *
 * @param {Object} options - Custom options for the error handler
 * @returns {Function} The onError handler function
 *
 * @example
 * // Basic usage
 * const mutation = useMutation(createUser, {
 *   onError: createErrorHandler()
 * });
 *
 * @example
 * // With rollback for optimistic updates
 * const mutation = useMutation(updateUser, {
 *   onError: createErrorHandler({ defaultMessage: 'Failed to update user' })
 * });
 *
 * @example
 * // Without toast (custom handling)
 * const mutation = useMutation(deleteUser, {
 *   onError: (error, variables, rollback) => {
 *     const message = handleQueryError(error, rollback, { showToast: false });
 *     // Custom error handling
 *   }
 * });
 */
export const createErrorHandler = (options = {}) => {
	return (error, _variables, rollback) => {
		handleQueryError(error, rollback, options);
	};
};

/**
 * Extract error message without showing toast
 * Useful for custom error handling
 */
export const getErrorMessage = (error) => {
	return handleQueryError(error, null, { showToast: false });
};

export default handleQueryError;
