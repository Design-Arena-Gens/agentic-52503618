export type ClimatePreference = "tropical" | "temperate" | "cold" | "dry";
export type ActivityPreference =
  | "culture"
  | "food"
  | "adventure"
  | "relaxation"
  | "nature"
  | "nightlife";

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  idealSeasons: string[];
  climate: ClimatePreference[];
  activityHighlights: ActivityPreference[];
  budgetLevel: "budget" | "moderate" | "luxury";
  durationIdeal: {
    minDays: number;
    maxDays: number;
  };
  accommodations: {
    name: string;
    style: "boutique" | "resort" | "eco" | "hotel" | "villa";
    nightlyRate: number;
    blurb: string;
  }[];
  experiences: {
    name: string;
    category: ActivityPreference;
    summary: string;
  }[];
  travelTips: string[];
}

export const DESTINATIONS: Destination[] = [
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    description:
      "A tropical escape blending lush rice terraces, serene temples, and surf-ready beaches.",
    idealSeasons: ["April", "May", "June", "September"],
    climate: ["tropical"],
    activityHighlights: ["relaxation", "adventure", "culture", "food"],
    budgetLevel: "moderate",
    durationIdeal: { minDays: 6, maxDays: 12 },
    accommodations: [
      {
        name: "Ayana Resort & Spa",
        style: "resort",
        nightlyRate: 320,
        blurb: "Cliff-top ocean views, full-service spa, and private beach club.",
      },
      {
        name: "Desa Seni Village Resort",
        style: "eco",
        nightlyRate: 210,
        blurb: "Restored Javanese homes, yoga shala, and organic farm-to-table dining.",
      },
    ],
    experiences: [
      {
        name: "Sunrise Trek up Mount Batur",
        category: "adventure",
        summary: "Guided volcano hike with breakfast overlooking volcanic caldera.",
      },
      {
        name: "Private Balinese Cooking Workshop",
        category: "food",
        summary: "Explore local markets and cook traditional dishes with a local chef.",
      },
      {
        name: "Ubud Temple and Waterfall Circuit",
        category: "culture",
        summary: "Day tour to Tirta Empul temple, Tegallalang terraces, and hidden waterfalls.",
      },
    ],
    travelTips: [
      "Arrange for a private driver to navigate the island efficiently.",
      "Plan spa treatments and surf lessons in advance during peak season.",
    ],
  },
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    description:
      "Sun-soaked coastal capital with historic neighborhoods, vibrant food, and easy day trips.",
    idealSeasons: ["March", "April", "May", "September", "October"],
    climate: ["temperate"],
    activityHighlights: ["culture", "food", "nightlife"],
    budgetLevel: "moderate",
    durationIdeal: { minDays: 4, maxDays: 8 },
    accommodations: [
      {
        name: "The Lumiares Hotel & Spa",
        style: "boutique",
        nightlyRate: 260,
        blurb: "Design-forward suites in Bairro Alto with rooftop views over the Tagus.",
      },
      {
        name: "LX Boutique Hotel",
        style: "hotel",
        nightlyRate: 180,
        blurb: "Eclectic hotel footsteps from Time Out Market and the riverfront promenade.",
      },
    ],
    experiences: [
      {
        name: "Pastéis de Nata Baking Class",
        category: "food",
        summary: "Hands-on class mastering Lisbon's iconic custard tarts.",
      },
      {
        name: "Sintra Palaces & Coast Tour",
        category: "culture",
        summary:
          "Private guide to Pena Palace, Quinta da Regaleira, and sunset at Cabo da Roca.",
      },
      {
        name: "Fado Night in Alfama",
        category: "nightlife",
        summary: "Dinner and live traditional Fado performance in a historic tavern.",
      },
    ],
    travelTips: [
      "Purchase a Viva Viagem card for trams, ferries, and metro rides.",
      "Schedule Sintra excursion on a weekday to avoid crowds.",
    ],
  },
  {
    id: "banff",
    name: "Banff National Park",
    country: "Canada",
    description:
      "Dramatic alpine landscapes, glacier-fed lakes, and year-round outdoor adventures.",
    idealSeasons: ["June", "July", "August", "September", "February"],
    climate: ["temperate", "cold"],
    activityHighlights: ["adventure", "nature"],
    budgetLevel: "moderate",
    durationIdeal: { minDays: 5, maxDays: 9 },
    accommodations: [
      {
        name: "Fairmont Banff Springs",
        style: "hotel",
        nightlyRate: 390,
        blurb: "Iconic castle hotel with mountain views and on-site spa and dining.",
      },
      {
        name: "Moose Hotel & Suites",
        style: "hotel",
        nightlyRate: 240,
        blurb: "Cozy suites with rooftop hot pools just steps from downtown Banff.",
      },
    ],
    experiences: [
      {
        name: "Sunrise Canoe on Moraine Lake",
        category: "nature",
        summary: "Private canoe rental to beat the crowds on the turquoise lake.",
      },
      {
        name: "Icefields Parkway Scenic Transfer",
        category: "adventure",
        summary: "Full-day guided drive with glacier walks and wildlife spotting.",
      },
      {
        name: "Snowshoe Under the Stars",
        category: "adventure",
        summary: "Nighttime snowshoe excursion with a naturalist guide and campfire.",
      },
    ],
    travelTips: [
      "Book Parks Canada shuttle for Lake Louise access during summer months.",
      "Pack layers; temperatures swing drastically between day and night.",
    ],
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    description:
      "Historic temples, tranquil gardens, and culinary craftsmanship in Japan's cultural capital.",
    idealSeasons: ["March", "April", "October", "November"],
    climate: ["temperate"],
    activityHighlights: ["culture", "food", "relaxation"],
    budgetLevel: "luxury",
    durationIdeal: { minDays: 5, maxDays: 10 },
    accommodations: [
      {
        name: "Hoshinoya Kyoto",
        style: "boutique",
        nightlyRate: 620,
        blurb: "Riverside ryokan accessible by boat with kaiseki dining and tea ceremony.",
      },
      {
        name: "Hotel The Celestine Kyoto Gion",
        style: "hotel",
        nightlyRate: 280,
        blurb: "Elegant property steps from Yasaka Shrine with onsen-style baths.",
      },
    ],
    experiences: [
      {
        name: "Private Tea Ceremony in Gion",
        category: "culture",
        summary: "Intimate encounter with a tea master explaining ritual and history.",
      },
      {
        name: "Kaiseki Tasting with Chef's Counter",
        category: "food",
        summary: "Seasonal multi-course dinner showcasing Kyoto's delicate cuisine.",
      },
      {
        name: "Arashiyama Bamboo Grove Sunrise Walk",
        category: "relaxation",
        summary: "Beat the crowds with a dawn stroll capped with riverside breakfast.",
      },
    ],
    travelTips: [
      "Reserve limited-entry temple visits such as Saiho-ji moss garden weeks in advance.",
      "Rent pocket Wi-Fi for easy navigation and translation.",
    ],
  },
  {
    id: "costa-rica",
    name: "Osa Peninsula",
    country: "Costa Rica",
    description:
      "Remote rainforests teeming with wildlife, pristine beaches, and eco-forward lodges.",
    idealSeasons: ["January", "February", "March", "April"],
    climate: ["tropical", "dry"],
    activityHighlights: ["nature", "adventure", "relaxation"],
    budgetLevel: "luxury",
    durationIdeal: { minDays: 6, maxDays: 10 },
    accommodations: [
      {
        name: "Lapa Rios Lodge",
        style: "eco",
        nightlyRate: 540,
        blurb: "Sustainably built rainforest bungalows with guided wildlife safaris.",
      },
      {
        name: "El Remanso Rainforest Wildness Lodge",
        style: "eco",
        nightlyRate: 410,
        blurb: "Waterfall rappelling, canopy bridges, and Pacific-view infinity pool.",
      },
    ],
    experiences: [
      {
        name: "Golfo Dulce Mangrove Kayaking",
        category: "nature",
        summary: "Spot dolphins and scarlet macaws in secluded mangrove channels.",
      },
      {
        name: "Corcovado National Park Expedition",
        category: "adventure",
        summary: "Full-day ranger-led trek through one of the planet's most biodiverse parks.",
      },
      {
        name: "Sunset Bio Bay Cruise",
        category: "relaxation",
        summary: "Bioluminescent waters and stargazing aboard a private catamaran.",
      },
    ],
    travelTips: [
      "Fly into Puerto Jiménez to avoid lengthy overland transfers.",
      "Pack reef-safe sunscreen and lightweight rain gear.",
    ],
  },
  {
    id: "iceland",
    name: "South Coast Iceland",
    country: "Iceland",
    description:
      "Waterfalls, glaciers, black-sand beaches, and geothermal lagoons under midnight sun or aurora skies.",
    idealSeasons: ["February", "March", "September", "October"],
    climate: ["cold", "temperate"],
    activityHighlights: ["adventure", "nature"],
    budgetLevel: "luxury",
    durationIdeal: { minDays: 4, maxDays: 7 },
    accommodations: [
      {
        name: "Hotel Rangá",
        style: "boutique",
        nightlyRate: 480,
        blurb: "Aurora wake-up calls, observatory, and themed suites along the Rangá River.",
      },
      {
        name: "ION Adventure Hotel",
        style: "eco",
        nightlyRate: 520,
        blurb: "Minimalist design perched near Thingvellir with spa and lava views.",
      },
    ],
    experiences: [
      {
        name: "Glacier Hike & Ice Cave Exploration",
        category: "adventure",
        summary: "Certified guide leads onto Sólheimajökull with all gear included.",
      },
      {
        name: "Super Jeep Northern Lights Hunt",
        category: "nature",
        summary:
          "Evening chase with expert photographer to capture aurora away from light pollution.",
      },
      {
        name: "Blue Lagoon Retreat Spa",
        category: "relaxation",
        summary: "Exclusive access to the Retreat Lagoon, subterranean spa, and gourmet dining.",
      },
    ],
    travelTips: [
      "Pre-book guided glacier activities; permits and weather windows are limited.",
      "Rent a 4x4 vehicle in winter for safer driving on icy roads.",
    ],
  },
];
