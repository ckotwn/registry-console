import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';

import MachineTagCreateForm from './MachineTagCreateForm';
import MachineTagPresentation from './MachineTagPresentation';
import ConfirmDeleteControl from '../../widgets/ConfirmDeleteControl';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

class MachineTagList extends React.Component {
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

  deleteMachineTag = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteMachineTag(item.key).then(() => {
        // Updating endpoints list
        const { list } = this.state;
        this.setState({
          list: list.filter(el => el.key !== item.key)
        });
        this.props.update('machineTags', list.length - 1);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenDeleted.machineTag',
            defaultMessage: 'Machine tag has been deleted'
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

      this.props.createMachineTag(values).then(response => {
        form.resetFields();

        const list = this.state.list;
        list.unshift({
          ...values,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName
        });
        this.props.update('machineTags', list.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.machineTag',
            defaultMessage: 'Machine tag has been saved'
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
    const { intl, title } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.machineTag',
      defaultMessage: 'Are you sure delete this machine tag?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <span className="help">{title}</span>
              <h2><FormattedMessage id="machineTags" defaultMessage="Machine tags"/></h2>
            </Col>

            <Col span={4}>
              <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>
          <p className="help">
            <FormattedMessage
              id="orgMachineTagsInfo"
              defaultMessage="Machine tags are intended for applications to store information about an entity. A machine tag is essentially a name/value pair, that is categorised in a namespace. The 3 parts may be used as the application sees fit."
            />
          </p>

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
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteMachineTag(item)}/>
                </PermissionWrapper>
              ]}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={
                      <React.Fragment>
                        <strong className="item-title">{item.name}</strong> = <strong
                        className="item-title">{item.value}</strong>
                        <div className="item-type" style={{ marginLeft: 0 }}>{item.namespace}</div>
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
          {editVisible && <MachineTagCreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={editVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />}

          {detailsVisible && <MachineTagPresentation
            visible={detailsVisible}
            onCancel={this.handleCancel}
            data={selectedItem}
          />}
        </div>
      </React.Fragment>
    );
  }
}

MachineTagList.propTypes = {
  data: PropTypes.array.isRequired,
  createMachineTag: PropTypes.func.isRequired,
  deleteMachineTag: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, addSuccess }) => ({ user, addSuccess });

export default withContext(mapContextToProps)(injectIntl(MachineTagList));