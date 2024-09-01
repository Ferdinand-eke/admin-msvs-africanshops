import qs from 'qs';
import reqApi from '../utils';

export const loginShop = async (values) => {
  const res = await reqApi().post(`/shop/login`, values);

  const authResult = res.data;

  return authResult;
};
