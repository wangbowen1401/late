const request = require('request-promise');
const logger = require('./logger');

const YACS_SECTION_API_BASE_URL =
  'https://nightly.yacs.io/api/v6/sections?filter[crn][eql]=';

async function getSectionInfoFromCRN(crn) {
  const uri = YACS_SECTION_API_BASE_URL + crn;

  logger.info(`Getting info for course ${crn} from YACS API.`);

  let data = (await request({ uri, json: true })).data;

  if (data.length == 0) {
    logger.info(`Could not find course ${crn} on YACS API. Skipping.`);
    return false;
  }
  data = data[0];

  // get listing
  let listing_uri = data.relationships.listing.links.related;
  if (!listing_uri.startsWith('https://'))
    listing_uri = 'https://' + listing_uri;

  const listing = (await request({ uri: listing_uri, json: true })).data;

  const section = {
    section_id: data.attributes.shortname,
    listing_id: listing.id,
    longname: listing.attributes.longname,
    crn,
    periods: data.attributes.periods
  };

  logger.info(
    `Course ${crn} is ${section.longname} section ${section.section_id}`
  );

  return section;
}

module.exports = { getSectionInfoFromCRN };
