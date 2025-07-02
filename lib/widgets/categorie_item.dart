import 'package:flutter/material.dart';

class CategorieItem extends StatelessWidget {
final String id;
final String title;
final String imageUrl;

const CategorieItem(this.id,this.title,this.imageUrl, {super.key});
void SelectCategory(BuildContext ctx){
Navigator.of(ctx).pushNamed('/category-trips',arguments: {'id':id,'title':title}, );
}
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: ()=>SelectCategory(context),
      child: Stack(children: [
      ClipRRect(borderRadius: BorderRadius.circular(15),
        child: Image.network(imageUrl,
        height: 250,
        fit: BoxFit.cover,),
      ),
      Container( alignment:Alignment.center,
        padding: EdgeInsets.all(10),
        child: Text(title,
        style: Theme.of(context).textTheme.headlineLarge,
        ),
      
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(15),
      color: Colors.black.withOpacity(0.4),),
        )
       
      ],),
    );
  }
}