import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { FlightDetail } from '../services/flightService';

interface FlightDetailsProps {
  flightDetails: FlightDetail;
  isLoading: boolean;
}

export const FlightDetails = ({ flightDetails, isLoading }: FlightDetailsProps) => {
  if (isLoading) {
    return <ActivityIndicator style={styles.detailsLoader} />;
  }

  return (
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
  );
};

const styles = StyleSheet.create({
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
  flightDetail: {
    fontSize: 14,
    color: '#666',
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
  routeContainer: {
    marginTop: 12,
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
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
  liveDataContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#e8e8e8',
    borderRadius: 6,
  },
}); 