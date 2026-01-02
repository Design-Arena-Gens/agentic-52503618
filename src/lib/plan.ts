import { DESTINATIONS, Destination, ActivityPreference, ClimatePreference } from "./destinations";

export interface TravelerProfile {
  fullName: string;
  email: string;
  phone: string;
  departureCity: string;
  travelDates: {
    start: string;
    end: string;
  };
  travelerCount: number;
  budgetPerPerson: number;
  travelStyle: "relaxed" | "balanced" | "fast-paced";
  climatePreference: ClimatePreference[];
  activityPreferences: ActivityPreference[];
  accommodationStyle: Destination["accommodations"][number]["style"][];
  specialNotes?: string;
}

export interface ProposedBooking {
  destination: Destination;
  confidence: number;
  matchedReasons: string[];
  travelPlan: {
    stayLength: number;
    accommodations: {
      name: string;
      style: string;
      totalCostEstimate: number;
      blurb: string;
      status: "reserved" | "requested";
    }[];
    experiences: {
      name: string;
      day: number;
      summary: string;
      status: "reserved" | "requested";
    }[];
    notes: string[];
    totalTripEstimate: number;
  };
}

const DAILY_SPEND_BUFFER = 120;

function calculateTripLength(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 5;
}

function scoreDestination(profile: TravelerProfile, destination: Destination) {
  let score = 0;
  const reasons: string[] = [];

  const matchTravelStyle =
    profile.travelStyle === "relaxed"
      ? destination.durationIdeal.maxDays >= calculateTripLength(profile.travelDates.start, profile.travelDates.end)
      : profile.travelStyle === "fast-paced"
      ? destination.durationIdeal.minDays <= calculateTripLength(profile.travelDates.start, profile.travelDates.end)
      : true;

  if (matchTravelStyle) {
    score += 10;
  }

  const matchedClimate = profile.climatePreference.filter((pref) => destination.climate.includes(pref));
  if (matchedClimate.length > 0) {
    score += matchedClimate.length * 8;
    reasons.push(`Matches your climate preference for ${matchedClimate.join(", ")} escapes.`);
  }

  const matchedActivities = profile.activityPreferences.filter((pref) =>
    destination.activityHighlights.includes(pref),
  );
  if (matchedActivities.length > 0) {
    score += matchedActivities.length * 6;
    reasons.push(`Offers standout ${matchedActivities.join(", ")} experiences you requested.`);
  }

  const budgetBand = getBudgetBand(profile.budgetPerPerson);
  if (destination.budgetLevel === budgetBand) {
    score += 12;
    reasons.push("Aligned with the budget level you indicated.");
  } else if (budgetAdjacency(destination.budgetLevel, budgetBand)) {
    score += 6;
    reasons.push("Slight stretch on budget but still within a manageable range.");
  }

  const accommodationMatch = destination.accommodations.find((stay) =>
    profile.accommodationStyle.includes(stay.style),
  );
  if (accommodationMatch) {
    score += 5;
    reasons.push(`Includes ${accommodationMatch.style} stays that suit your style.`);
  }

  return { score, reasons };
}

function getBudgetBand(budgetPerPerson: number): Destination["budgetLevel"] {
  if (budgetPerPerson <= 200) return "budget";
  if (budgetPerPerson <= 400) return "moderate";
  return "luxury";
}

function budgetAdjacency(
  destinationBudget: Destination["budgetLevel"],
  travelerBudget: Destination["budgetLevel"],
) {
  if (destinationBudget === travelerBudget) return true;
  if (travelerBudget === "budget" && destinationBudget === "moderate") return true;
  if (travelerBudget === "moderate" && destinationBudget === "luxury") return true;
  return false;
}

function buildTravelPlan(profile: TravelerProfile, destination: Destination): ProposedBooking {
  const tripLength = calculateTripLength(profile.travelDates.start, profile.travelDates.end);
  const stayNights = Math.max(tripLength, destination.durationIdeal.minDays);

  const accommodations = destination.accommodations
    .filter((stay) => profile.accommodationStyle.includes(stay.style))
    .map((stay, index) => {
      const status: "reserved" | "requested" = index === 0 ? "reserved" : "requested";
      return {
        name: stay.name,
        style: stay.style,
        totalCostEstimate: stay.nightlyRate * stayNights * profile.travelerCount,
        blurb: stay.blurb,
        status,
      };
    });

  const fallbackStays = destination.accommodations
    .filter((stay) => !profile.accommodationStyle.includes(stay.style))
    .map((stay) => ({
      name: stay.name,
      style: stay.style,
      totalCostEstimate: stay.nightlyRate * stayNights * profile.travelerCount,
      blurb: stay.blurb,
      status: "requested" as const,
    }));

  const experiences = destination.experiences
    .filter((experience) => profile.activityPreferences.includes(experience.category))
    .map((experience, index) => ({
      name: experience.name,
      day: index + 1,
      summary: experience.summary,
      status: "reserved" as const,
    }));

  const dailyBudget = profile.budgetPerPerson + DAILY_SPEND_BUFFER;
  const activityBudgetEstimate = experiences.length * 180 * profile.travelerCount;
  const accommodationBudget = accommodations.length > 0 ? accommodations[0].totalCostEstimate : fallbackStays[0]?.totalCostEstimate ?? 0;
  const totalTripEstimate = accommodationBudget + activityBudgetEstimate + dailyBudget * stayNights * profile.travelerCount * 0.35;

  return {
    destination,
    confidence: 0,
    matchedReasons: [],
    travelPlan: {
      stayLength: stayNights,
      accommodations: accommodations.length > 0 ? accommodations : fallbackStays,
      experiences:
        experiences.length > 0
          ? experiences
          : destination.experiences.slice(0, 2).map((experience, index) => ({
              name: experience.name,
              day: index + 1,
              summary: experience.summary,
              status: "requested" as const,
            })),
      notes: [
        `Flights from ${profile.departureCity} will be monitored for best fares.`,
        `Transfers and daily support arranged by the on-ground concierge partner.`,
        ...(profile.specialNotes ? [profile.specialNotes] : []),
      ],
      totalTripEstimate: Math.round(totalTripEstimate),
    },
  };
}

export function generateBookings(profile: TravelerProfile): ProposedBooking[] {
  const scored = DESTINATIONS.map((destination) => {
    const { score, reasons } = scoreDestination(profile, destination);
    const proposal = buildTravelPlan(profile, destination);
    return {
      ...proposal,
      confidence: Math.min(100, score),
      matchedReasons: reasons,
    };
  })
    .filter((proposal) => proposal.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  if (scored.length === 0) {
    return DESTINATIONS.slice(0, 2).map((destination) => {
      const proposal = buildTravelPlan(profile, destination);
      return {
        ...proposal,
        confidence: 45,
        matchedReasons: ["Curated as an exploratory option based on travel industry popularity."],
      };
    });
  }

  return scored;
}
