import qs from 'qs';
import axios from 'axios';
import { getCompanyNews } from '../apiRoutes';
import StrapiApi, { bannerReducer } from '../utils';

export const getDesignationsByPublished = async () => {
  console.log('UseQuery Reached Here');

  const res = await StrapiApi().get(`/designations`);
  const designationsData = res.data;
  console.log('designationApi@', designationsData);

  return designationsData;
};

export const createDesignation = async (values) => {
  console.log('ApiValues', values);
  const res = await StrapiApi().post(`/designations`, values);
  console.log('ApiCreatedData', res);
  const postResult = res.data;

  return postResult;
};

export const getDesignation = async (id) => {
  const res = await StrapiApi().get(`/designations/${id}`);

  const payloadResult = res.data;
  console.log('EndPoint Data', payloadResult);
  return payloadResult;
};

export const updateDesignation = async (values) => {
  // console.log('SentID', id);
  // console.log('ApiToSaveValues', values);
  // console.log('PayloadID', values._id);

  //return;
  const res = await StrapiApi().put(`/designations/${values._id}`, values);

  //console.log('UpdatedDept_DATA', res);

  const payloadResult = res.data;

  return payloadResult;
};
