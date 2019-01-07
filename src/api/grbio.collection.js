import qs from 'qs';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { getInstitution } from './grbio.institution';

export const collectionSearch = query => {
  return axios_cancelable.get(`/grbio/collection?${qs.stringify(query)}`);
};

export const getCollection = key => {
  return axios_cancelable.get(`/grbio/collection/${key}`);
};

export const createCollection = data => {
  return axiosInstance.post(`/grbio/collection`, data);
};

export const updateCollection = data => {
  return axiosInstance.put(`/grbio/collection/${data.key}`, data);
};

export const getCollectionOverview = async key => {
  const collection = (await getCollection(key)).data;
  let institution;
  if (collection.institutionKey) {
    institution = (await getInstitution(collection.institutionKey)).data;
  }

  return {
    ...collection,
    institution
  }
};

export const deleteContact = (key, contactKey) => {
  return axiosInstance.delete(`/grbio/collection/${key}/contact/${contactKey}`);
};

export const addContact = (key, contactData) => {
  return axiosInstance.post(`/grbio/collection/${key}/contact`, contactData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstance.delete(`/grbio/collection/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstance.post(`/grbio/collection/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstance.delete(`/grbio/collection/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstance.post(`/grbio/collection/${key}/tag`, tagData);
};