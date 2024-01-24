import { MarketingAgency } from "./messages";
import { placeholderResults } from "./placeholders";

const defaultResultsMetadata = {
    totalResults: 0, 
    page: 1, 
    perPage: 50, 
    queryPostcode:'', 
    keywords:'', 
    remainingPages: 0
  };
  
  // ONLY IN DEV 
  // In prod companies info should be []
  const defaultLeadsData = {
    companiesInfo: placeholderResults,
    insights: {},
    resultsMessage: '',
  }
  
  const defaultSettings ={
    defaultMessage: MarketingAgency.email(),
    defaultSubject: MarketingAgency.subject,
    theme:"light"
  }

  export {defaultResultsMetadata, defaultLeadsData, defaultSettings};