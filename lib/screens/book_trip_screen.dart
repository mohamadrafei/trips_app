import 'package:flutter/material.dart';
import 'package:travel_app/app_data.dart';
import 'package:travel_app/screens/trips_details_screen.dart';


class BookedTripsScreen extends StatefulWidget {
  static const routeName = '/booked-trips';

  const BookedTripsScreen({super.key});

  @override
  State<BookedTripsScreen> createState() => _BookedTripsScreenState();
}

class _BookedTripsScreenState extends State<BookedTripsScreen> {
  // Make bookedTripIds mutable within this widget's state
  List<String> bookedTripIds = [];
void removeBookedTrip(String tripId) {
  bookedTripIdsGlobal.remove(tripId);
}

  @override
  void initState() {
    super.initState();
    bookedTripIds = List.from(bookedTripIdsGlobal);
  }

  @override
  Widget build(BuildContext context) {
    // Get only the trips that are booked
    final bookedTrips = Trips_data.where((trip) => bookedTripIds.contains(trip.id)).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Booked Trips'),
        centerTitle: true,
      ),
      body: bookedTrips.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.card_travel, size: 50, color: Colors.grey),
                  const SizedBox(height: 20),
                  Text(
                    'No trips booked yet',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: Colors.grey,
                        ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Book some trips to see them here',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(10),
              itemCount: bookedTrips.length,
              itemBuilder: (context, index) {
                final trip = bookedTrips[index];
                return Card(
                  elevation: 4,
                  margin: const EdgeInsets.symmetric(vertical: 8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap: () {
                      Navigator.pushNamed(
                        context,
                        TripsDetailsScreen.screenRoute,
                        arguments: trip.id,
                      );
                    },
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              trip.imageUrl,
                              width: 100,
                              height: 100,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  trip.title,
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    const Icon(Icons.calendar_today, size: 16),
                                    const SizedBox(width: 4),
                                    Text('${trip.duration} days'),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.star, size: 16, color: Colors.amber),
                                    const SizedBox(width: 4),
                                    Text(trip.tripType.toString().split('.').last),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete, color: Colors.red),
                            onPressed: () {
                              _showDeleteDialog(context, trip.id);
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
    );
  }

  void _showDeleteDialog(BuildContext context, String tripId) {
  showDialog(
    context: context,
    builder: (ctx) => AlertDialog(
      title: const Text('Cancel Booking'),
      content: const Text('Are you sure you want to cancel this trip?'),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(ctx),
          child: const Text('No'),
        ),
        TextButton(
          onPressed: () {
            // Properly update both states
            setState(() {
              bookedTripIds.remove(tripId);
            });
            removeBookedTrip(tripId); // Use the centralized function
            
            Navigator.pop(ctx);
            ScaffoldMessenger.of(ctx).showSnackBar(
              const SnackBar(
                content: Text('Booking cancelled'),
                duration: Duration(seconds: 2),
            ),);
            
            // Optional: Force rebuild if needed
            setState(() {});
          },
          child: const Text('Yes'),
        ),
      ],
    ),
  );
}
}