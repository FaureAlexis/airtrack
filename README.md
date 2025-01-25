# AirTrack

A real-time flight tracking application that lets you monitor flights worldwide with detailed information and live tracking.

![AirTrack App](./documentation/image.png)

## Features

- Search flights by flight number
- Real-time flight tracking on map
- Detailed flight information
- Aircraft images and details
- Airport information with departure and arrival details
- Live data including altitude, speed, and heading

## Setup

1. Install dependencies
   ```bash
   yarn install
   ```

2. Create a `.env` file in the root directory with your RapidAPI key:
   ```
   RAPID_API_KEY=your_api_key_here
   ```

3. Start the app:
   ```bash
   yarn start
   ```

## API Setup

This app uses the FlightRadar24 API from RapidAPI. To get your API key:

1. Sign up at [RapidAPI](https://rapidapi.com)
2. Subscribe to the [FlightRadar24 API](https://rapidapi.com/apidojo/api/flight-radar1)
3. Copy your API key and add it to the `.env` file

## Development

AirTrack is built with modern technologies:
- Expo
- React Native
- React Native Maps for flight visualization
- React Query for data fetching
- Bottom Sheet for interactive UI
- TypeScript for type safety

## File Structure

- `/app` - Main application code
- `/services` - API services and data fetching
- `/assets` - Images and other static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
