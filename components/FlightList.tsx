import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Flight } from '../services/flightService';

interface FlightListProps {
  flights: Flight[];
  selectedFlight: Flight | null;
  onFlightSelect: (flight: Flight) => void;
}

export const FlightList = ({ flights, selectedFlight, onFlightSelect }: FlightListProps) => {
  return (
    <>
      <Text style={styles.resultsTitle}>
        Found {flights.length} result{flights.length !== 1 ? 's' : ''}
      </Text>
      <ScrollView 
        style={styles.flightList}
        showsVerticalScrollIndicator={false}
      >
        {flights.map((flight) => {
          const isSelectable = flight.type === 'schedule' || flight.type === 'live';
          return (
            <TouchableOpacity
              key={flight.id}
              style={[
                styles.flightItem,
                selectedFlight?.id === flight.id && styles.selectedFlightItem,
                !isSelectable && styles.disabledFlightItem
              ]}
              onPress={() => onFlightSelect(flight)}
              disabled={!isSelectable}
            >
              <View style={styles.flightItemHeader}>
                <Text style={styles.flightLabel}>{flight.label}</Text>
                <View style={[
                  styles.flightTypeBadge,
                  !isSelectable && styles.disabledFlightTypeBadge
                ]}>
                  <Text style={styles.flightTypeBadgeText}>{flight.type}</Text>
                </View>
              </View>
              {flight.detail.flight && (
                <Text style={styles.flightDetail}>
                  Flight number: {flight.detail.flight}
                </Text>
              )}
              {flight.detail.operator && (
                <Text style={styles.flightDetail}>
                  Operator: {flight.detail.operator}
                </Text>
              )}
              {!isSelectable && (
                <Text style={styles.notTrackableText}>
                  This {flight.type} is not trackable
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
  flightItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  flightTypeBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    padding: 4,
    marginLeft: 8,
  },
  disabledFlightTypeBadge: {
    backgroundColor: '#666',
  },
  flightTypeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  notTrackableText: {
    color: '#666',
    marginTop: 4,
  },
}); 