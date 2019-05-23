import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Alert, Checkbox, Col, Input, Row, Select, Spin, Table } from 'antd';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';

import { ingestionSearch } from '../../../api/monitoring';
import Actions from './ingestion.actions';
import ItemHeader from '../../common/ItemHeader';
import Paper from '../../search/Paper';
import FormattedColoredNumber from './FormattedColoredNumber';
import RecordDetails from '../../common/RecordDetails';
import IngestionHistoryLink from '../../common/IngestionHistoryLink';
import LogsLink from './LogsLink';
import GBIFIconLink from './GBIFIconLink';
import TableTitle from '../../common/TableTitle';
import GBIFLink from '../../common/GBIFLink';
import { simplifyHttpUrls } from '../../util/helpers';

const { Column, ColumnGroup } = Table;
const styles = ({ direction }) => ({
  scrollContainer: {
    overflow: 'auto',
    width: '100%'
  },
  table: {
    '& table': {
      borderLeft: '0 !important'
    },
    '& table tr > th:first-child': {
      borderLeft: '1px solid #e8e8e8'
    },
    '& table tr > td:first-child': {
      borderLeft: '1px solid #e8e8e8'
    },
    '& table tr > td': {
      padding: '.3rem'
    },
    minWidth: '1846px',
    '& .small-cell': {
      paddingLeft: 0,
      paddingRight: 0
    },
    '& thead > tr:first-child': {
      display: 'none'
    },
    '& thead > tr:first-child > th': {
      position: 'relative',
      height: '195px',
      border: 'none',
      background: 'none'
    },
    '& thead > tr:first-child > th > div': {
      fontSize: '12px',
      whiteSpace: 'nowrap',
      transformOrigin: direction === 'rtl' ? 'bottom right' : 'bottom left',
      transform: direction === 'rtl' ? 'rotate(45deg)' : 'rotate(-45deg)',
      border: 'none',
      background: 'none',
      position: 'absolute',
      zIndex: 1,
      bottom: '5px',
      left: direction === 'rtl' ? 'auto' : '25px',
      right: direction === 'rtl' ? '25px' : 'auto'
    }
  },
  withHelp: {
    '& table': {
      borderTop: '0 !important'
    },
    '& thead > tr:first-child': {
      display: 'table-row'
    }
  },
  search: {
    marginBottom: '16px'
  },
  select: {
    marginBottom: '16px',
    width: '100%'
  },
  checkboxes: {
    display: 'flex',
    marginBottom: '16px',
    justifyContent: direction === 'rtl' ? 'flex-start' : 'flex-end'
  },
  warning: {
    textAlign: 'center',
    marginTop: '16px'
  },
  count: {
    color: 'grey',
    display: 'inline-block',
    paddingLeft: '3px'
  }
});

class RunningIngestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      selectedItems: [],
      error: null,
      q: {
        search: '',
        select: 10, // default value
        live: false,
        help: false,
        selected: false
      },
      selectedRowKeys: []
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;

    this.getData();
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getData() {
    ingestionSearch().then(response => {
      if (this._isMount) {
        this.setState(() => {
          return {
            loading: false,
            data: response
          };
        }, this.filterSelectedItems);
        this.updateLiveProcess();
      }
    }).catch(error => {
      if (this._isMount) {
        this.setState({ error });
      }
    });
  }

  onSearch = event => {
    // https://reactjs.org/docs/events.html#event-pooling
    event.persist();
    this.setState(state => {
      return {
        q: {
          ...state.q,
          search: event.target.value
        }
      };
    }, this.filterSelectedItems);
  };

  onSelect = value => {
    this.setState(state => {
      return {
        q: {
          ...state.q,
          select: value
        }
      };
    }, this.filterSelectedItems);
  };

  onChange = event => {
    this.setState(state => {
      return {
        q: {
          ...state.q,
          [event.target.name]: event.target.checked
        }
      };
    }, () => {
      switch (event.target.name) {
        case 'live':
          this.updateLiveProcess();
          break;
        case 'help':
          break;
        case 'selected':
          this.filterSelectedItems();
          break;
        default:
          break;
      }
    });
  };

  updateLiveProcess = () => {
    if (!this.state.q.live && this.timeoutId) {
      clearTimeout(this.timeoutId);
    } else if (this.state.q.live && this._isMount) {
      this.timeoutId = setTimeout(() => this.getData(), 2000);
    }
  };

  // Setting selected row IDs to filter through this list
  onRowSelect = (e, key) => {
    const { selectedRowKeys } = this.state;
    if (e.target.checked) {
      this.setState({
        selectedRowKeys: selectedRowKeys.concat(key)
      });
    } else {
      this.setState({
        selectedRowKeys: selectedRowKeys.filter(rowKey => rowKey !== key)
      });
    }
  };

  // Filtering original list using all parameters set by user manually
  filterSelectedItems = () => {
    const { selectedRowKeys, data, q: { selected, select, search } } = this.state;
    let selectedItems = [];

    if (selected) {
      // If user wants to see only selected by them items
      // - filter by selected keys
      // - filter by value in the search field
      // - slice only selected number
      selectedItems = data
        .filter(item => selectedRowKeys.includes(item.datasetKey))
        .filter(item => item.dataset.title.toLowerCase().includes(search.toLowerCase()))
        .slice(0, select);
    } else {
      // If user wants to see all items
      // - filter by value in the search field
      // - slice only selected number
      selectedItems = data
        .filter(item => item.dataset.title.toLowerCase().includes(search.toLowerCase()))
        .slice(0, select);
    }

    this.setState({ selectedItems });
  };

  getTableClasses = classes => {
    const { q: { help } } = this.state;
    if (help) {
      return [classes.table, classes.withHelp].join(' ');
    }

    return classes.table;
  };

  getHeader = () => {
    const { loading, data } = this.state;

    return (
      loading ?
        <Spin size="small"/> :
        <FormattedMessage
          id="nResultsInTotal"
          defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}} in total`}
          values={{ formattedNumber: <FormattedNumber value={data.length}/>, count: data.length }}
        />
    );
  };

  render() {
    const { selectedItems, loading, error } = this.state;
    const { classes, intl } = this.props;
    // Parameters for ItemHeader with BreadCrumbs and page title
    const category = intl.formatMessage({ id: 'monitoring', defaultMessage: 'Monitoring' });
    const listName = intl.formatMessage({ id: 'ingestion', defaultMessage: 'Running ingestions' });
    const pageTitle = intl.formatMessage({
      id: 'title.ingestion',
      defaultMessage: 'Running ingestions | GBIF Registry'
    });
    const translatedSearch = intl.formatMessage({ id: 'searchTable', defaultMessage: 'Search table' });

    return (
      <React.Fragment>
        <ItemHeader
          listType={[category]}
          pageTitle={pageTitle}
          title={listName}
        >
          <Actions/>
        </ItemHeader>
        {!error && (
          <Paper padded>
            <Row gutter={8}>
              <Col xs={24} sm={24} md={9}>
                <Input.Search
                  type="text"
                  placeholder={translatedSearch}
                  style={{ marginBottom: '16px' }}
                  onInput={this.onSearch}
                  className={classes.search}
                />
              </Col>

              <Col xs={24} sm={24} md={3}>
                <Select defaultValue={10} className={classes.select} onChange={this.onSelect}>
                  <Select.Option value={10}>10</Select.Option>
                  <Select.Option value={25}>25</Select.Option>
                  <Select.Option value={50}>50</Select.Option>
                  <Select.Option value={100000}>
                    <FormattedMessage id="all" defaultMessage="All"/>
                  </Select.Option>
                </Select>
              </Col>

              <Col xs={24} sm={24} md={12} className={classes.checkboxes}>
                <Checkbox onChange={this.onChange} name="live">
                  <FormattedMessage id="ingestion.checkbox.liveView" defaultMessage="Live view"/>
                </Checkbox>
                <Checkbox onChange={this.onChange} name="help">
                  <FormattedMessage id="ingestion.checkbox.showHelp" defaultMessage="Show help"/>
                </Checkbox>
                <Checkbox onChange={this.onChange} name="selected">
                  <FormattedMessage id="ingestion.checkbox.onlySelected" defaultMessage="Only show selected"/>
                </Checkbox>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className={classes.scrollContainer}>
                  <Table
                    bordered
                    title={this.getHeader}
                    dataSource={selectedItems}
                    rowKey={record => record.datasetKey}
                    loading={loading}
                    pagination={false}
                    className={this.getTableClasses(classes)}
                  >
                    <ColumnGroup
                      title={<FormattedMessage id="showOnlySelected" defaultMessage="Only show selected items"/>}>
                      <Column
                        key="checkbox"
                        render={crawl => <Checkbox onChange={event => this.onRowSelect(event, crawl.datasetKey)}/>}
                      />
                    </ColumnGroup>
                    <ColumnGroup title={<FormattedMessage id="url" defaultMessage="URL"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="url" defaultMessage="URL"/>}
                          text={<FormattedMessage id="url" defaultMessage="URL"/>}
                        />}
                        key="dataset"
                        width="400px"
                        render={crawl => <React.Fragment>
                          <div>{simplifyHttpUrls(crawl.crawlJob.targetUrl)}</div>
                          <GBIFLink uuid={crawl.dataset.key} link="dataset">{crawl.dataset.title}</GBIFLink>
                          <div className={classes.count}>
                            <FormattedMessage
                              id="crawl.dataset.count"
                              defaultMessage="({formattedNumber} occ)"
                              values={{ formattedNumber: <FormattedNumber value={crawl.dataset.count}/> }}
                            />
                          </div>
                        </React.Fragment>}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="startedCrawling.full" defaultMessage="Start time"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="startedCrawling.full" defaultMessage="Start time"/>}
                          text={<FormattedMessage id="startedCrawling.short" defaultMessage="ST"/>}
                        />}
                        dataIndex="startedCrawling"
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="declaredCount.full" defaultMessage="Declared count"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="declaredCount.full" defaultMessage="Declared count"/>}
                          text={<FormattedMessage id="declaredCount.short" defaultMessage="DC"/>}
                        />}
                        key="declaredCount"
                        render={crawl => <FormattedColoredNumber
                          value={crawl.declaredCount}
                          green={crawl.declaredCount === crawl.rawOccurrencesPersistedNew + crawl.rawOccurrencesPersistedUpdated + crawl.rawOccurrencesPersistedUnchanged}
                        />}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="pagesCrawled.full" defaultMessage="Pages crawled"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="pagesCrawled.full" defaultMessage="Pages crawled"/>}
                          text={<FormattedMessage id="pagesCrawled.short" defaultMessage="PC"/>}
                        />}
                        dataIndex="pagesCrawled"
                        render={text => <FormattedColoredNumber value={text}/>}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="pagesFragmentedSuccessful.full"
                                                          defaultMessage="Pages fragmented successfully"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="pagesFragmentedSuccessful.full"
                                                   defaultMessage="Pages fragmented successfully"/>}
                          text={<FormattedMessage id="pagesFragmentedSuccessful.short" defaultMessage="PFS"/>}
                        />}
                        key="pagesFragmentedSuccessful"
                        render={crawl => <FormattedColoredNumber
                          value={crawl.pagesFragmentedSuccessful}
                          green={crawl.pagesCrawled === crawl.pagesFragmentedSuccessful}
                        />}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="pagesFragmentedError.full"
                                                          defaultMessage="Pages not fragmented (error)"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="pagesFragmentedError.full"
                                                   defaultMessage="Pages not fragmented (error)"/>}
                          text={<FormattedMessage id="pagesFragmentedError.short" defaultMessage="PFE"/>}
                        />}
                        key="pagesFragmentedError"
                        render={crawl => <FormattedColoredNumber
                          value={crawl.pagesFragmentedError}
                          green={crawl.pagesFragmentedError > 0}
                        />}
                      />
                    </ColumnGroup>

                    <ColumnGroup
                      title={<FormattedMessage id="fragmentsEmitted.full" defaultMessage="Fragments emitted"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="fragmentsEmitted.full" defaultMessage="Fragments emitted"/>}
                          text={<FormattedMessage id="fragmentsEmitted.short" defaultMessage="FE"/>}
                        />}
                        dataIndex="fragmentsEmitted"
                        render={text => <FormattedColoredNumber value={text}/>}
                        defaultSortOrder="descend"
                        sorter={(a, b) => a.fragmentsEmitted - b.fragmentsEmitted}
                      />
                    </ColumnGroup>

                    <ColumnGroup
                      title={<FormattedMessage id="fragmentsReceived.full" defaultMessage="Fragments received"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="fragmentsReceived.full" defaultMessage="Fragments received"/>}
                          text={<FormattedMessage id="fragmentsReceived.short" defaultMessage="FR"/>}
                        />}
                        key="fragmentsReceived"
                        render={crawl => <FormattedColoredNumber
                          value={crawl.fragmentsReceived}
                          green={crawl.fragmentsEmitted === crawl.fragmentsReceived}
                        />}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="rawOccurrencesPersistedNew.full"
                                                          defaultMessage="Raw occurrences persisted (new)"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="rawOccurrencesPersistedNew.full"
                                                   defaultMessage="Raw occurrences persisted (new)"/>}
                          text={<FormattedMessage id="rawOccurrencesPersistedNew.short" defaultMessage="RON"/>}
                        />}
                        dataIndex="rawOccurrencesPersistedNew"
                        render={text => <FormattedColoredNumber value={text}/>}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="rawOccurrencesPersistedUpdated.full"
                                                          defaultMessage="Raw occurrences persisted (modified)"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="rawOccurrencesPersistedUpdated.full"
                                                   defaultMessage="Raw occurrences persisted (modified)"/>}
                          text={<FormattedMessage id="rawOccurrencesPersistedUpdated.short" defaultMessage="ROM"/>}
                        />}
                        dataIndex="rawOccurrencesPersistedUpdated"
                        render={text => <FormattedColoredNumber value={text}/>}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="rawOccurrencesPersistedUnchanged.full"
                                                          defaultMessage="Raw occurrences persisted (unchanged)"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="rawOccurrencesPersistedUnchanged.full"
                                                   defaultMessage="Raw occurrences persisted (unchanged)"/>}
                          text={<FormattedMessage id="rawOccurrencesPersistedUnchanged.short" defaultMessage="ROU"/>}
                        />}
                        dataIndex="rawOccurrencesPersistedUnchanged"
                        render={text => <FormattedColoredNumber value={text}/>}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="rawOccurrencesPersistedError.full"
                                                          defaultMessage="Raw occurrences persisted (error)"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="rawOccurrencesPersistedUnchanged.full"
                                                   defaultMessage="Raw occurrences persisted (unchanged)"/>}
                          text={<FormattedMessage id="rawOccurrencesPersistedUnchanged.short" defaultMessage="ROU"/>}
                        />}
                        key="rawOccurrencesPersistedError"
                        render={crawl => <FormattedColoredNumber
                          value={crawl.rawOccurrencesPersistedError}
                          green={crawl.rawOccurrencesPersistedError > 0}
                        />}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="verbatimOccurrencesPersistedSuccessful.full"
                                                          defaultMessage="Verbatim occurrences persisted successfully"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="verbatimOccurrencesPersistedSuccessful.full"
                                                   defaultMessage="Verbatim occurrences persisted successfully"/>}
                          text={<FormattedMessage id="verbatimOccurrencesPersistedSuccessful.short"
                                                  defaultMessage="VOP"/>}
                        />}
                        dataIndex="verbatimOccurrencesPersistedSuccessful"
                        render={text => <FormattedColoredNumber value={text}/>}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="verbatimOccurrencesPersistedError.full"
                                                          defaultMessage="Verbatim occurrences persisted (error)"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="verbatimOccurrencesPersistedError.full"
                                                   defaultMessage="Verbatim occurrences persisted (error)"/>}
                          text={<FormattedMessage id="verbatimOccurrencesPersistedError.short" defaultMessage="VOE"/>}
                        />}
                        key="verbatimOccurrencesPersistedError"
                        render={crawl => <FormattedColoredNumber
                          value={crawl.verbatimOccurrencesPersistedError}
                          green={crawl.verbatimOccurrencesPersistedError > 0}
                        />}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="interpretedOccurrencesPersistedSuccessful.full"
                                                          defaultMessage="Interpreted occurrences persisted successfully"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="interpretedOccurrencesPersistedSuccessful.full"
                                                   defaultMessage="Interpreted occurrences persisted successfully"/>}
                          text={<FormattedMessage id="interpretedOccurrencesPersistedSuccessful.short"
                                                  defaultMessage="OI"/>}
                        />}
                        key="interpretedOccurrencesPersistedSuccessful"
                        render={crawl => <FormattedColoredNumber
                          value={crawl.interpretedOccurrencesPersistedSuccessful}
                          green={crawl.verbatimOccurrencesPersistedSuccessful === crawl.interpretedOccurrencesPersistedSuccessful}
                        />}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="interpretedOccurrencesPersistedError.full"
                                                          defaultMessage="Interpreted occurrences persisted (error)"/>}>
                      <Column
                        title={<TableTitle
                          title={<FormattedMessage id="interpretedOccurrencesPersistedError.full"
                                                   defaultMessage="Interpreted occurrences persisted (error)"/>}
                          text={<FormattedMessage id="interpretedOccurrencesPersistedError.short" defaultMessage="OE"/>}
                        />}
                        key="interpretedOccurrencesPersistedError"
                        render={crawl => <FormattedColoredNumber
                          value={crawl.interpretedOccurrencesPersistedError}
                          green={crawl.interpretedOccurrencesPersistedError > 0}
                        />}
                      />
                    </ColumnGroup>

                    <ColumnGroup title={<FormattedMessage id="misc" defaultMessage="Misc"/>}>
                      <Column
                        key="logs"
                        width="30px"
                        className="small-cell"
                        align="center"
                        render={crawl => <LogsLink uuid={crawl.datasetKey}/>}
                      />
                      <Column
                        key="link"
                        width="30px"
                        className="small-cell"
                        align="center"
                        render={crawl => <GBIFIconLink uuid={crawl.datasetKey} link="dataset"/>}
                      />
                      <Column
                        key="history"
                        width="30px"
                        className="small-cell"
                        align="center"
                        render={crawl => <IngestionHistoryLink uuid={crawl.datasetKey}/>}
                      />
                      <Column
                        key="details"
                        width="30px"
                        className="small-cell"
                        align="center"
                        render={crawl => <RecordDetails crawl={crawl}/>}
                      />
                    </ColumnGroup>
                  </Table>
                </div>

                {!error && <Alert
                  className={classes.warning}
                  description={<FormattedMessage
                    id="warning.ingestionFilters"
                    defaultMessage="If you have filters enabled you might not see anything"
                  />}
                  type="warning"
                />}
              </Col>
            </Row>
          </Paper>
        )}
        {error && <Alert
          message={<FormattedMessage id="error.title" defaultMessage="Error"/>}
          description={<FormattedMessage
            id="error.description"
            defaultMessage="An error happened while trying to process your request. Please report the error at https://github.com/gbif/portal-feedback/issues/new"
          />}
          type="error"
          showIcon
        />}
      </React.Fragment>
    );
  }
}

export default injectIntl(injectSheet(styles)(RunningIngestion));