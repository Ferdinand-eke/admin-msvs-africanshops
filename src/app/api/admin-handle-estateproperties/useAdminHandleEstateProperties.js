import { useMutation, useQuery, useQueryClient } from 'react-query';
// // import { toast } from 'react-toastify';
// // import { storeShopProduct } from '../../store-redux/api/apiRoutes';
// import {
//   getMyShopEstatePropertyBySlug,
//   // getMyShopProductById,
//   getShopEstateProperties,
//   // getShopProducts,
//   // pullMyShopProductByIdFromExport,
//   // pushMyShopProductByIdToExport,
//   storeShopEstateProperty,
//   // storeShopProduct,
//   updateMyShopEstatePropertyById,
//   // updateMyShopProductById,
// } from '../../client/clientToApiRoutes';
// // import { message } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { adminGetEstatePropertiess, adminGetShopOnEstateProperties, adminGetSingleShopAndEstateProperties } from '../apiRoutes';

//get all Specific user shop-estate property
export default function useMyShopEstateProperties() {
  return useQuery(['__estateproperties'], adminGetEstatePropertiess);
}

export function useShopOnEstateProperties() {
  return useQuery(['__shopsonestates'], adminGetShopOnEstateProperties);
}

//get single estate property details
export function useAdminGetSingleShopAndEstateProperties(slug) {
  if (!slug || slug === "new") {
    return {};
  }
  return useQuery(
    ['singleestateproperty', slug],
    () => adminGetSingleShopAndEstateProperties(slug),
    {
      enabled: Boolean(slug),
      // staleTime: 5000,
    }
  );
}

//create new product
// export function useAddShopEstatePropertyMutation() {
//   const navigate = useNavigate()
//   const queryClient = useQueryClient();
//   return useMutation(
//     (newEstateProperty) => {
//       // console.log('Run Product : ', newEstateProperty);

//       // return;
//       return storeShopEstateProperty(newEstateProperty);
//     },

//     {
//       onSuccess: (data) => {
//         if (data?.data?.success && data?.data?.savedEstateProperty) {
//           console.log('New ESTATEPROPERTY  Data', data);

//           toast.success('property  added successfully!');
//           queryClient.invalidateQueries(['__myshop_estateproperties']);
//           queryClient.refetchQueries('__myshop_estateproperties', { force: true });
//           navigate('/property/managed-listings')
//         }
//       },
//     },
//     {
//       onError: (error, rollback) => {
//         // return;
//         toast.error(
//           error.response && error.response.data.message
//             ? error.response.data.message
//             : error.message
//         );
//         console.log('MutationError', error.response.data);
//         console.log('MutationError', error.data);
//         rollback();
//       },
//     }
//   );
// }

//update existing product
// export function useEstatePropertyUpdateMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(updateMyShopEstatePropertyById, {
//     onSuccess: (data) => {
//       console.log('Updated Producr clientController', data);

//       if (data) {
//         message.success('product updated successfully!!');

//         queryClient.invalidateQueries('__myshop_estateproperties');
//         // queryClient.refetchQueries('__myshop_estateproperties', { force: true });
//       }

//       // navigate('/transaction-list');
//     },
//     onError: (error) => {
//       toast.error(
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message
//       );
//       // queryClient.invalidateQueries('__myshop_orders');
//     },
//   });
// }
