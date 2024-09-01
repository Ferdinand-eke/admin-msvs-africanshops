import qs from 'qs';
// import axios from 'axios';
// import { getCompanyNews } from '../apiRoutes';
// import StrapiApi, { bannerReducer } from '../utils';
import reqApi from '../utils';

export const loginShop = async (values) => {
  // const query = qs.stringify({
  //   filters: { isFeatured: true },
  //   populate: ['image'],
  //   encodeValuesOnly: true,
  // });

  console.log('ApiValues', values);
  const res = await reqApi().post(`/shop/login`, values);

  const authResult = res.data;

  return authResult;
};
