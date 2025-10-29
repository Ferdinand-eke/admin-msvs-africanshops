import { useQuery } from 'react-query';
import { adminGetEstatePropertyById } from '../apiRoutes';

// Get single estate property by ID
export default function useEstateProperty(propertyId) {
  return useQuery(
    ['__estate_property', propertyId],
    () => adminGetEstatePropertyById(propertyId),
    {
      enabled: Boolean(propertyId),
      select: (data) => data?.data?.property || data?.data,
    }
  );
}
