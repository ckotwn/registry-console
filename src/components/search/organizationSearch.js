import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DataTable from '../DataTable';
import DataQuery from '../DataQuery';
import { search, deleted, pending, nonPublishing } from '../../api/organization';
import { standardColumns } from './columns';
import { ItemHeader } from '../widgets';
import PermissionWrapper from '../hoc/PermissionWrapper';

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
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeSearch]} pageTitle={title}>
          <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
            <Link to="/organization/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </PermissionWrapper>
        </ItemHeader>
        <DataTable {...props} columns={columns} searchable/>
      </React.Fragment>
    }/>;
};

export const OrganizationDeleted = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={deleted}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeDeleted]} pageTitle={title}/>
        <DataTable {...props} columns={columns}/>
      </React.Fragment>
    }/>;
};

export const OrganizationPending = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={pending}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typePending]} pageTitle={title}/>
        <DataTable {...props} columns={columns}/>
      </React.Fragment>
    }/>;
};

export const OrganizationNonPublishing = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={nonPublishing}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, typeNonPublishing]} pageTitle={title}/>
        <DataTable {...props} columns={columns}/>
      </React.Fragment>
    }/>;
};

