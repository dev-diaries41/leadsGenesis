import { MarketingAgency } from "./outreachEmails";

const defaultResultsMetadata = {
    totalResults: 0, 
    page: 1, 
    perPage: 50, 
    queryPostcode:'', 
    keywords:'', 
    remainingPages: 0
  };
  
  const defaultLeadsData = {
    companiesInfo: [],
    insights: {},
    resultsMessage: '',
  }
  
  const defaultSettings ={
    defaultMessage: MarketingAgency.email(),
    defaultSubject: MarketingAgency.subject,
    theme:"dark"
  }

  export {defaultResultsMetadata, defaultLeadsData, defaultSettings};