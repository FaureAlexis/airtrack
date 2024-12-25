import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface FlightSearchProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const FlightSearch = ({ searchQuery, onSearchQueryChange, onSearch, isLoading }: FlightSearchProps) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Enter flight number (e.g., AF123)"
        value={searchQuery}
        onChangeText={onSearchQueryChange}
        placeholderTextColor="#999"
        autoCapitalize="characters"
        returnKeyType="search"
        editable={!isLoading}
      />
      <TouchableOpacity 
        style={[styles.searchButton, isLoading && styles.searchButtonDisabled]} 
        onPress={onSearch}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.searchButtonText}>Search</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    minWidth: 80,
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 