import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, notification } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { prepareData } from '../../../api/util/helpers';
import IdentifierCreateForm from './IdentifierCreateForm';
import IdentifierPresentation from './IdentifierPresentation';
import { ConfirmDeleteControl } from '../../widgets';
import PermissionWrapper from '../../hoc/PermissionWrapper';

class IdentifierList extends React.Component {
  state = {
    list: this.props.data || [],
    editVisible: false,
    detailsVisible: false,
    selectedItem: null
  };

  showModal = () => {
    this.setState({ editVisible: true });
  };

  showDetails = item => {
    this.setState({
      selectedItem: item,
      detailsVisible: true
    });
  };

  /**
   * I took this implementation from the official documentation, From Section
   * https://ant.design/components/form/
   * Please, check the part "Form in Modal toCreate"
   */
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({
      editVisible: false,
      detailsVisible: false,
      selectedItem: null
    });
  };

  deleteIdentifier = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteIdentifier(item.key).then(() => {
        // Updating endpoints list
        const { list } = this.state;
        this.setState({
          list: list.filter(el => el.key !== item.key)
        });
        this.props.update('identifiers', list.length - 1);
        notification.success({
          message: this.props.intl.formatMessage({
            id: 'beenDeleted.identifier',
            defaultMessage: 'Identifier has been deleted'
          })
        });

        resolve();
      }).catch(reject);
    }).catch(() => console.log('Oops errors!'));
  };

  handleSave = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const preparedData = prepareData(values);

      this.props.createIdentifier(preparedData).then(response => {
        form.resetFields();

        const list = this.state.list;
        list.unshift({
          ...preparedData,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName
        });
        this.props.update('identifiers', list.length);
        notification.success({
          message: this.props.intl.formatMessage({
            id: 'beenSaved.identifier',
            defaultMessage: 'Identifier has been saved'
          })
        });

        this.setState({
          editVisible: false,
          list
        });
      });
    });
  };

  render() {
    const { list, editVisible, detailsVisible, selectedItem } = this.state;
    const { intl } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.identifier',
      defaultMessage: 'Are you sure delete this identifier?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <h1><FormattedMessage id="organizationIdentifiers" defaultMessage="Organization identifiers"/></h1>

            <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
              <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                <FormattedMessage id="createNew" defaultMessage="Create new"/>
              </Button>
            </PermissionWrapper>
          </Row>

          <List
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
              <List.Item actions={[
                <Button htmlType="button" onClick={() => this.showDetails(item)} className="btn-link" type="primary"
                        ghost={true}>
                  <FormattedMessage id="details" defaultMessage="Details"/>
                </Button>,
                <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteIdentifier(item)}/>
                </PermissionWrapper>
              ]}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={
                      <React.Fragment>
                        <strong className="item-title">{item.identifier}</strong>
                        <span className="item-type">{item.type}</span>
                      </React.Fragment>
                    }
                    description={
                      <React.Fragment>
                        <FormattedMessage
                          id="createdByRow"
                          defaultMessage={`Created {date} by {author}`}
                          values={{ date: <FormattedRelative value={item.created}/>, author: item.createdBy }}
                        />
                      </React.Fragment>
                    }
                  />
                </Skeleton>
              </List.Item>
            )}
          />

          {/*
            If you want to get ref after Form.create, you can use wrappedComponentRef provided by rc-form
            https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140
          */}
          {editVisible && <IdentifierCreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={editVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />}

          {detailsVisible && <IdentifierPresentation
            visible={detailsVisible}
            onCancel={this.handleCancel}
            data={selectedItem}
          />}
        </div>
      </React.Fragment>
    );
  }
}

IdentifierList.propTypes = {
  data: PropTypes.array.isRequired,
  createIdentifier: PropTypes.func.isRequired,
  deleteIdentifier: PropTypes.func.isRequired,
  user: PropTypes.object,
  update: PropTypes.func.isRequired
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(injectIntl(IdentifierList));