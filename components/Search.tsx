import React, { useEffect, useRef } from 'react';
import {View, TextInput,TouchableOpacity,StyleSheet,BackHandler,} from 'react-native';
import { useSearchContext } from '../context/SearchContext';
import { Ionicons } from '@expo/vector-icons';
import { themes, sizes } from '../constants/layout';
import debounce from 'debounce';
import { SearchProps } from '../constants/types';


const Search = ({
  leads, 
  placeholder = 'Search...', 
  backgroundColor = themes.dark.containerBackground,
  borderRadius= sizes.layout.medium,
  paddingHorizontal= sizes.layout.medium,
  paddingVertical= sizes.layout.small,
  marginBottom= sizes.layout.medium,
  color = themes.dark.textColor,
}: SearchProps) => {
  const {query, setQuery, setSearchResults} = useSearchContext();
  const searchInputRef = useRef<TextInput>(null);
  const isSearching = query !== '';
  const customizableStyles = {backgroundColor, borderRadius,paddingHorizontal, paddingVertical, marginBottom};

  // Allow the back button to clear the search bar (optional)
  useEffect(() => {
    const backAction = () => {
      if (isSearching) {
        handleCancel();
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isSearching]);

  const handleQueryChange = (text: string) => {
    setQuery(text)
  }
  
  const handleSearch = () => {
    try {
      const filteredLeads = leads.filter(lead => lead.name.toLowerCase().includes(query.toLowerCase()));
      setSearchResults(filteredLeads);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  // Use debouncing to optimize search
  // This stops the handleSearch function being called for every keystroke
  const debouncedSearch = debounce(handleSearch, 500);

  const handleCancel = () => {
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
    setQuery('')
    setSearchResults([]);
  };

  useEffect(() => {
    if(leads.length > 0){
      debouncedSearch();
    }
  }, [query]);

  return (
    <View style={[styles.searchContainer, customizableStyles]}>
      <Ionicons name='search-outline' size={24} color={themes.placeholder} style={styles.icon}/>
      <TextInput
        ref={searchInputRef}
        style={[styles.searchInput, {color}]}
        placeholder={placeholder}
        placeholderTextColor={themes.placeholder}        
        value={query}
        onChangeText={(text) => handleQueryChange(text)}
      />
    {isSearching && (
      <TouchableOpacity onPress={handleCancel} style={styles.icon}>
        <Ionicons name='close-circle' size={24} color={themes.placeholder}/>
      </TouchableOpacity>
    )}
  </View>
  );
  }  

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    color: themes.dark.textColor,
    fontFamily:'monserrat-regular',
    height:40
  },

  icon: {
    marginHorizontal: sizes.layout.small,
  },
});

export {Search};