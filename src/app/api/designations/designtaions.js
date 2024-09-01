import qs from 'qs';
import axios from 'axios';
import { getCompanyNews } from '../apiRoutes';
import StrapiApi, { bannerReducer } from '../utils';

export const getDesignationsByPublished = async () => {

  const res = await StrapiApi().get(`/designations`);
  const designationsData = res.data;

  return designationsData;
};

export const createDesignation = async (values) => {
  const res = await StrapiApi().post(`/designations`, values);
  const postResult = res.data;

  return postResult;
};

export const getDesignation = async (id) => {
  const res = await StrapiApi().get(`/designations/${id}`);

  const payloadResult = res.data;
  return payloadResult;
};

export const updateDesignation = async (values) => {

  const res = await StrapiApi().put(`/designations/${values._id}`, values);


  const payloadResult = res.data;

  return payloadResult;
};
