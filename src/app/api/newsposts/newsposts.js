import qs from 'qs';
import reqApi, { fristGuestSeqApi, guestSeqApi } from '../utils';

export const getNewsPosts = async () => {
 

  const res = await fristGuestSeqApi().get(`/posts`);


  const postsData = res.data.data;

  return postsData;
};

export const getNewsPost = async (slug) => {
  const res = await fristGuestSeqApi().get(`/posts/by/${slug}`);

  const postsData = res.data;
  return postsData;
};

