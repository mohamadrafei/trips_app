import 'package:flutter/material.dart';
import 'package:travel_app/models/trip.dart';
import 'package:travel_app/screens/trips_details_screen.dart';

class TripsItem extends StatelessWidget {
  final String id;
  final String title;
  final String imageUrl;
  final TripType tripType;
  final int duration;
  final Season season;
  

  const TripsItem({
    super.key,
    required this.id,
    required this.title,
    required this.imageUrl,
    required this.duration,
    required this.season,
    required this.tripType,
  });

  void selectTrip(BuildContext context) {
    Navigator.of(context).pushNamed(
      TripsDetailsScreen.screenRoute,
      arguments: id,
    );
  }

  String get seasonText {
    switch (season) {
      case Season.Winter:
        return 'Winter';
      case Season.Summer:
        return 'Summer';
      case Season.Fall:
        return 'Fall';
      case Season.Spring:
        return 'Spring';
      default:
        return 'Unknown';
    }
  }

  String get tripTypeText {
    switch (tripType) {
      case TripType.activities:
        return 'Activities';
      case TripType.exploration:
        return 'Exploration';
      case TripType.recovery:
        return 'Recovery';
      case TripType.therapy:
        return 'Therapy';
      default:
        return 'Unknown';
    }
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => selectTrip(context),
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),),
        elevation: 7,
        margin: const EdgeInsets.all(10),
        child: Column(
          children: [
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(15),
                    topRight: Radius.circular(15)),
                  child: Image.network(
                    imageUrl,
                    height: 250,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
                Container(
                  height: 250,
                  alignment: Alignment.bottomRight,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 10),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.black.withOpacity(0),
                        Colors.black.withOpacity(0.8),
                      ],
                    ),
                  ),
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.today,
                        color: Colors.orange,
                      ),
                      const SizedBox(width: 6),
                      Text('$duration days'),
                    ],
                  ),
                  Row(
                    children: [
                      const Icon(
                        Icons.sunny,
                        color: Colors.orange,
                      ),
                      const SizedBox(width: 6),
                      Text(seasonText),
                    ],
                  ),
                  Row(
                    children: [
                      const Icon(
                        Icons.family_restroom,
                        color: Colors.orange,
                      ),
                      const SizedBox(width: 6),
                      Text(tripTypeText),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
    
  }
}