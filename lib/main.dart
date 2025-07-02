import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:travel_app/screens/book_trip_screen.dart';
import 'package:travel_app/screens/categories_screen.dart';
import 'package:travel_app/screens/category_trips_screen.dart';
import 'package:travel_app/screens/log_in_screen.dart';
import 'package:travel_app/screens/trips_details_screen.dart';


void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Travel App',
      debugShowCheckedModeBanner: false,
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', 'US'), // English
        // Arabic
      ],
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue,
          brightness: Brightness.light,
        ),
        fontFamily: 'Roboto', // Changed to more universal font
        textTheme: ThemeData.light().textTheme.copyWith(
              headlineLarge: const TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
              // Add more text styles as needed
            ),
        useMaterial3: true,
      ),
      initialRoute: '/login', 
      routes: {
        '/': (ctx) => const CategoriesScreen(),
        '/booked-trips': (context) => const BookedTripsScreen(),
                 

         '/login': (context) => const LoginScreen(),
        '/category-trips': (ctx) =>  CategoryTripsScreen(),
        TripsDetailsScreen.screenRoute: (ctx) =>  TripsDetailsScreen(),
      },
    );
  }
}