import React, { useState, useLayoutEffect } from 'react';
import { View, SafeAreaView, StyleSheet, Platform, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import * as FileSystem from 'expo-file-system';
import * as Papa from 'papaparse';
import * as Sharing from 'expo-sharing';
// import Animated, { Layout, SlideInLeft } from 'react-native-reanimated';
import { useLeadsContext } from '../../context/LeadsContext';
import { useSearchContext } from '../../context/SearchContext';
import { useSettingsContext } from '../../context/SettingsContext';
import { themes, sizes } from '../../constants/layout';
import {getLeads} from '../../utils/leadUtils/getLeads';
import { noLeadsMessage } from '../../constants/systemMessages';
import {EmptyScreen} from '../EmptyScreen';
import { LeadCard, Search, IconButton, createFlashMsg, TextWithIconButton, MenuModal } from '../../components';
import { Lead } from '../../constants/types';

//Constants
const {height} = Dimensions.get('screen');
const ITEM_HEIGHT = (height / 6) - (sizes.layout.medium);

const MAX_ITEMS = 500;

const LeadsScreen = ({navigation}: any) => {
  const { myLeads, setMyLeads,setSelectedLead, resultsMetadata, setResultsMetadata} = useLeadsContext();
  const {theme} = useSettingsContext();
  const { searchResults, query} = useSearchContext();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const {showMessage, FlashMessage} = createFlashMsg();
  const thresholdReached = myLeads?.companiesInfo?.length >= MAX_ITEMS;
  const isSearching = query !== '';
  const isDark = theme === 'dark';

  useLayoutEffect(()=>{
    navigation.setOptions({
      headerStyle: { backgroundColor: isDark? themes.dark.containerBackground : themes.light.containerBackground },
      headerTitleStyle: { color: isDark? themes.dark.textColor : themes.light.textColor},
      headerTintColor: isDark? themes.dark.textColor : themes.light.textColor,
    });
  }, [theme] )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.navRowButtons}>
         <IconButton icon={"download-outline"} onPress={handleDownloadLeads} color={isDark? themes.dark.icon:themes.light.icon}/>
         <IconButton icon={"share-social"} onPress={handleShareLeads} color={isDark? themes.dark.icon:themes.light.icon}/>
         <IconButton icon={"settings-outline"} onPress={() => navigation.navigate('Settings Screen')} color={isDark? themes.dark.icon:themes.light.icon}/>
        </View>
      ),
    });
  }, [navigation, theme]);

  const shareLeads = async (data: Lead[]) => {
    try {
      const csvData = Papa.unparse(data);
  
      // Create a file with the CSV data
      const csvFilename = `Leads_${Date.now()}.csv`; // Include the file extension
      const filePath = `${FileSystem.documentDirectory}${csvFilename}`;
      await FileSystem.writeAsStringAsync(filePath, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
  
      // Share the file
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/csv',
        dialogTitle: 'Export CSV',
        UTI: 'public.comma-separated-values-text',
      });
      showMessage('File shared successfully', true);

    } catch (error) {
      console.error('Error exporting to CSV:', error);
    }
  };
  
const handleDownloadLeads = async () => {
  await downloadLeads(myLeads?.companiesInfo);
}

const handleShareLeads = async () => {
   await shareLeads(myLeads?.companiesInfo);
}

const downloadLeads = async (data: Lead[]) => {
  // Convert array of objects to CSV using PapaParse
  const csv = Papa.unparse(data);

  // Save CSV file
  const csvFilename = `Leads_${Date.now()}}.csv`; // Include the file extension
  const csvMimeType = 'text/csv';

  // Create a temporary file URI
  const tempUri = `${FileSystem.cacheDirectory}${csvFilename}`;

  // Write CSV data to the temporary file
  await FileSystem.writeAsStringAsync(tempUri, csv);

  // Save the CSV file using the save function
  await save(tempUri, csvFilename, csvMimeType);

  // Return the URI of the saved CSV file
  return tempUri;
};

