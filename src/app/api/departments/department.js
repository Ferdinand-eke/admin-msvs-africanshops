import qs from 'qs';
import axios from 'axios';
import { getCompanyNews } from '../apiRoutes';
import StrapiApi, { bannerReducer } from '../utils';

export const getDepartmentsByPublished = async () => {

  const res = await StrapiApi().get(`/departments`);
  const departmentsData = res.data;

  return departmentsData;
};

export const createDepartment = async (values) => {
  const res = await StrapiApi().post(`/departments`, values);
  const postResult = res.data;

  return postResult;
};

export const getDepartment = async (id) => {
  const res = await StrapiApi().get(`/departments/${id}`);

  const payloadResult = res.data;
  return payloadResult;
};

export const updateDepartment = async (values) => {
  const res = await StrapiApi().put(`/departments/${values._id}`, values);

  const payloadResult = res.data;

  return payloadResult;
};
