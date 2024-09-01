import qs from 'qs';
import axios from 'axios';
import { getCompanyNews } from '../apiRoutes';
import StrapiApi, { bannerReducer } from '../utils';

export const getDepartmentsByPublished = async () => {
  // console.log('UseQuery Reached Here');
  // const query = qs.stringify({
  //   filters: { isFeatured: true },
  //   populate: ['image'],
  //   encodeValuesOnly: true,
  // });

  const res = await StrapiApi().get(`/departments`);

  // console.log('bannerApi', res);

  const departmentsData = res.data;
  console.log('depts@Api', departmentsData);

  return departmentsData;
};

export const createDepartment = async (values) => {
  console.log('ApiValues', values);
  const res = await StrapiApi().post(`/departments`, values);
  console.log('ApiCreatedData', res);
  const postResult = res.data;

  return postResult;
};

export const getDepartment = async (id) => {
  const res = await StrapiApi().get(`/departments/${id}`);

  const payloadResult = res.data;
  // console.log('EndPoint Data', payloadResult);
  return payloadResult;
};

export const updateDepartment = async (values) => {
  // console.log('SentID', id);
  // console.log('ApiToSaveValues', values);
  // console.log('PayloadID', values._id);

  //return;
  const res = await StrapiApi().put(`/departments/${values._id}`, values);

  //console.log('UpdatedDept_DATA', res);

  const payloadResult = res.data;

  return payloadResult;
};