//Save a local expo file to device storage
const save = async (uri: string, filename: string, mimetype: string) => {
  if (Platform.OS === "android") {
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          showMessage('File downloaded successfully', true)
        })
        .catch(e => console.log(e));
    } 
  } else {
    Sharing.shareAsync(uri);
  }
};
  


  
  const handleLeadPress = (lead: Lead) => { 
    setLoading(true)
    setSelectedLead(lead);
    navigation.navigate('Lead Details', {
      screen: 'About Lead',
      params: { lead }, // Pass any necessary parameters
    });    
    setLoading(false)
  };

  const renderLead = ({ item }: any) => (
    
    <View
      // entering={SlideInLeft.springify().damping(15)}
      // layout={Layout.springify().damping(15)}

  > 
    <LeadCard
      lead={item}
      handleLeadPress={handleLeadPress}
    />
    </View>
  );

  const calcRemainingPages = (totalResults: number, page: number, perPage: number) =>
  Math.max(0, Math.ceil((totalResults - page * perPage) / perPage));

  const fetchMoreLeads = async (queryPostcode: string, keywords: string) => {
    try {
      //Stop loading results if remaining pages is 0
      if(resultsMetadata.remainingPages === 0 ){
        return;
      }

      const pageToRetrieve = resultsMetadata.page + 1;
      const { data, totalResults, page, perPage } = await getLeads(queryPostcode, keywords, pageToRetrieve);
      if (data && totalResults && page > resultsMetadata.page && perPage) {
        setResultsMetadata({ totalResults, page, perPage, queryPostcode, keywords, remainingPages: calcRemainingPages(totalResults, page, perPage)});
        const leads = [...myLeads.companiesInfo];
        const updatedLeadsData = {
          resultsMessage: data.resultsMessage,
          insights: data.insights,
          companiesInfo: thresholdReached
            ? [...leads.splice(0, 50), ...data.companiesInfo]
            : [...leads, ...data.companiesInfo],
        };
  
        setMyLeads(updatedLeadsData);
      }
    } catch (error) {
      console.error('Error fetching more leads:', error);
      showMessage('Error fetching leads', false);
    }
  };

  const handleLoadMore = () => {
    fetchMoreLeads(resultsMetadata.queryPostcode, resultsMetadata.keywords);
  }; 

  if(myLeads.companiesInfo.length === 0){
    return (
      <EmptyScreen 
        title={"No Companies"} 
        description={noLeadsMessage} 
        metadata={`${myLeads.companiesInfo.length} Stored Companies`} 
        icon={'briefcase-outline'}
        metadataIcon={'briefcase-outline'}
      />
    )
  }

  const handleSort = () => {
    setShowMenu(true)
  }

  return (
  <SafeAreaView style = {[styles.container, {backgroundColor: isDark? themes.dark.backgroundColor: themes.light.backgroundColor}]}>
    <Search 
      leads={myLeads.companiesInfo} 
      placeholder='Search leads...' 
      backgroundColor={isDark? themes.dark.containerBackground:themes.light.containerBackground}
      color={isDark? themes.dark.textColor:themes.light.textColor}
    />
     <TextWithIconButton icon={'filter'} buttonText={'Sort'} color={themes.secondaryIcon} onPress={handleSort}/>
     <View style={[styles.leadsContainer,  {backgroundColor: isDark? themes.dark.containerBackground: themes.light.containerBackground}]}>
      <FlashList
        data={isSearching && searchResults? searchResults : myLeads.companiesInfo}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={ITEM_HEIGHT}
        renderItem={renderLead}
        getItemLayout={(data: any, index: any) => (
          { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={true}
      />
      </View>
      <FlashMessage/>
      <MenuModal
        visible ={showMenu}
        onClose={() => setShowMenu(false)}
        contentBackground={isDark? themes.dark.secondaryBackgroundColor:themes.light.secondaryBackgroundColor}
        summaryBackground={isDark? themes.dark.backgroundColor:themes.light.backgroundColor}
        textColor={isDark? themes.dark.textColor:themes.light.textColor}     
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.dark.backgroundColor,
    padding: sizes.layout.small,
    paddingTop: sizes.layout.medium,
  },
  leadsContainer:{
    height: '85%',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
    borderTopRightRadius: sizes.layout.xLarge,
    borderTopLeftRadius: sizes.layout.xLarge,
    backgroundColor: themes.light.containerBackground,
    verticalAlign:'bottom',
    padding:sizes.layout.small,
    paddingTop:sizes.layout.large,


  },
  navRowButtons:{
    flexDirection: 'row', 
    justifyContent:"space-evenly",
    alignItems:'center',
    marginRight: sizes.layout.medium,
    gap:sizes.layout.medium
  },
  buttonContainer: {
    marginTop: sizes.layout.medium,
  }
});
export default LeadsScreen;
