import React from 'react';
import { Switch } from 'antd';
import { FormattedMessage } from 'react-intl';

import Presentation from './Presentation';
import Form from './Form';
import PermissionWrapper from '../../hoc/PermissionWrapper';

class CollectionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.collection === null
    };
  }

  render() {
    const { collection, refresh } = this.props;
    return (
      <React.Fragment>
        <div className="item-details">
          <h2><FormattedMessage id="details.collection" defaultMessage="Collection details"/></h2>

          <PermissionWrapper item={collection} roles={['REGISTRY_ADMIN']}>
            <div className="item-btn-panel">
              {collection && <Switch
                checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                onChange={(val) => this.setState({ edit: val })}
                checked={this.state.edit}
              />}
            </div>
          </PermissionWrapper>

          {!this.state.edit && <Presentation collection={collection}/>}
          {this.state.edit && (
            <Form collection={collection} onSubmit={key => {
              this.setState({ edit: false });
              refresh(key);
            }}/>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default CollectionDetails;