import React from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';
import ShowMoreText from 'react-show-more-text';

// Components
import { BooleanValue, PresentationItem, DateValue } from '../../widgets';
// Helpers
import { prettifyLicense } from '../../helpers';

const DatasetPresentation = ({ dataset }) => (
  <div>
    {dataset && (
      <dl>
        <PresentationItem label={<FormattedMessage id="title" defaultMessage="Title"/>} required>
          {dataset.title}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
          <FormattedMessage id={`datasetType.${dataset.type}`}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="subtype" defaultMessage="Subtype"/>}>
          {dataset.subtype}
        </PresentationItem>
        <PresentationItem
          label={<FormattedMessage id="external" defaultMessage="External?"/>}
          helpText={
            <FormattedMessage
              id="help.externalTip"
              defaultMessage="Indicates that the dataset is found through integration with metadata networks, and not registered directly with GBIF"
            />
          }
        >
          <BooleanValue value={dataset.external}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="license" defaultMessage="License"/>}>
          {prettifyLicense(dataset.license)}
        </PresentationItem>
        <PresentationItem
          label={<FormattedMessage id="lockAutoUpdates" defaultMessage="Lock auto updates"/>}
          helpText={
            <FormattedMessage
              id="help.lockedForAutoUpdateTip"
              defaultMessage="Controls permissions for crawlers updating metadata, contacts etc"
            />
          }
        >
          <BooleanValue value={dataset.lockedForAutoUpdate}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="doi" defaultMessage="Digital Object Identifier"/>}>
          {dataset.doi}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
          {dataset.description && (
            <ShowMoreText
              lines={5}
              more={<FormattedMessage id="button.showMore" defaultMessage="Show more"/>}
              less={<FormattedMessage id="button.showLess" defaultMessage="Show less"/>}
            >
              <div dangerouslySetInnerHTML={{__html: dataset.description}} />
            </ShowMoreText>
          )}
        </PresentationItem>
        <PresentationItem
          label={<FormattedMessage id="publishingOrganization" defaultMessage="Publishing organization"/>}
          helpText={
            <FormattedMessage
              id="help.publishingOrg"
              defaultMessage="It is expected that this may be changed occasionally, but be vigilant in changes as this has potential to spawn significant processing for occurrence records, metrics and maps"
            />
          }
          required
        >
          <NavLink to={`/organization/${dataset.publishingOrganizationKey}`}>
            {dataset.publishingOrganization.title}
          </NavLink>
        </PresentationItem>
        <PresentationItem
          label={<FormattedMessage id="installation" defaultMessage="Installation"/>}
          helpText={
            <FormattedMessage
              id="help.installation"
              defaultMessage="It is expected that this may be changed occasionally, but be vigilant in changes as this has potential to spawn significant processing for occurrence records, metrics. Please verify the services are as expected on change"
            />
          }
          required
        >
          <NavLink to={`/installation/${dataset.installationKey}`}>
            {dataset.installation.title}
          </NavLink>
        </PresentationItem>
        <PresentationItem
          label={<FormattedMessage id="parentDataset" defaultMessage="Parent dataset"/>}
          helpText={
            <FormattedMessage
              id="help.parentDataset"
              defaultMessage="For use in declaring dataset relationships, such as the constituent parts of the Catalogue of Life"
            />
          }
        >
          {dataset.parentDataset && (
            <NavLink to={`/dataset/${dataset.parentDatasetKey}`}>
              {dataset.parentDataset.title}
            </NavLink>
          )}
        </PresentationItem>
        <PresentationItem
          label={<FormattedMessage id="duplicateDataset" defaultMessage="Duplicate dataset"/>}
          helpText={
            <FormattedMessage
              id="help.duplicateDataset"
              defaultMessage="When a dataset is found to be a duplicate of another, then it should be updated. This will effectively trigger a de-index which is the same as a deletion. It may be that you ALSO need to set the parent dataset if this has been aggregated."
            />
          }
        >
          {dataset.duplicateDataset && (
            <NavLink to={`/dataset/${dataset.duplicateDatasetKey}`}>
              {dataset.duplicateDataset.title}
            </NavLink>
          )}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
          {dataset.homepage && (
            <a href={dataset.homepage} target="_blank" rel="noopener noreferrer">{dataset.homepage}</a>
          )}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="logoUrl" defaultMessage="Logo url"/>}>
          {dataset.logoUrl}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="language" defaultMessage="Language"/>}>
          {dataset.language && <FormattedMessage id={`language.${dataset.language}`}/>}
        </PresentationItem>
        <PresentationItem
          label={<FormattedMessage id="updateFrequency" defaultMessage="Update frequency"/>}
          helpText={
            <FormattedMessage
              id="help.updateFrequency"
              defaultMessage="The frequency with which changes and additions are made"
            />
          }
        >
          {dataset.maintenanceUpdateFrequency}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="alias" defaultMessage="Alias"/>}>
          {dataset.alias}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="abbreviation" defaultMessage="Abbreviation"/>}>
          {dataset.abbreviation}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="citation" defaultMessage="Citation"/>}>
          {dataset.citation.text}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="citationIdentifier" defaultMessage="Citation identifier"/>}>
          {dataset.citation.identifier}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="rights" defaultMessage="Rights"/>}>
          {dataset.rights}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="created" defaultMessage="Created"/>}>
          <FormattedRelative value={dataset.created}/>
          <DateValue value={dataset.created}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="createdBy" defaultMessage="Created by"/>}>
          {dataset.createdBy}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="modified" defaultMessage="Modified"/>}>
          <FormattedRelative value={dataset.modified}/>
          <DateValue value={dataset.modified}/>
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="modifiedBy" defaultMessage="Modified by"/>}>
          {dataset.modifiedBy}
        </PresentationItem>
      </dl>
    )}
  </div>
);

DatasetPresentation.propTypes = {
  dataset: PropTypes.object
};

export default DatasetPresentation;