import qs from 'qs';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { getOrganization } from './organization';

export const search = query => {
  return axios_cancelable.get(`/installation?${qs.stringify(query)}`);
};

export const deleted = query => {
  return axios_cancelable.get(`/installation/deleted?${qs.stringify(query)}`);
};

export const nonPublishing = query => {
  return axios_cancelable.get(`/installation/nonPublishing?${qs.stringify(query)}`);
};

export const getInstallation = key => {
  return axios_cancelable.get(`/installation/${key}`);
};

export const getServedDatasets = ({ key, query }) => {
  return axios_cancelable.get(`/installation/${key}/dataset?${qs.stringify(query)}`);
};

export const getSyncHistory = ({ key, query }) => {
  return axios_cancelable.get(`/installation/${key}/metasync?${qs.stringify(query)}`);
};

export const createInstallation = data => {
  return axiosInstance.post(`/installation`, data)
};

export const updateInstallation = data => {
  return axiosInstance.put(`/installation/${data.key}`, data)
};

export const getInstallationOverview = async key => {
  return Promise.all([
    getInstallation(key),
    getServedDatasets({ key, query: { limit: 0 } }),
    getSyncHistory({ key, query: { limit: 0 } })
  ]).then(async responses => {
    const organization = (await getOrganization(responses[0].data.organizationKey)).data;

    return {
      installation: {
        ...responses[0].data,
        organization
      },
      servedDataset: responses[1].data,
      syncHistory: responses[2].data
    };
  });
};

export const deleteContact = (key, contactKey) => {
  return axiosInstance.delete(`/installation/${key}/contact/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstance.put(`/installation/${key}/contact/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstance.post(`/installation/${key}/contact`, contactData);
};

export const deleteEndpoint = (key, endpointKey) => {
  return axiosInstance.delete(`/installation/${key}/endpoint/${endpointKey}`);
};

export const createEndpoint = (key, endpointData) => {
  return axiosInstance.post(`/installation/${key}/endpoint`, endpointData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstance.delete(`/installation/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstance.post(`/installation/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstance.delete(`/installation/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstance.post(`/installation/${key}/comment`, commentData);
};

export const syncInstallation = key => {
  return axiosInstance.post(`/installation/${key}/synchronize`);
};