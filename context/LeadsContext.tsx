import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import { Leads, Lead, ResultsMetadata } from '../constants/types';

interface LeadsContextProps {
  myLeads: Leads;
  setMyLeads: Dispatch<SetStateAction<Leads>>;
  selectedLead: Lead | null;
  setSelectedLead: Dispatch<SetStateAction<Lead | null>>;
  resultsMetadata: ResultsMetadata;
  setResultsMetadata: Dispatch<SetStateAction<ResultsMetadata>>;
}

interface InitialConfig {
  fetchedLeads: Leads;
  fetchedMetadata: ResultsMetadata;
}

interface LeadsProviderProps {
  children: ReactNode;
  initialConfig: InitialConfig;
}

const LeadsContext = createContext<LeadsContextProps | undefined>(undefined);

const LeadsProvider = ({ children, initialConfig }: LeadsProviderProps) => {
  const { fetchedLeads, fetchedMetadata } = initialConfig;
  const [myLeads, setMyLeads] = useState<Leads>(fetchedLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [resultsMetadata, setResultsMetadata] = useState<ResultsMetadata>(fetchedMetadata);

  return (
    <LeadsContext.Provider
      value={{
        myLeads,
        setMyLeads,
        selectedLead,
        setSelectedLead,
        resultsMetadata,
        setResultsMetadata,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

const useLeadsContext = (): LeadsContextProps => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeadsContext must be used within a LeadsProvider');
  }
  return context;
};

export { LeadsContext, LeadsProvider, useLeadsContext };
