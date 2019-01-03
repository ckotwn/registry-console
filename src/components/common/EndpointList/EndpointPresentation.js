import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// Components
import { PresentationItem } from '../../widgets';

const styles = {
  modalPresentation: {
    marginBottom: 0,
    '& > div > div': {
      marginBottom: 0
    }
  }
};

const EndpointPresentation = ({ visible, onCancel, endpoint, classes }) => (
  <Modal
    visible={visible}
    title={<FormattedMessage id="endpointDetails" defaultMessage="Endpoint details"/>}
    destroyOnClose={true}
    closable={false}
    footer={[
      <Button htmlType="button" key="submit" onClick={onCancel}>
        <FormattedMessage id="close" defaultMessage="Close"/>
      </Button>
    ]}
    onCancel={onCancel}
  >
    <dl className={classes.modalPresentation}>
      <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>} required>
        {endpoint && endpoint.type}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="url" defaultMessage="URL"/>} required>
        {endpoint && endpoint.url}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
        {endpoint && endpoint.description}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="machineTags" defaultMessage="Machine tags"/>}>
        {
          endpoint && endpoint.machineTags.length > 0 ?
            endpoint.machineTags :
            <FormattedMessage id="noMachineTags" defaultMessage="No machine tags"/>
        }
      </PresentationItem>
    </dl>
  </Modal>
);

EndpointPresentation.propTypes = {
  visible: PropTypes.bool.isRequired,
  endpoint: PropTypes.object,
  onCancel: PropTypes.func.isRequired
};

export default injectSheet(styles)(EndpointPresentation);