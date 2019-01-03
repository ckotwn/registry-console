import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Button, Popconfirm } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// APIs
import {
  getDatasetOverview,
  updateContact,
  deleteContact,
  createContact,
  createComment,
  createEndpoint,
  createIdentifier,
  createMachineTag,
  createTag,
  deleteComment,
  deleteEndpoint,
  deleteIdentifier,
  deleteMachineTag,
  deleteTag, crawlDataset
} from '../../api/dataset';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import PermissionWrapper from '../hoc/PermissionWrapper';
import PageWrapper from '../hoc/PageWrapper';
import withContext from '../hoc/withContext';
import AuthRoute from '../AuthRoute';
// Components
import { ItemMenu, ItemHeader } from '../widgets';
import Exception404 from '../exception/404';
import DatasetDetails from './Details';
import { ContactList, EndpointList, IdentifierList, TagList, MachineTagList, CommentList } from '../common';
import { ConstituentsDataset } from './datasetSubtypes';
// Helpers
import { getSubMenu } from '../helpers';

//load dataset and provide via props to children. load based on route key.
//provide children with way to update root.

class Dataset extends React.Component {
  state = {
    loading: true,
    data: null,
    uid: [],
    counts: {},
    status: 200
  };

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    if (this.props.match.params.key) {
      this.getData();
    } else {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getUIDs = data => {
    const uid = [];

    if (data) {
      uid.push(data.dataset.publishingOrganizationKey);
    }
    // Dataset can have one publishing but another hosting organization
    // In that case both of them should have permissions
    if (data.dataset.installation) {
      uid.push(data.dataset.installation.organizationKey);
    }

    return uid;
  };

  getData() {
    this.setState({ loading: true });

    getDatasetOverview(this.props.match.params.key).then(data => {
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        // Taken an array of UIDs to check user permissions
        const uid = this.getUIDs(data);

        this.setState({
          data,
          uid,
          loading: false,
          counts: {
            contacts: data.dataset.contacts.length,
            endpoints: data.dataset.endpoints.length,
            identifiers: data.dataset.identifiers.length,
            tags: data.dataset.tags.length,
            machineTags: data.dataset.machineTags.length,
            comments: data.dataset.comments.length,
            constituents: data.constituents.count
          }
        });
      }
    }).catch(error => {
      // Important for us due to the case of requests cancellation on unmount
      // Because in that case the request will be marked as cancelled=failed
      // and catch statement will try to update a state of unmounted component
      // which will throw an exception
      if (this._isMount) {
        this.setState({ status: error.response.status, loading: false });
        if (![404, 500].includes(error.response.status)) {
          this.props.addError({ status: error.response.status, statusText: error.response.data });
        }
      }
    });
  }

  refresh = key => {
    if (key) {
      this.props.history.push(key);
    } else {
      this.getData();
    }
  };

  updateCounts = (key, value) => {
    this.setState(state => {
      return {
        counts: {
          ...state.counts,
          [key]: value
        }
      };
    });
  };

  crawl = key => {
    crawlDataset(key)
      .then(() => {
        this.props.addInfo({
          status: 200,
          statusText: this.props.intl.formatMessage({ id: 'info.crawling', defaultMessage: 'Crawling in progress' })
        });
      })
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  };

  getTitle = () => {
    const { intl } = this.props;
    const { data, loading } = this.state;

    if (data) {
      return data.dataset.title;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newDataset', defaultMessage: 'New dataset' });
    }

    return '';
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { data, uid, loading, counts, status } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'datasets', defaultMessage: 'Datasets' });
    const submenu = getSubMenu(this.props);
    const pageTitle = data || loading ?
      intl.formatMessage({ id: 'title.dataset', defaultMessage: 'Dataset | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newDataset', defaultMessage: 'New dataset | GBIF Registry' });
    const title = this.getTitle();

    // Message to show to the user if he wants to crawl dataset
    const message = data && data.dataset.publishingOrganization.endorsementApproved ?
      intl.formatMessage({
        id: 'endorsed.crawl.message',
        defaultMessage: 'This will trigger a crawl of the dataset.'
      }) :
      intl.formatMessage({
        id: 'notEndorsed.crawl.message',
        defaultMessage: 'This dataset\'s publishing organization is not endorsed yet! This will trigger a crawl of the dataset, and should only be done in a 1_2_27 environment'
      });

    return (
      <React.Fragment>
        <ItemHeader
          listType={[listName]}
          title={title}
          submenu={submenu}
          pageTitle={pageTitle}
          status={status}
          loading={loading}
        >
          {data && !submenu && (
            <PermissionWrapper uid={uid} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
              <Popconfirm
                placement="topRight"
                title={message}
                onConfirm={() => this.crawl(data.dataset.key)}
                okText={<FormattedMessage id="crawl" defaultMessage="Crawl"/>}
                cancelText={<FormattedMessage id="no" defaultMessage="No"/>}
              >
                <Button type="primary" htmlType="button">
                  <FormattedMessage id="crawl" defaultMessage="Crawl"/>
                </Button>
              </Popconfirm>
            </PermissionWrapper>
          )}
        </ItemHeader>

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <DatasetDetails
                    dataset={data ? data.dataset : null}
                    uid={uid}
                    refresh={key => this.refresh(key)}
                  />
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactList
                    data={data.dataset.contacts}
                    uid={uid}
                    createContact={itemKey => createContact(key, itemKey)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={data => deleteContact(key, data)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    data={data.dataset.endpoints}
                    uid={uid}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    data={data.dataset.identifiers}
                    uid={uid}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    data={data.dataset.tags}
                    uid={uid}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    data={data.dataset.machineTags}
                    uid={uid}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    update={this.updateCounts}
                  />
                }/>

                <AuthRoute
                  path={`${match.path}/comment`}
                  component={() =>
                    <CommentList
                      data={data.dataset.comments}
                      uid={uid}
                      createComment={data => createComment(key, data)}
                      deleteComment={itemKey => deleteComment(key, itemKey)}
                      update={this.updateCounts}
                    />
                  }
                  roles={['REGISTRY_ADMIN']}
                />

                <Route path={`${match.path}/constituents`} render={() =>
                  <ConstituentsDataset datasetKey={key}/>
                }/>

                <Route component={Exception404}/>
              </Switch>
            </ItemMenu>
          )}
          />
        </PageWrapper>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError, addInfo }) => ({ addError, addInfo });

export default withContext(mapContextToProps)(withRouter(injectIntl(Dataset)));