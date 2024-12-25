import { StyleSheet, View, Text, Dimensions, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, ActivityIndicator, Image, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useSearchFlights, useFlightDetails, Flight } from '../services/flightService';

export default function Home() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
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
    console.log('flights', flights);
    if (flights && flights.length > 0) {
      const scheduledFlight = flights.find(f => f.type === 'schedule' || f.type === 'live');
      setSelectedFlight(scheduledFlight || flights[0]);
    }
  }, [flights]);

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

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setSearchTrigger(searchQuery.trim());
    Keyboard.dismiss();
  };

  const handleFlightSelect = (flight: Flight) => {
    if (flight.type === 'schedule' || flight.type === 'live') {
      setSelectedFlight(flight);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.container}>
          <MapView
            key={flightDetails?.identification.id || 'default'}
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: 48.8566,
              longitude: 2.3522,
              latitudeDelta: 15,
              longitudeDelta: 15,
            }}
          >
            {flightDetails?.trail && (
              <>
                <Polyline
                  coordinates={flightDetails.trail.map(point => ({
                    latitude: point.lat,
                    longitude: point.lng,
                  }))}
                  strokeColor="#007AFF"
                  strokeWidth={3}
                />
                <Marker
                  coordinate={{
                    latitude: flightDetails.trail[0].lat,
                    longitude: flightDetails.trail[0].lng,
                  }}
                  title={flightDetails.identification.number.default}
                  description={`Alt: ${flightDetails.trail[0].alt}ft, Speed: ${flightDetails.trail[0].spd}kts`}
                >
                  <View style={styles.planeMarker}>
                    <Text style={styles.planeMarkerText}>✈️</Text>
                  </View>
                </Marker>
              </>
            )}
            {flightDetails && (
              <>
                <Polyline
                  coordinates={[
                    {
                      latitude: flightDetails.airport.origin.position.latitude,
                      longitude: flightDetails.airport.origin.position.longitude,
                    },
                    {
                      latitude: flightDetails.airport.destination.position.latitude,
                      longitude: flightDetails.airport.destination.position.longitude,
                    },
                  ]}
                  strokeColor="#FF9500"
                  strokeWidth={2}
                />
                <Marker
                  coordinate={{
                    latitude: flightDetails.airport.origin.position.latitude,
                    longitude: flightDetails.airport.origin.position.longitude,
                  }}
                  title={flightDetails.airport.origin.name}
                  description={`${flightDetails.airport.origin.code.iata} - ${flightDetails.airport.origin.position.region.city}`}
                >
                  <View style={styles.airportMarker}>
                    <Text style={styles.airportMarkerText}>🛫</Text>
                  </View>
                </Marker>
                <Marker
                  coordinate={{
                    latitude: flightDetails.airport.destination.position.latitude,
                    longitude: flightDetails.airport.destination.position.longitude,
                  }}
                  title={flightDetails.airport.destination.name}
                  description={`${flightDetails.airport.destination.code.iata} - ${flightDetails.airport.destination.position.region.city}`}
                >
                  <View style={styles.airportMarker}>
                    <Text style={styles.airportMarkerText}>🛬</Text>
                  </View>
                </Marker>
              </>
            )}
          </MapView>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            index={0}
            backgroundStyle={styles.bottomSheetBackground}
            enablePanDownToClose={false}
            keyboardBehavior="extend"
          >
            <BottomSheetView style={styles.contentContainer}>
              <Text style={styles.title}>Flight Tracker</Text>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Enter flight number (e.g., AF123)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#999"
                  autoCapitalize="characters"
                  returnKeyType="search"
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  style={[styles.searchButton, isLoading && styles.searchButtonDisabled]} 
                  onPress={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.searchButtonText}>Search</Text>
                  )}
                </TouchableOpacity>
              </View>
              {error ? (
                <Text style={styles.errorText}>Failed to search flights. Please try again.</Text>
              ) : flights && flights.length > 0 ? (
                <ScrollView style={styles.flightList}>
                  {flights.map((flight) => (
                    <TouchableOpacity
                      key={flight.id}
                      style={[
                        styles.flightItem,
                        selectedFlight?.id === flight.id && styles.selectedFlightItem,
                        flight.type !== 'schedule' && flight.type !== 'live' && styles.disabledFlightItem
                      ]}
                      onPress={() => handleFlightSelect(flight)}
                      disabled={flight.type !== 'schedule' && flight.type !== 'live'}
                    >
                      <Text style={styles.flightLabel}>{flight.label}</Text>
                      <Text style={styles.flightType}>{flight.type}</Text>
                      {flight.detail.flight && (
                        <Text style={styles.flightDetail}>
                          Flight: {flight.detail.flight}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.subtitle}>No flights found</Text>
              )}
              {selectedFlight && (
                <View style={styles.flightInfo}>
                  {isLoadingDetails ? (
                    <ActivityIndicator style={styles.detailsLoader} />
                  ) : flightDetails ? (
                    <View style={styles.flightDetailsContainer}>
                      <Text style={styles.detailsTitle}>Flight Details</Text>
                      <Text style={styles.flightDetail}>
                        Flight: {flightDetails.identification.number.default}
                      </Text>
                      <Text style={styles.flightDetail}>
                        Status: {flightDetails.status.text} ({flightDetails.status.generic.status.text})
                      </Text>
                      <Text style={styles.flightDetail}>
                        Aircraft: {flightDetails.aircraft.model.text} ({flightDetails.aircraft.registration})
                      </Text>
                      {flightDetails.aircraft.images && (
                        <ScrollView 
                          horizontal 
                          style={styles.imageScroller}
                          showsHorizontalScrollIndicator={false}
                        >
                          {flightDetails.aircraft.images.thumbnails.map((image, index) => (
                            <View key={index} style={styles.imageContainer}>
                              <Image
                                source={{ uri: image.src }}
                                style={styles.aircraftImage}
                              />
                              <Text style={styles.imageCopyright}>© {image.copyright}</Text>
                            </View>
                          ))}
                        </ScrollView>
                      )}
                      <View style={styles.routeContainer}>
                        <Text style={styles.routeTitle}>Route</Text>
                        <View style={styles.airportContainer}>
                          <Text style={styles.airportTitle}>Departure</Text>
                          <Text style={styles.flightDetail}>
                            {flightDetails.airport.origin.name}
                          </Text>
                          <Text style={styles.flightDetail}>
                            {flightDetails.airport.origin.code.iata} - {flightDetails.airport.origin.position.region.city}
                          </Text>
                          <Text style={styles.flightDetail}>
                            {flightDetails.airport.origin.position.country.name}
                          </Text>
                          {flightDetails.time.scheduled.departure && (
                            <Text style={styles.flightDetail}>
                              Scheduled: {new Date(flightDetails.time.scheduled.departure * 1000).toLocaleTimeString()}
                            </Text>
                          )}
                        </View>
                        <View style={[styles.airportContainer, styles.destinationContainer]}>
                          <Text style={styles.airportTitle}>Arrival</Text>
                          <Text style={styles.flightDetail}>
                            {flightDetails.airport.destination.name}
                          </Text>
                          <Text style={styles.flightDetail}>
                            {flightDetails.airport.destination.code.iata} - {flightDetails.airport.destination.position.region.city}
                          </Text>
                          <Text style={styles.flightDetail}>
                            {flightDetails.airport.destination.position.country.name}
                          </Text>
                          {flightDetails.time.scheduled.arrival && (
                            <Text style={styles.flightDetail}>
                              Scheduled: {new Date(flightDetails.time.scheduled.arrival * 1000).toLocaleTimeString()}
                            </Text>
                          )}
                        </View>
                      </View>
                      {flightDetails.trail && flightDetails.trail[0] && (
                        <View style={styles.liveDataContainer}>
                          <Text style={styles.routeTitle}>Live Data</Text>
                          <Text style={styles.flightDetail}>
                            Altitude: {flightDetails.trail[0].alt}ft
                          </Text>
                          <Text style={styles.flightDetail}>
                            Speed: {flightDetails.trail[0].spd}kts
                          </Text>
                          <Text style={styles.flightDetail}>
                            Heading: {flightDetails.trail[0].hd}°
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : null}
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
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
  errorText: {
    color: '#FF3B30',
    marginTop: 8,
    fontSize: 14,
  },
  flightInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  flightLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  flightDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailsLoader: {
    marginTop: 16,
  },
  flightDetailsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  routeContainer: {
    marginTop: 12,
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  imageScroller: {
    marginTop: 12,
    marginBottom: 8,
  },
  imageContainer: {
    marginRight: 12,
  },
  aircraftImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  imageCopyright: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  liveDataContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#e8e8e8',
    borderRadius: 6,
  },
  flightList: {
    maxHeight: 200,
    marginTop: 16,
  },
  flightItem: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedFlightItem: {
    backgroundColor: '#e3effd',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  disabledFlightItem: {
    opacity: 0.5,
  },
  flightType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  planeMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  planeMarkerText: {
    fontSize: 20,
  },
  airportMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  airportMarkerText: {
    fontSize: 16,
  },
  airportContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  destinationContainer: {
    marginTop: 12,
  },
  airportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
}); 