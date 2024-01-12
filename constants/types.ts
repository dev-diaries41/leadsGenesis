import { TextStyle, DimensionValue, Falsy } from "react-native";

interface Email {
  entity: string;
  email: string;
}

interface Lead { 
  name: string; 
  emails: Email[]; 
  status?: string; 
  category: string;
  stars: number;
  numReviews: number;
  website: string;
  city: string;
  postcode: string;
  address: string;
  phone: string;
  plusCode: string;
  used: boolean;
  queryPostcode: string;
  notes?: string;
}

interface Leads {
  companiesInfo: Lead[];
  insights: object;
  resultsMessage: string;
}

interface ResultsMetadata {
  totalResults: number; 
  page: number; 
  perPage: number; 
  queryPostcode: string;  
  keywords: string; 
  remainingPages: number; 
};

interface ButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onPress: () => Promise<void> | void;
  text?: string;
  backgroundColor?: string;
  width?: DimensionValue;
  height?: DimensionValue;
  icon?: any;
  fontSize?: number;
  borderColor?: string;
  borderWidth?: number;
  color?: string;
}

interface GradientButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onPress: () => Promise<void> | void;
  text: string;
  gradientColor?: string[];
  width?: DimensionValue;
  height?: DimensionValue;
  icon?: any;
  fontSize?: number;
  borderColor?: string;
  borderWidth?: number;
  color?: string;
}

interface PickerProps { 
  selectedValue: string; 
  onValueChange: (selectedValue: string) => void; 
  options: string [];
  borderRadius?: number;
  borderColor?: string;
  dropdownIconRippleColor?: string;
  dropdownIconColor?: string;
  label?: string;
  textColor?: string;
}

interface DisplayModalProps { 
  visible: boolean; 
  onClose: () => void;
  description: string; 
  title: string;
  contentBackground: string;
  summaryBackground: string;
  textColor : string;
}

interface ButtonConfig {
  condition?: boolean;
  onPress: () => void | Promise<void>;
  icon: string;
  iconColor: string;
  width?: DimensionValue;
}

interface FindCompaniesModalProps { 
  visible: boolean; 
  onClose: () => void; 
  myLeads: Leads; 
  fetchLeads: () => Promise<void> | void;
  queryMessage: string;
  loading: boolean;
  textColor?: string;
  smallButtonsColor?: string;
  contentBackground?: string;
  summaryBackground?: string;
  buttonColor?: string;
}

interface FooterButtonsProps { 
  buttonsConfig: ButtonConfig[]; 
  buttonsColor: string;
  backgroundColor: string; 
 }

 interface IconButtonProps {
  onPress: (() => Promise<void> | void)
  color?: string;
  icon:any;
  size?: number;
}

interface InfoCardProps { 
  title: string;
  description: string;
  metadata: string;
  icon: any, 
  metadataIcon: any, 
  highlighterBackground: string;
  color?: string;
  iconColor?: string;
  backgroundColor?: string;
}

interface HeaderProps { 
  title: string; 
  icon: any;
  backgroundColor?: string;
  fontSize?: number;
  textAlign?: TextStyle["textAlign"];
  textDecorationLine: TextStyle["textDecorationLine"];
  iconSize?: number;
  iconColor: string;
  textColor: string;
}

interface HeaderButtonProps { 
  buttonText: string;
  title: string; 
  icon: any;
  backgroundColor?: string;
  fontSize?: number;
  textAlign?: TextStyle["textAlign"];
  textDecorationLine: TextStyle["textDecorationLine"];
  iconSize?: number;
  iconColor: string;
  textColor: string;
  onPress: () => void;
}


interface InputFieldProps { 
  value: string; 
  onChangeText: (text: string) => Promise<void> | void;
  error?: boolean | Falsy
  placeholder: string; 
  secureTextEntry?: boolean; 
  errorText?: string; 
  color: string; 
}

interface LeadCardProps {
  lead: Lead; 
  handleLeadPress: (lead: Lead) => Promise<void> | void;
}

interface SearchProps {
  leads: Lead [], 
  placeholder?: string;
  backgroundColor?: string;
  borderRadius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  marginBottom?: number;
  color?: string;
}

interface SettingsCardProps {
  onPress: () => Promise<void> | void; 
  dark: boolean, 
  settingDescription: string; 
  settingTitle: string; 
  isSwitch?: boolean;
  value?: boolean;
}

interface TextButtonProps { 
  onPress: () => Promise<void> | void; 
  buttonText: string; 
  fontSize?: number;
  color?: string; 
  margin?: number; 
  textAlign?: TextStyle['textAlign']; 
}


interface TextWithIconButtonProps {
onPress: () => Promise<void> | void; 
buttonText: string; 
fontSize?: number;
color?: string; 
margin?: number; 
icon: any;
iconSize?: number;
justifyContent?: 'flex-start' | 'flex-end' | 'center';
textAlign?: TextStyle['textAlign']; 
}

interface SearchContextProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: Lead [];
  setSearchResults: React.Dispatch<React.SetStateAction<Lead[] | []>>;
}


export {
  ButtonProps,
  GradientButtonProps,
  PickerProps,
  DisplayModalProps,
  FindCompaniesModalProps,
  FooterButtonsProps,
  IconButtonProps,
  InfoCardProps,
  InputFieldProps,
  LeadCardProps,
  Lead,
  Leads,
  ResultsMetadata,
  SearchProps,
  TextButtonProps,
  TextWithIconButtonProps,
  SearchContextProps,
  SettingsCardProps,
  HeaderProps,
  HeaderButtonProps,
}