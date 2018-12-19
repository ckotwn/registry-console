import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';
import injectSheet from 'react-jss';

import ContactDetails from './Details';
import { ConfirmDeleteControl } from '../../widgets';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

const styles = {
  type: {
    fontSize: '12px', color: 'grey', marginLeft: 10
  }
};

class ContactList extends React.Component {
  state = {
    visible: false,
    selectedContact: null,
    contacts: this.props.data.contacts,
    item: this.props.data
  };

  showModal = contact => {
    this.setState({
      selectedContact: contact,
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      selectedContact: null
    });
  };

  deleteContact = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteContact(item.key).then(() => {
        // Updating contacts list
        const { contacts } = this.state;
        this.setState({
          contacts: contacts.filter(contact => contact.key !== item.key)
        });
        this.props.update('contacts', contacts.length - 1);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenDeleted.contact',
            defaultMessage: 'Contact has been deleted'
          })
        });

        resolve();
      }).catch(reject);
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  };

  handleSave = form => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      let request;

      if (this.state.selectedContact) {
        request = this.props.updateContact({ ...this.state.selectedContact, ...values });
      } else {
        request = this.props.createContact(values);
      }

      request.then(response => {
        form.resetFields();

        const { contacts, selectedContact } = this.state;
        if (!selectedContact) {
          contacts.unshift({
            ...values,
            key: response.data,
            created: new Date(),
            createdBy: this.props.user.userName,
            modified: new Date(),
            modifiedBy: this.props.user.userName
          });
        } else {
          const index = contacts.findIndex(contact => contact.key === selectedContact.key);
          if (index !== -1) {
            contacts[index] = { ...selectedContact, ...values };
          }
        }

        this.props.update('contacts', contacts.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.contact',
            defaultMessage: 'Contact has been saved'
          })
        });

        this.setState({
          visible: false,
          selectedContact: null,
          contacts
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  render() {
    const { contacts, item, visible, selectedContact } = this.state;
    const { classes, intl } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.contact',
      defaultMessage: 'Are you sure delete this contact?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="contacts" defaultMessage="Contacts"/></h2>
            </Col>
            <Col span={4}>
              <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>

          <List
            itemLayout="horizontal"
            dataSource={contacts}
            renderItem={contact => (
              <List.Item actions={[
                <Button
                  htmlType="button"
                  onClick={() => this.showModal(contact)}
                  className="btn-link"
                  type="primary"
                  ghost={true}
                >
                  <FormattedMessage id="view" defaultMessage="View"/>
                </Button>,
                <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteContact(contact)}/>
                </PermissionWrapper>
              ]}>
                <Skeleton title={false} loading={contact.loading} active>
                  <List.Item.Meta
                    title={
                      <React.Fragment>
                        {contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.organization}
                        {contact.type ? <span className={classes.type}>
                          <FormattedMessage id={contact.type}/>
                      </span> : null}
                      </React.Fragment>
                    }
                    description={
                      <React.Fragment>
                        <FormattedMessage
                          id="createdByRow"
                          defaultMessage={`Created {date} by {author}`}
                          values={{ date: <FormattedRelative value={contact.created}/>, author: contact.createdBy }}
                        />
                      </React.Fragment>
                    }
                  />
                </Skeleton>
              </List.Item>
            )}
          />

          {visible && (
            <ContactDetails
              item={item}
              visible={visible}
              onCancel={this.handleCancel}
              data={selectedContact}
              onCreate={this.handleSave}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

ContactList.propTypes = {
  data: PropTypes.object.isRequired,
  createContact: PropTypes.func,
  updateContact: PropTypes.func,
  deleteContact: PropTypes.func,
  update: PropTypes.func
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectSheet(styles)(injectIntl(ContactList)));