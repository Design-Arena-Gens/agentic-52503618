import { NextResponse } from "next/server";
import { generateBookings, TravelerProfile } from "@/lib/plan";

function isValidProfile(payload: Partial<TravelerProfile>): payload is TravelerProfile {
  if (
    !payload.fullName ||
    !payload.email ||
    !payload.phone ||
    !payload.departureCity ||
    !payload.travelDates?.start ||
    !payload.travelDates?.end ||
    typeof payload.travelerCount !== "number" ||
    typeof payload.budgetPerPerson !== "number" ||
    !payload.travelStyle ||
    !Array.isArray(payload.climatePreference) ||
    !Array.isArray(payload.activityPreferences) ||
    !Array.isArray(payload.accommodationStyle)
  ) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<TravelerProfile>;

  if (!isValidProfile(payload)) {
    return NextResponse.json(
      { error: "Missing required fields. Please complete every step before submitting." },
      { status: 400 },
    );
  }

  const proposals = generateBookings(payload);

  return NextResponse.json({
    proposals,
    timestamp: new Date().toISOString(),
  });
}
