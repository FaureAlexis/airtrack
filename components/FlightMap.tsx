import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FlightDetail } from '../services/flightService';
import { forwardRef } from 'react';

interface FlightMapProps {
  flightDetails: FlightDetail | undefined;
}

export const FlightMap = forwardRef<MapView, FlightMapProps>(({ flightDetails }, ref) => {
  return (
    <MapView
      key={flightDetails?.identification.id || 'default'}
      ref={ref}
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
  );
});

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
}); 