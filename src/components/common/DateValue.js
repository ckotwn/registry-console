import React from 'react';
import { FormattedDate } from 'react-intl';
import PropTypes from 'prop-types';

// Helpers
import { dateForSafari } from '../util/helpers';

const dateTimeFormat = {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short'
};

const DateValue = ({ value }) => {
  return (
    <FormattedDate value={dateForSafari(value)} {...dateTimeFormat}/>
  );
};

DateValue.propTypes = {
  value: PropTypes.string.isRequired
};

export default DateValue;