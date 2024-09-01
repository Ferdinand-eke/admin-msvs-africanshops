import qs from 'qs';
// import axios from 'axios';
// import { getCompanyNews } from '../apiRoutes';
import reqApi, { fristGuestSeqApi, guestSeqApi } from '../utils';

export const getNewsPosts = async () => {
  // console.log('UseQuery Reached Here');
  // const query = qs.stringify({
  //   filters: { isFeatured: true },
  //   populate: ['image'],
  //   encodeValuesOnly: true,
  // });

  const res = await fristGuestSeqApi().get(`/posts`);

  console.log('PostDATA_RESPONSE', res);

  const postsData = res.data.data;
  console.log('PostsDATAAAA', postsData);

  return postsData;
};

export const getNewsPost = async (slug) => {
  const res = await fristGuestSeqApi().get(`/posts/by/${slug}`);

  const postsData = res.data;
  // console.log('Single_POST Data', postsData);
  return postsData;
};

// export const createDepartment = async (values) => {
//   console.log('ApiValues', values);
//   const res = await reqApi().post(`/departments`, values);
//   console.log('ApiCreatedData', res);
//   const postResult = res.data;

//   return postResult;
// };

// export const getDepartment = async (id) => {
//   const res = await reqApi().get(`/departments/${id}`);

//   const payloadResult = res.data;
//   // console.log('EndPoint Data', payloadResult);
//   return payloadResult;
// };

// export const updateDepartment = async (values) => {
//   // console.log('SentID', id);
//   // console.log('ApiToSaveValues', values);
//   // console.log('PayloadID', values._id);

//   //return;
//   const res = await reqApi().put(`/departments/${values._id}`, values);

//   //console.log('UpdatedDept_DATA', res);

//   const payloadResult = res.data;

//   return payloadResult;
// };
