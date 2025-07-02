import 'package:flutter/material.dart';
import 'package:travel_app/app_data.dart';



// Global variable to store booked trip IDs
List<String> bookedTripIds = [];

class TripsDetailsScreen extends StatefulWidget {
  static const screenRoute = '/tripDetail';

  @override
  _TripsDetailsScreenState createState() => _TripsDetailsScreenState();
}

class _TripsDetailsScreenState extends State<TripsDetailsScreen> {
  late String tripId;
  bool _isBooked = false;
@override
void didChangeDependencies() {
  super.didChangeDependencies();
  tripId = ModalRoute.of(context)?.settings.arguments as String;
  _isBooked = bookedTripIdsGlobal.contains(tripId); 
}

  Widget sectionTitle(String textTitle) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 15),
      alignment: Alignment.topRight,
      child: Text(
        textTitle,
        style: const TextStyle(
          color: Colors.blue,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final selectedTrip = Trips_data.firstWhere((trip) => trip.id == tripId);

    return Scaffold(
      appBar: AppBar(
        title: Text(selectedTrip.title),
        
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.only(bottom: 80),
            child: Column(
              children: [
                Container(
                  height: 300,
                  width: double.infinity,
                  child: Image.network(
                    selectedTrip.imageUrl,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(height: 10),
                sectionTitle('Activities'),
                Container(
                  height: 200,
                  child: ListView.builder(
                    itemCount: selectedTrip.activities.length,
                    itemBuilder: (context, index) => Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      child: Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        elevation: 4,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 15),
                          child: Text(
                            selectedTrip.activities[index],
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                sectionTitle('Daily Program'),
                Container(
                  height: 200,
                  child: ListView.builder(
                    itemCount: selectedTrip.program.length,
                    itemBuilder: (context, index) => Card(
                      margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: Colors.blue[100],
                          child: Text('Day ${index + 1}'),
                        ),
                        title: Text(
                          selectedTrip.program[index],
                          style: TextStyle(fontSize: 16),
                        ),
                      ),
                    ),
                  ),
                ),
                if (_isBooked)
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Text(
                      'Trip booked successfully ✅',
                      style: TextStyle(
                        color: Colors.green,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
              ],
            ),
          ),
          Positioned(
            bottom: 20,
            left: 20,
            right: 20,
            child: ElevatedButton(
              onPressed: _isBooked
                  ? null
                  : () {
                      setState(() {
  _isBooked = true;
  bookedTripIds.add(tripId);
  bookedTripIdsGlobal.add(tripId); 
});

                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Trip booked successfully!'),
                          duration: Duration(seconds: 2),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: _isBooked ? Colors.grey : Colors.blue,
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(
                _isBooked ? 'Booked' : 'Book Now',
                style: TextStyle(
                  fontSize: 18,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}