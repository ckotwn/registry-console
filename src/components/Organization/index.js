import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

// APIs
import {
  getOrganizationOverview,
  updateContact,
  deleteContact,
  createContact,
  createEndpoint,
  deleteEndpoint,
  createIdentifier,
  deleteIdentifier,
  createTag,
  deleteTag,
  createMachineTag,
  deleteMachineTag,
  createComment,
  deleteComment
} from '../../api/organization';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import { AuthRoute } from '../auth';
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';
// Components
import { ItemMenu, ItemHeader, CreationFeedback } from '../common';
import OrganizationDetails from './Details';
import { CommentList, ContactList, EndpointList, IdentifierList, MachineTagList, TagList } from '../common/subtypes';
import { PublishedDataset, HostedDataset, Installations } from './organizationSubtypes';
import Exception404 from '../exception/404';
import Actions from './organization.actions';
// Helpers
import { getSubMenu } from '../util/helpers';

class Organization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      organization: null,
      counts: {},
      status: 200,
      isNew: false
    };
  }

  componentDidMount() {
    this.checkRouterState();
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    if (this.props.match.params.key) {
      this.getData();
    } else {
      this.setState({
        data: null,
        loading: false
      });
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getData() {
    this.setState({ loading: true });

    getOrganizationOverview(this.props.match.params.key).then(data => {
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        this.setState({
          organization: data.organization,
          loading: false,
          counts: {
            contacts: data.organization.contacts.length,
            endpoints: data.organization.endpoints.length,
            identifiers: data.organization.identifiers.length,
            tags: data.organization.tags.length,
            machineTags: data.organization.machineTags.length,
            comments: data.organization.comments.length,
            publishedDataset: data.publishedDataset.count,
            installations: data.installations.count,
            hostedDataset: data.hostedDataset.count
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
        if (![404, 500, 523].includes(error.response.status)) {
          this.props.addError({ status: error.response.status, statusText: error.response.data });
        }
      }
    });
  }

  refresh = key => {
    if (key) {
      this.props.history.push(key, { isNew: true });
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

  update(error) {
    // If component was unmounted interrupting changes
    if (!this._isMount) {
      return;
    }

    if (error) {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
      return;
    }

    this.getData();
  }

  checkRouterState() {
    const { history } = this.props;
    // If we set router state previously, we'll update component's state and reset router's state
    if (history.location && history.location.state && history.location.state.isNew) {
      this.setState({ isNew: true });
      const state = { ...history.location.state };
      delete state.isNew;
      history.replace({ ...history.location, state });
    }
  }

  getTitle = () => {
    const { intl } = this.props;
    const { organization, loading } = this.state;

    if (organization) {
      return organization.title;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newOrganization', defaultMessage: 'New organization' });
    }

    return '';
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { organization, loading, counts, status, isNew } = this.state;
    const uuids = organization ? [organization.key, organization.endorsingNodeKey] : [];

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'organizations', defaultMessage: 'Organizations' });
    const submenu = getSubMenu(this.props);
    const pageTitle = organization || loading ?
      intl.formatMessage({ id: 'title.organization', defaultMessage: 'Organization | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newOrganization', defaultMessage: 'New organization | GBIF Registry' });
    const title = this.getTitle();

    return (
      <React.Fragment>
        <ItemHeader
          listType={[listName]}
          title={title}
          submenu={submenu}
          pageTitle={pageTitle}
          status={status}
          loading={loading}
          usePaperWidth
        >
          {organization && (
            <Actions uuids={uuids} organization={organization} onChange={error => this.update(error)}/>
          )}
        </ItemHeader>

        {isNew && !loading && (
          <CreationFeedback
            title={<FormattedMessage
              id="beenCreated.organization.title"
              defaultMessage="Organization has been created successfully!"
            />}
          />
        )}

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} uuids={uuids} isNew={organization === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <OrganizationDetails
                    uuids={uuids}
                    organization={organization}
                    refresh={key => this.refresh(key)}
                  />
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactList
                    contacts={organization.contacts}
                    uuids={uuids}
                    createContact={data => createContact(key, data)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={itemKey => deleteContact(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/endpoint`} render={() =>
                  <EndpointList
                    endpoints={organization.endpoints}
                    uuids={uuids}
                    createEndpoint={data => createEndpoint(key, data)}
                    deleteEndpoint={itemKey => deleteEndpoint(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    identifiers={organization.identifiers}
                    uuids={uuids}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    tags={organization.tags}
                    uuids={uuids}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    machineTags={organization.machineTags}
                    uuids={uuids}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <AuthRoute
                  path={`${match.path}/comment`}
                  component={() =>
                    <CommentList
                      comments={organization.comments}
                      uuids={uuids}
                      createComment={data => createComment(key, data)}
                      deleteComment={itemKey => deleteComment(key, itemKey)}
                      updateCounts={this.updateCounts}
                    />
                  }
                  uuids={uuids}
                />

                <Route path={`${match.path}/publishedDataset`} render={() =>
                  <PublishedDataset orgKey={match.params.key}/>
                }/>

                <Route path={`${match.path}/hostedDataset`} render={() =>
                  <HostedDataset orgKey={match.params.key}/>
                }/>

                <Route path={`${match.path}/installation`} render={() =>
                  <Installations orgKey={match.params.key}/>
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

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Organization)));