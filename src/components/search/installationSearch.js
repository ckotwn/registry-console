import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _cloneDeep from 'lodash/cloneDeep';

import { search } from '../../api/installation';
import DataTable from '../common/DataTable';
import DataQuery from '../DataQuery';
import { standardColumns } from './columns';
import { ItemHeader } from '../common';
import { HasRight, rights } from '../auth';
import Paper from './Paper';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '400px',
    render: (text, record) => <Link to={`/installation/${record.key}`}>{text}</Link>
  },
  ..._cloneDeep(standardColumns)
];
// Attaching filters to the last column
columns[columns.length - 1].filters = [
  { text: <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>, value: 'deleted' },
  {
    text: <FormattedMessage id="listType.servingNoDatasets" defaultMessage="Serving no datasets"/>,
    value: 'servingNoDatasets'
  }
];
// Setting filter type as radio - can choose only one option
columns[columns.length - 1].filterMultiple = false;

const title = { id: 'title.installations', defaultMessage: 'Installations | GBIF Registry' };
const listName = <FormattedMessage id="installations" defaultMessage="Installations"/>;

const getType = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="listType.deleted" defaultMessage="Deleted"/>;
    case 'servingNoDatasets':
      return <FormattedMessage id="listType.servingNoDatasets" defaultMessage="Serving no datasets"/>;
    default:
      return <FormattedMessage id="listType.search" defaultMessage="Search"/>;
  }
};

const getTitle = type => {
  switch (type) {
    case 'deleted':
      return <FormattedMessage id="menu.installation.deleted" defaultMessage="Deleted installations"/>;
    case 'servingNoDatasets':
      return <FormattedMessage id="menu.installation.empty" defaultMessage="Empty installations"/>;
    default:
      return <FormattedMessage id="menu.installation.search" defaultMessage="Search installations"/>;
  }
};

export const InstallationSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={search}
    initQuery={initQuery}
    render={props =>
      <React.Fragment>
        <ItemHeader listType={[listName, getType(props.filter.type)]} pageTitle={title} listTitle={getTitle(props.filter.type)}>
          <HasRight rights={rights.CAN_ADD_INSTALLATION}>
            <Link to="/installation/create" className="ant-btn ant-btn-primary">
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Link>
          </HasRight>
        </ItemHeader>
        <Paper padded>
          <DataTable {...props} columns={columns} searchable/>
        </Paper>
      </React.Fragment>
    }/>;
};