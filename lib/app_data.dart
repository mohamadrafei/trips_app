
import 'package:travel_app/models/categorie.dart';
import 'package:travel_app/models/trip.dart';

List<String> bookedTripIdsGlobal = [];

const Categories_data = [
  Categorie(
    id: 'c1',
    title: 'Mountains',
    ImageUrl:
        'https://images.unsplash.com/photo-1575728252059-db43d03fc2de?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NTh8fG1vdW5hdGluc3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=',
  ),
  Categorie(
    id: 'c2',
    title: 'Lakes',
    ImageUrl:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
  ),
  Categorie(
    id: 'c3',
    title: 'Beaches',
    ImageUrl:
        'https://images.unsplash.com/photo-1493558103817-58b2924bce98?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTAxfHxiZWFjaHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
  ),
  Categorie(
    id: 'c4',
    title: 'Deserts',
    ImageUrl:
        'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzZXJ0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
  ),
  Categorie(
    id: 'c5',
    title: 'Historical Cities',
    ImageUrl:
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NjR8fHRyYXZlbHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
  ),
  Categorie(
    id: 'c6',
    title: 'Others',
    ImageUrl:
        'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8c2tpaW5nfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
  ),
];

const Trips_data = const [
  Trip(
    id: 'm1',
    categories: [
      'c1',
    ],
    title: 'The Alps',
    tripType: TripType.exploration,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1611523658822-385aa008324c?ixid=MXwxMjA3fDB8MHxzZWFyY2h8N3x8bW91bmF0aW5zfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    duration: 20,
    activities: [
      'Visit archaeological sites',
      'Walking tour',
      'Shopping at commercial centers',
      'Lunch',
      'Enjoy the beautiful scenery'
    ],
    program: [
      'Day 1: Arrival and orientation',
      'Day 2: Mountain hiking tour',
      'Day 3: Visit local villages',
      'Day 4: Rest day and leisure activities',
      'Day 5: Summit attempt',
      'Day 6: Return and departure'
    ],
    isInSummer: false,
    isForFamilies: true,
    isInWinter: true,
  ),
  Trip(
    id: 'm2',
    categories: [
      'c1',
    ],
    title: 'Southern Mountains',
    tripType: TripType.exploration,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1612456225451-bb8d10d0131d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjZ8fG1vdW5hdGluc3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    duration: 10,
    activities: [
      'Visit archaeological sites',
      'Walking tour',
      'Shopping at commercial centers',
      'Lunch',
      'Enjoy the beautiful scenery'
    ],
    program: [
      'Day 1: Arrival and check-in',
      'Day 2: Guided nature walk',
      'Day 3: Cultural experience',
      'Day 4: Departure'
    ],
    isInSummer: false,
    isForFamilies: false,
    isInWinter: false,
  ),
  Trip(
    id: 'm3',
    categories: [
      'c1',
    ],
    title: 'High Peaks',
    tripType: TripType.recovery,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1592221912790-2b4df8882ea9?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mzd8fG1vdW5hdGluc3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    duration: 45,
    activities: [
      'Visit archaeological sites',
      'Walking tour',
      'Shopping at commercial centers',
      'Lunch',
      'Enjoy the beautiful scenery'
    ],
    program: [
      'Week 1: Acclimatization and basic training',
      'Week 2: Ascent to base camp',
      'Week 3: Summit preparation',
      'Week 4: Summit attempt and return'
    ],
    isInSummer: false,
    isForFamilies: false,
    isInWinter: true,
  ),
  Trip(
    id: 'm4',
    categories: [
      'c2',
      
    ],
    title: 'The Great Lake',
    tripType: TripType.activities,
    season: Season.Spring,
    imageUrl:
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixid=MXwxMjA3fDB8MHxzZWFyY2h8OXx8bGFrZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    duration: 60,
    activities: [
      'Boat tours',
      'Fishing experience',
      'Water sports',
      'Lakeside dining',
      'Nature photography'
    ],
    program: [
      'Week 1: Exploration of northern shores',
      'Week 2: Island hopping',
      'Week 3: Water activities',
      'Week 4: Cultural immersion'
    ],
    isInSummer: false,
    isForFamilies: false,
    isInWinter: false,
  ),
  Trip(
    id: 'm5',
    categories: [
      'c2',
      'c1',
    ],
    title: 'Small Lakes',
    tripType: TripType.activities,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1580100586938-02822d99c4a8?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjF8fGxha2V8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    duration: 15,
    activities: [
      'Kayaking',
      'Bird watching',
      'Picnics',
      'Hiking around lakes',
      'Stargazing'
    ],
    program: [
      'Day 1-3: First lake exploration',
      'Day 4-6: Second lake visit',
      'Day 7-9: Third lake activities',
      'Day 10-15: Combined experiences'
    ],
    isInSummer: true,
    isForFamilies: false,
    isInWinter: true,
  ),
  Trip(
    id: 'm6',
    categories: [
      'c2',
    ],
    title: 'Emerald Lake',
    tripType: TripType.exploration,
    season: Season.Summer,
    imageUrl:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    duration: 240,
    activities: [
      'Scuba diving',
      'Underwater photography',
      'Eco tours',
      'Scientific exploration',
      'Documentary filming'
    ],
    program: [
      'Month 1: Initial surveys',
      'Month 2: Detailed mapping',
      'Month 3: Ecological studies',
      'Month 4: Conservation planning'
    ],
    isInSummer: true,
    isForFamilies: false,
    isInWinter: false,
  ),
  Trip(
    id: 'm7',
    categories: [
      'c3',
    ],
    title: 'First Beach',
    tripType: TripType.exploration,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1493558103817-58b2924bce98?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTAxfHxiZWFjaHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    duration: 20,
    activities: [
      'Beach combing',
      'Sunbathing',
      'Swimming',
      'Beach volleyball',
      'Sunset watching'
    ],
    program: [
      'Day 1-5: Northern beach section',
      'Day 6-10: Central beach area',
      'Day 11-15: Southern coves',
      'Day 16-20: Island excursions'
    ],
    isInSummer: true,
    isForFamilies: false,
    isInWinter: false,
  ),
  Trip(
    id: 'm8',
    categories: [
      'c3',
    ],
    title: 'Big Beach',
    tripType: TripType.recovery,
    season: Season.Spring,
    imageUrl:
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2h8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    duration: 35,
    activities: [
      'Yoga sessions',
      'Meditation',
      'Spa treatments',
      'Healthy dining',
      'Relaxation workshops'
    ],
    program: [
      'Week 1: Detox and relaxation',
      'Week 2: Mindfulness training',
      'Week 3: Physical wellness',
      'Week 4: Integration and planning'
    ],
    isInSummer: true,
    isForFamilies: false,
    isInWinter: true,
  ),
  Trip(
    id: 'm9',
    categories: [
      'c3',
    ],
    title: 'Rocky Beach',
    tripType: TripType.exploration,
    season: Season.Summer,
    imageUrl:
        'https://images.unsplash.com/photo-1519602035691-16ac091344ef?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjE1fHxiZWFjaHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    duration: 45,
    activities: [
      'Rock climbing',
      'Tide pool exploration',
      'Cliff diving',
      'Coastal hiking',
      'Photography'
    ],
    program: [
      'Week 1-3: Northern cliffs',
      'Week 4-6: Central rock formations',
      'Week 7-9: Southern caves'
    ],
    isInSummer: true,
    isForFamilies: false,
    isInWinter: false,
  ),
  Trip(
    id: 'm10',
    categories: [
      'c4',
    ],
    title: 'Great Desert',
    tripType: TripType.activities,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzZXJ0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    duration: 30,
    activities: [
      'Camel trekking',
      'Desert camping',
      'Sandboarding',
      'Star gazing',
      'Oasis visits'
    ],
    program: [
      'Week 1: Eastern dunes',
      'Week 2: Central desert',
      'Week 3: Western canyons',
      'Week 4: Northern oases'
    ],
    isInSummer: true,
    isForFamilies: true,
    isInWinter: true,
  ),
  Trip(
    id: 'm11',
    categories: [
      'c4',
      
    ],
    title: 'Western Desert',
    tripType: TripType.activities,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    duration: 30,
    activities: [
      '4x4 adventures',
      'Archaeological tours',
      'Nomadic experiences',
      'Desert survival training',
      'Photography expeditions'
    ],
    program: [
      'Week 1: Preparation and training',
      'Week 2: Northern expedition',
      'Week 3: Southern journey',
      'Week 4: Return and documentation'
    ],
    isInSummer: true,
    isForFamilies: true,
    isInWinter: true,
  ),
  Trip(
    id: 'm12',
    categories: [
      'c4',
    ],
    title: 'Sandy Desert',
    tripType: TripType.activities,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1452022582947-b521d8779ab6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8ODN8fGRlc2VydHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    duration: 30,
    activities: [
      'Sand dune trekking',
      'Meteorite hunting',
      'Fossil exploration',
      'Desert ecology studies',
      'Night photography'
    ],
    program: [
      'Week 1: Eastern ergs',
      'Week 2: Central dunes',
      'Week 3: Western sand seas',
      'Week 4: Special projects'
    ],
    isInSummer: true,
    isForFamilies: true,
    isInWinter: true,
  ),
  Trip(
    id: 'm13',
    categories: [
      'c5',
    ],
    title: 'First City',
    tripType: TripType.activities,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDJ8fHRyYXZlbHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    duration: 30,
    activities: [
      'Museum visits',
      'Historical tours',
      'Cultural performances',
      'Local cuisine tasting',
      'Architectural photography'
    ],
    program: [
      'Week 1: Ancient quarter',
      'Week 2: Medieval district',
      'Week 3: Renaissance area',
      'Week 4: Modern city'
    ],
    isInSummer: true,
    isForFamilies: true,
    isInWinter: true,
  ),
  Trip(
    id: 'm14',
    categories: [
      'c5',
    ],
    title: 'Second City',
    tripType: TripType.activities,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NjR8fHRyYXZlbHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    duration: 30,
    activities: [
      'Guided historical walks',
      'Art gallery tours',
      'Local market visits',
      'Traditional craft workshops',
      'Evening cultural events'
    ],
    program: [
      'Week 1: Political history',
      'Week 2: Artistic heritage',
      'Week 3: Commercial development',
      'Week 4: Contemporary culture'
    ],
    isInSummer: true,
    isForFamilies: true,
    isInWinter: true,
  ),
  Trip(
    id: 'm15',
    categories: [
      'c5',
    ],
    title: 'Old City',
    tripType: TripType.activities,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1519923041107-e4dc8d9193da?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Njd8fG9sZCUyMGNpdHl8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    duration: 30,
    activities: [
      'Underground tours',
      'Secret passage exploration',
      'Historical reenactments',
      'Ancient technology demonstrations',
      'Traditional festivals'
    ],
    program: [
      'Week 1: Foundations and early history',
      'Week 2: Golden age',
      'Week 3: Period of decline',
      'Week 4: Modern preservation'
    ],
    isInSummer: true,
    isForFamilies: true,
    isInWinter: true,
  ),
  Trip(
    id: 'm16',
    categories: [
      'c6',
    ],
    title: 'Skiing Adventure',
    tripType: TripType.activities,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8c2tpaW5nfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    duration: 30,
    activities: [
      'Ski lessons',
      'Snowboarding',
      'Avalanche safety training',
      'Après-ski activities',
      'Mountain rescue demonstrations'
    ],
    program: [
      'Week 1: Beginner slopes',
      'Week 2: Intermediate challenges',
      'Week 3: Advanced techniques',
      'Week 4: Freestyle and competition'
    ],
    isInSummer: true,
    isForFamilies: true,
    isInWinter: true,
  ),
  Trip(
    id: 'm17',
    categories: [
      'c6',
      'c2',
    ],
    title: 'Parachute Jumping',
    tripType: TripType.activities,
    season: Season.Winter,
    imageUrl:
        'https://images.unsplash.com/photo-1601024445121-e5b82f020549?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTJ8fHBhcmFjaHV0ZSUyMGp1bXBpbmd8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
    duration: 30,
    activities: [
      'Ground training',
      'Tandem jumps',
      'Solo jumps',
      'Formation skydiving',
      'Freefall photography'
    ],
    program: [
      'Week 1: Theory and safety',
      'Week 2: First jumps with instructors',
      'Week 3: Independent jumps',
      'Week 4: Advanced techniques'
    ],
    isInSummer: true,
    isForFamilies: true,
    isInWinter: true,
  ),
];