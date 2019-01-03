import React from 'react';
import { FormattedMessage, FormattedDate, FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';

// Configuration
import { dateTimeFormat } from '../../../config/config';
// Components
import { BooleanValue, PresentationItem } from '../../widgets';

const InstitutionPresentation = ({ institution }) => (
  <div>
    {institution ? (
      <React.Fragment>
        <dl>
          <PresentationItem label={<FormattedMessage id="name" defaultMessage="Name"/>} required>
            {institution.name}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
            {institution.description}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="code" defaultMessage="Code"/>}>
            {institution.code}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
            {institution.type && <FormattedMessage id={`institutionType.${institution.type}`}/>}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="active" defaultMessage="Active"/>}>
            <BooleanValue value={institution.active}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            {institution.homepage && (
              <a href={institution.homepage} target="_blank" rel="noopener noreferrer">{institution.homepage}</a>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="catalogUrl" defaultMessage="Catalog URL"/>}>
            {institution.catalogUrl && (
              <a href={institution.catalogUrl} target="_blank" rel="noopener noreferrer">{institution.catalogUrl}</a>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="apiUrl" defaultMessage="API URL"/>}>
            {institution.apiUrl && (
              <a href={institution.apiUrl} target="_blank" rel="noopener noreferrer">{institution.apiUrl}</a>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="institutionalGovernance" defaultMessage="Institutional governance"/>}>
            {institution.institutionalGovernance && <FormattedMessage id={`institutionGovernance.${institution.institutionalGovernance}`}/>}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="disciplines" defaultMessage="Disciplines"/>}>
            {institution.disciplines.map(discipline =>
              <FormattedMessage key={discipline} id={`discipline.${discipline}`}/>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="latitude " defaultMessage="Latitude "/>}>
            {institution.latitude}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="longitude " defaultMessage="Longitude "/>}>
            {institution.longitude}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="additionalNames" defaultMessage="Additional names"/>}>
            {institution.additionalNames}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="foundingDate" defaultMessage="Founding date"/>}>
            {institution.foundingDate && <FormattedDate value={institution.foundingDate}/>}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="geographicDescription" defaultMessage="Geographic description"/>}>
            {institution.geographicDescription}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="taxonomicDescription" defaultMessage="Taxonomic description"/>}>
            {institution.taxonomicDescription}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="numberSpecimens" defaultMessage="Number specimens"/>}>
            {institution.numberSpecimens}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="indexHerbariorumRecord" defaultMessage="Herbariorum record"/>}>
            <BooleanValue value={institution.indexHerbariorumRecord}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="logoUrl" defaultMessage="Logo URL"/>}>
            {institution.logoUrl}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="citesPermitNumber" defaultMessage="Cites permit number"/>}>
            {institution.citesPermitNumber}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="mailingAddress" defaultMessage="Mailing address"/>}
            helpText={<FormattedMessage id="help.mailingAddress" defaultMessage="An address to send emails"/>}
          >
            <span/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
            {institution.mailingAddress && institution.mailingAddress.address}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
            {institution.mailingAddress && institution.mailingAddress.city}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
            {institution.mailingAddress && institution.mailingAddress.province}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            {institution.mailingAddress && institution.mailingAddress.country && (
              <FormattedMessage id={`country.${institution.mailingAddress.country}`}/>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
            {institution.mailingAddress && institution.mailingAddress.postalCode}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="physicalAddress" defaultMessage="Physical address"/>}
            helpText={<FormattedMessage id="help.physicalAddress" defaultMessage="An address of a building"/>}
          >
            <span/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="address" defaultMessage="Address"/>}>
            {institution.address && institution.address.address}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="city" defaultMessage="City"/>}>
            {institution.address && institution.address.city}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="province" defaultMessage="Province"/>}>
            {institution.address && institution.address.province}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="country" defaultMessage="Country"/>}>
            {institution.address && institution.address.country && (
              <FormattedMessage id={`country.${institution.address.country}`}/>
            )}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}>
            {institution.address && institution.address.postalCode}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
            <FormattedRelative value={institution.created}/>
            <FormattedDate value={institution.created} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
            {institution.createdBy}
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
            <FormattedRelative value={institution.modified}/>
            <FormattedDate value={institution.modified} {...dateTimeFormat}/>
          </PresentationItem>
          <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
            {institution.modifiedBy}
          </PresentationItem>
        </dl>
      </React.Fragment>
    ) : null}
  </div>
);

InstitutionPresentation.prototype = {
  institution: PropTypes.object.isRequired
};

export default InstitutionPresentation;