import React from 'react';
import { FormattedMessage } from 'react-intl';

import { PresentationItem, DateValue, PresentationGroupHeader, FormattedRelativeDate } from './index';

const MetaData = ({item}) => {
  return (
    <dl>
      <PresentationGroupHeader
        title={<FormattedMessage id="registryMeta" defaultMessage="Registry metadata"/>}
      />
      <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
        {item.created && <FormattedRelativeDate value={item.created}/>}
        {item.created && <DateValue value={item.created}/>}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
        {item.createdBy}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
        {item.modified && <FormattedRelativeDate value={item.modified}/>}
        {item.modified && <DateValue value={item.modified}/>}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
        {item.modifiedBy}
      </PresentationItem>
    </dl>
  );
};

export default MetaData;

