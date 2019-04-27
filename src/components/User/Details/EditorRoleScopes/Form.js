import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Select, Spin, Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import injectSheet from 'react-jss';

// APIs
import { getNodeSuggestions } from '../../../../api/node';
import { getOrgSuggestions } from '../../../../api/organization';
// Components
import { FormItem } from '../../../common';

const styles = {
  select: {
    width: '100%'
  },
  tagContainer: {
    marginTop: '15px',
    '& > *': {
      margin: '5px'
    }
  },
  textContent: {
    maxWidth: '98%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    float: 'left'
  }
};

class EditorRoleScopeForm extends Component {
  state = {
    nodes: [],
    organizations: [],
    fetchingNodes: false,
    fetchingOrganizations: false
  };

  handleNodeSearch = value => {
    if (!value) {
      this.setState({ nodes: [] });
      return;
    }

    this.setState({ fetchingNodes: true });

    getNodeSuggestions({ q: value }).then(response => {
      this.setState({
        nodes: response.data,
        fetchingNodes: false
      });
    });
  };

  handleOrganizationSearch = value => {
    if (!value) {
      this.setState({ organizations: [] });
      return;
    }

    this.setState({ fetchingOrganizations: true });

    getOrgSuggestions({ q: value }).then(response => {
      this.setState({
        organizations: response.data,
        fetchingOrganizations: false
      });
    });
  };

  handleSelect = (key, type) => {
    const { nodes, organizations } = this.state;
    const item = (type === 'NODE' ? nodes : organizations).find(item => item.key === key);

    this.props.onAdd({ ...item, type });
  };

  handleClose = key => {
    this.props.onRemove(key);
  };

  render() {
    const { nodes, organizations, fetchingNodes, fetchingOrganizations } = this.state;
    const { scopes, classes } = this.props;

    return (
      <React.Fragment>
        <FormItem label={<FormattedMessage id="scopes.node" defaultMessage="Node scopes"/>}>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={false}
            placeholder={<FormattedMessage id="select.node" defaultMessage="Select a node"/>}
            notFoundContent={
              fetchingNodes ? <Spin size="small"/> : <FormattedMessage id="notFound" defaultMessage="Not Found"/>
            }
            onSelect={key => this.handleSelect(key, 'NODE')}
            onSearch={this.handleNodeSearch}
            allowClear={true}
            className={classes.select}
          >
            {nodes.map(node => (
              <Select.Option value={node.key} key={node.key}>
                {node.title}
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        <FormItem label={<FormattedMessage id="scopes.organization" defaultMessage="Organization scopes"/>}>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={false}
            placeholder={<FormattedMessage id="select.organization" defaultMessage="Select an organization"/>}
            notFoundContent={
              fetchingOrganizations ? <Spin size="small"/> :
                <FormattedMessage id="notFound" defaultMessage="Not Found"/>
            }
            onSelect={key => this.handleSelect(key, 'ORGANIZATION')}
            onSearch={this.handleOrganizationSearch}
            allowClear={true}
            className={classes.select}
          >
            {organizations.map(organization => (
              <Select.Option value={organization.key} key={organization.key}>
                {organization.title}
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        <Row type="flex">
          <Col span={24} className={classes.tagContainer}>
            {scopes.map(scope => (
              <Tag closable onClose={() => this.handleClose(scope.key)} key={scope.key}>
                <span className={classes.textContent}>{scope.title}</span>
              </Tag>
            ))}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

EditorRoleScopeForm.propTypes = {
  scopes: PropTypes.array,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default injectSheet(styles)(EditorRoleScopeForm);