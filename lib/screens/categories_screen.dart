import 'package:flutter/material.dart';

import 'package:travel_app/app_data.dart';
import 'package:travel_app/models/categorie.dart';
import 'package:travel_app/screens/book_trip_screen.dart';
import 'package:travel_app/widgets/categorie_item.dart';


class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({super.key});

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<Categorie> _filteredCategories = Categories_data;

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_filterCategories);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _filterCategories() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredCategories = Categories_data.where((category) {
        return category.title.toLowerCase().contains(query);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Travel App'),
         actions: [
    IconButton(
      icon: const Icon(Icons.bookmark),  
      onPressed: () {
        Navigator.pushNamed(
          context,
          BookedTripsScreen.routeName,  
        );
      },
    ),
  ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search for travel categories...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
                filled: true,
                fillColor: Colors.grey[200],
                contentPadding: const EdgeInsets.symmetric(
                  vertical: 10.0,
                  horizontal: 15.0,
                ),
              ),
            ),
          ),
          Expanded(
            child: GridView(
              padding: const EdgeInsets.all(10),
              gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                maxCrossAxisExtent: 200,
                childAspectRatio: 7 / 8,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              children: _filteredCategories.map(
                (categorie) => CategorieItem(
                  categorie.id,
                  categorie.title,
                  categorie.ImageUrl,
                ),
              ).toList(),
            ),
          ),
        ],
      ),
    );
  }
}