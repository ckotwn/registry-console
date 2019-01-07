import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getConstituentDataset } from '../../api/dataset';
// Configuration
import { standardColumns } from '../search/columns';
// Components
import DataTable from '../widgets/DataTable';
import DataQuery from '../DataQuery';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/dataset/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const ConstituentsDataset = ({ datasetKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="datasetConstituent" defaultMessage="Constituent datasets"/>
      </h2>
      <DataQuery
        api={getConstituentDataset}
        initQuery={{ key: datasetKey, query: { q: '', limit: 25, offset: 0 } }}
        render={props => <DataTable {...props} noHeader={true} columns={columns}/>}
      />
    </React.Fragment>
  );
};

ConstituentsDataset.propTypes = {
  datasetKey: PropTypes.string.isRequired
};