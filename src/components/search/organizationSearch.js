import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DataTable from '../DataTable';
import DataQuery from '../DataQuery';
import { search, deleted, pending, nonPublishing } from '../../api/organization';
import { standardColumns } from './columns';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '400px',
    render: (text, record) => <Link to={`/organization/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];
const title = { id: 'title.organizations', defaultMessage: 'Organizations | GBIF Registry' };
const listName = <FormattedMessage id="organizations" defaultMessage="Organizations"/>;
const typeSearch = <FormattedMessage id="search" defaultMessage="Search"/>;
const typeDeleted = <FormattedMessage id="deleted" defaultMessage="Deleted"/>;
const typePending = <FormattedMessage id="pending" defaultMessage="Pending"/>;
const typeNonPublishing = <FormattedMessage id="organizations.nonPublishing" defaultMessage="Non publishing organizations"/>;

export const OrganizationSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={search}
    initQuery={initQuery}
    listType={[listName, typeSearch]}
    render={props => <DataTable {...props} columns={columns} title={title} searchable/>}/>;
};

export const OrganizationDeleted = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={deleted}
    initQuery={initQuery}
    listType={[listName, typeDeleted]}
    render={props => <DataTable {...props} columns={columns} title={title}/>}/>;
};

export const OrganizationPending = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={pending}
    initQuery={initQuery}
    listType={[listName, typePending]}
    render={props => <DataTable {...props} columns={columns} title={title}/>}/>;
};

export const OrganizationNonPublishing = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={nonPublishing}
    initQuery={initQuery}
    listType={[listName, typeNonPublishing]}
    render={props => <DataTable {...props} columns={columns} title={title}/>}/>;
};

