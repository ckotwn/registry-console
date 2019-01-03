import qs from 'qs';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { collectionSearch } from './grbio.collection';

export const institutionSearch = query => {
  return axios_cancelable.get(`/grbio/institution?${qs.stringify(query)}`);
};

export const getInstitution = key => {
  return axios_cancelable.get(`/grbio/institution/${key}`);
};

export const getInstitutionOverview = async key => {
  const institution = (await getInstitution(key)).data;
  const collections = (await collectionSearch({ institution: key, limit: 0 })).data;

  return {
    institution,
    collections
  }
};

export const createInstitution = data => {
  return axiosInstance.post(`/grbio/institution`, data);
};

export const updateInstitution = data => {
  return axiosInstance.put(`/grbio/institution/${data.key}`, data);
};

export const deleteContact = (key, contactKey) => {
  return axiosInstance.delete(`/grbio/institution/${key}/contact/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstance.put(`/grbio/institution/${key}/contact/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstance.post(`/grbio/institution/${key}/contact`, contactData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstance.delete(`/grbio/institution/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstance.post(`/grbio/institution/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstance.delete(`/grbio/institution/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstance.post(`/grbio/institution/${key}/tag`, tagData);
};