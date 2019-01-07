import React from 'react';
import { Col, Row, Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// Wrappers
import PermissionWrapper from '../../hoc/PermissionWrapper';
// Components
import Presentation from './Presentation';
import Form from './Form';

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto'
  }
};

class UserDetails extends React.Component {
  state = {
    edit: false
  };

  render() {
    const { user, refresh, classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.container}>
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <h2><FormattedMessage id="details.user" defaultMessage="User details"/></h2>
            </Col>
            <Col span={4} className="text-right">
              <PermissionWrapper uuids={[]} roles={['REGISTRY_ADMIN']}>
                <div className="item-btn-panel">
                  <Switch
                    checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                    onChange={(val) => this.setState({ edit: val })}
                    checked={this.state.edit}
                  />
                </div>
              </PermissionWrapper>
            </Col>
          </Row>

          {!this.state.edit && <Presentation user={user}/>}
          {this.state.edit && (
            <Form
              user={user}
              onSubmit={key => {
                this.setState({ edit: false });
                refresh(key);
              }}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

UserDetails.propTypes = {
  user: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired
};

export default injectSheet(styles)(UserDetails);