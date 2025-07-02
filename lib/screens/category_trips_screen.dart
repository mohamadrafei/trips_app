import 'package:flutter/material.dart';
import 'package:travel_app/app_data.dart';

import 'package:travel_app/widgets/trips_item.dart';


class CategoryTripsScreen extends StatelessWidget {
 

  @override
  Widget build(BuildContext context) {
    final routeArgument=ModalRoute.of(context)?.settings.arguments as Map<String,String>;
    final categoryId=routeArgument['id'];
    final  categoryTitle=routeArgument['title'];
    
    final filtertrips=Trips_data.where((Trip) {return Trip.categories.contains(categoryId);}).toList();
    return Scaffold(
appBar: AppBar(
  title:  Text(categoryTitle!),
),
body: ListView.builder(itemBuilder: (context,index){
return TripsItem(id:filtertrips[index].id, title: filtertrips[index].title, imageUrl:filtertrips[index].imageUrl, duration:filtertrips[index].duration, season:filtertrips[index].season, tripType:filtertrips[index].tripType);
},
itemCount: filtertrips.length,

),
);
}
  }
