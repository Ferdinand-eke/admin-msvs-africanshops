import { useQuery } from 'react-query';
import {
	adminGetEstatePropertiess,
	adminGetShopOnEstateProperties,
	adminGetSingleShopAndEstateProperties
} from '../apiRoutes';

// get all Specific user shop-estate property with pagination
export default function useAdminGetEstateProperties(params = {}) {
	const { limit, offset, title, numberOfRooms, minPrice, maxPrice, propertyUseCase, status, merchantId } = params;

	return useQuery(
		[
			'__estateproperties',
			{ limit, offset, title, numberOfRooms, minPrice, maxPrice, propertyUseCase, status, merchantId }
		],
		() =>
			adminGetEstatePropertiess({
				limit,
				offset,
				title,
				numberOfRooms,
				minPrice,
				maxPrice,
				propertyUseCase,
				status,
				merchantId
			}),
		{
			keepPreviousData: true // Keeps previous data while fetching new page
		}
	);
}

export function useShopOnEstateProperties() {
	return useQuery(['__shopsonestates'], adminGetShopOnEstateProperties);
}

// get single estate property details
export function useAdminGetSingleShopAndEstateProperties(slug) {
	if (!slug || slug === 'new') {
		return {};
	}

	return useQuery(['singleestateproperty', slug], () => adminGetSingleShopAndEstateProperties(slug), {
		enabled: Boolean(slug)
		// staleTime: 5000,
	});
}
