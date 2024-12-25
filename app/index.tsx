import { StyleSheet, View, Text, Dimensions, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useSearchFlights, useFlightDetails, Flight } from '../services/flightService';
import { FlightMap } from '../components/FlightMap';
import { FlightSearch } from '../components/FlightSearch';
import { FlightList } from '../components/FlightList';
import { FlightDetails } from '../components/FlightDetails';
import MapView from 'react-native-maps';

export default function Home() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const { data: flights, isLoading, error } = useSearchFlights(searchTrigger);
  const { data: flightDetails, isLoading: isLoadingDetails } = useFlightDetails(selectedFlight?.id ?? null);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        bottomSheetRef.current?.snapToIndex(1);
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        bottomSheetRef.current?.snapToIndex(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    if (flightDetails?.trail && flightDetails.trail.length > 0) {
      const lastPosition = flightDetails.trail[0];
      mapRef.current?.animateToRegion({
        latitude: lastPosition.lat,
        longitude: lastPosition.lng,
        latitudeDelta: 2,
        longitudeDelta: 2,
      });
    }
  }, [flightDetails]);

  const handleSearch = () => {
    setBottomSheetIndex(2);
    if (!searchQuery.trim()) return;
    setSearchTrigger(searchQuery.trim());
    setSelectedFlight(null);
    Keyboard.dismiss();
  };

  const handleFlightSelect = (flight: Flight) => {
    if (flight.type === 'schedule' || flight.type === 'live') {
      setSelectedFlight(flight);
      bottomSheetRef.current?.snapToIndex(0);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.container}>
          <FlightMap ref={mapRef} flightDetails={flightDetails} />
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            // onChange={handleSheetChanges}
            index={bottomSheetIndex}
            backgroundStyle={styles.bottomSheetBackground}
            enablePanDownToClose={false}
            keyboardBehavior="extend"
          >
            <BottomSheetView style={styles.contentContainer}>
              <Text style={styles.title}>AirTrack</Text>
              <FlightSearch
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
              {error ? (
                <Text style={styles.errorText}>Failed to search flights. Please try again.</Text>
              ) : flights && flights.length > 0 ? (
                <FlightList
                  flights={flights}
                  selectedFlight={selectedFlight}
                  onFlightSelect={handleFlightSelect}
                />
              ) : searchTrigger ? (
                <Text style={styles.subtitle}>No flights found</Text>
              ) : null}
              {selectedFlight && flightDetails && (
                <View style={styles.flightInfo}>
                  <FlightDetails
                    flightDetails={flightDetails}
                    isLoading={isLoadingDetails}
                  />
                </View>
              )}
            </BottomSheetView>
          </BottomSheet>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 8,
    fontSize: 14,
  },
  flightInfo: {
    marginTop: 16,
  },
}); 