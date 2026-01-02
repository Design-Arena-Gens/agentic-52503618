'use client';

import { FormEvent, useMemo, useState } from "react";
import { ProposedBooking, TravelerProfile } from "@/lib/plan";
import { ActivityPreference, ClimatePreference } from "@/lib/destinations";

type StepKey = "identity" | "trip" | "preferences" | "review";

const climateOptions: { label: string; value: ClimatePreference }[] = [
  { label: "Tropical & Humid", value: "tropical" },
  { label: "Mild & Temperate", value: "temperate" },
  { label: "Cool & Wintry", value: "cold" },
  { label: "Dry & Arid", value: "dry" },
];

const activityOptions: { label: string; value: ActivityPreference }[] = [
  { label: "Culture & History", value: "culture" },
  { label: "Culinary Experiences", value: "food" },
  { label: "Adventure & Thrills", value: "adventure" },
  { label: "Relaxation & Wellness", value: "relaxation" },
  { label: "Nature & Wildlife", value: "nature" },
  { label: "Nightlife & Entertainment", value: "nightlife" },
];

const accommodationOptions: { label: string; value: TravelerProfile["accommodationStyle"][number] }[] = [
  { label: "Boutique Hotels", value: "boutique" },
  { label: "Luxury Resorts", value: "resort" },
  { label: "Eco Lodges", value: "eco" },
  { label: "Design Hotels", value: "hotel" },
  { label: "Private Villas", value: "villa" },
];

const steps: { key: StepKey; title: string; subtitle: string }[] = [
  {
    key: "identity",
    title: "Who is travelling?",
    subtitle: "We secure your data via encrypted transmission and never resell it.",
  },
  {
    key: "trip",
    title: "Trip basics",
    subtitle: "Tell us when you want to go and what budget we should manage.",
  },
  {
    key: "preferences",
    title: "Personalised tastes",
    subtitle: "Dial in the vibes so we can reserve perfect stays and experiences.",
  },
  {
    key: "review",
    title: "Final review",
    subtitle: "Confirm details and we will queue the booking concierge.",
  },
];

const defaultProfile: TravelerProfile = {
  fullName: "",
  email: "",
  phone: "",
  departureCity: "",
  travelDates: { start: "", end: "" },
  travelerCount: 1,
  budgetPerPerson: 250,
  travelStyle: "balanced",
  climatePreference: [],
  activityPreferences: [],
  accommodationStyle: [],
  specialNotes: "",
};

export default function Home() {
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<TravelerProfile>(defaultProfile);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [proposals, setProposals] = useState<ProposedBooking[]>([]);

  const currentStep = steps[stepIndex];

  const stepIsValid = useMemo(() => {
    switch (currentStep.key) {
      case "identity":
        return profile.fullName !== "" && profile.email !== "" && profile.phone !== "";
      case "trip":
        return (
          profile.departureCity !== "" &&
          profile.travelDates.start !== "" &&
          profile.travelDates.end !== "" &&
          profile.travelerCount > 0 &&
          profile.budgetPerPerson > 0
        );
      case "preferences":
        return (
          profile.climatePreference.length > 0 &&
          profile.activityPreferences.length > 0 &&
          profile.accommodationStyle.length > 0
        );
      case "review":
        return true;
      default:
        return false;
    }
  }, [currentStep.key, profile]);

  const handleNext = () => {
    if (!stepIsValid) {
      setError("Please complete the required fields before continuing.");
      return;
    }

    setError(null);
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  };

  const handleBack = () => {
    setError(null);
    setStepIndex((index) => Math.max(index - 1, 0));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stepIsValid) {
      setError("Please complete the required fields before submitting.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const detail = await response.json();
        throw new Error(detail.error ?? "Unable to generate itinerary right now.");
      }

      const data = (await response.json()) as { proposals: ProposedBooking[]; timestamp: string };
      setProposals(data.proposals);
      setCompletedAt(data.timestamp);
      setStepIndex(steps.findIndex((step) => step.key === "review"));
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetPlanner = () => {
    setProfile(defaultProfile);
    setProposals([]);
    setCompletedAt(null);
    setError(null);
    setStepIndex(0);
  };

  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_rgba(51,65,85,0.4),transparent_60%)] py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:px-12 lg:px-24">
        <header className="flex flex-col gap-3">
          <span className="text-sm uppercase tracking-[0.3em] text-slate-300">Atlas Voyage Concierge</span>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Agent-led trip architect that books travel tailored to you.
          </h1>
          <p className="max-w-2xl text-base text-slate-300 md:text-lg">
            Share the essentials once and our concierge AI secures the right stays, experiences, and on-ground support.
            Designed for travellers who value privacy, precision, and human-quality curation on autopilot.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur"
          >
            <div className="flex flex-col gap-2 border-b border-slate-800 pb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white md:text-2xl">{currentStep.title}</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Step {stepIndex + 1} / {steps.length}
                </span>
              </div>
              <p className="text-sm text-slate-400 md:text-base">{currentStep.subtitle}</p>
            </div>

            <div className="mt-6 flex flex-col gap-6">
              {currentStep.key === "identity" && (
                <>
                  <Field label="Full name" required>
                    <input
                      value={profile.fullName}
                      onChange={(event) => setProfile((prev) => ({ ...prev, fullName: event.target.value }))}
                      className="input"
                      placeholder="Jordan Traveller"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Email" helper="Used for booking confirmations." required>
                    <input
                      value={profile.email}
                      onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                      className="input"
                      placeholder="jordan@email.com"
                      type="email"
                      autoComplete="email"
                    />
                  </Field>
                  <Field
                    label="Phone / WhatsApp"
                    helper="Only shared with vetted on-location partners."
                    required
                  >
                    <input
                      value={profile.phone}
                      onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))}
                      className="input"
                      placeholder="+1 555 555 1212"
                      autoComplete="tel"
                    />
                  </Field>
                </>
              )}

              {currentStep.key === "trip" && (
                <>
                  <Field label="Departure city" required>
                    <input
                      value={profile.departureCity}
                      onChange={(event) => setProfile((prev) => ({ ...prev, departureCity: event.target.value }))}
                      className="input"
                      placeholder="New York City"
                      autoComplete="off"
                    />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Start date" required>
                      <input
                        value={profile.travelDates.start}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            travelDates: { ...prev.travelDates, start: event.target.value },
                          }))
                        }
                        className="input"
                        type="date"
                      />
                    </Field>
                    <Field label="End date" required>
                      <input
                        value={profile.travelDates.end}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            travelDates: { ...prev.travelDates, end: event.target.value },
                          }))
                        }
                        className="input"
                        type="date"
                      />
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Travellers" helper="Include all adults and children." required>
                      <input
                        value={profile.travelerCount}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            travelerCount: Number.parseInt(event.target.value, 10) || 0,
                          }))
                        }
                        className="input"
                        type="number"
                        min={1}
                      />
                    </Field>
                    <Field label="Budget per person (USD)" helper="Used to stage hotel & activity holds." required>
                      <input
                        value={profile.budgetPerPerson}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            budgetPerPerson: Number.parseInt(event.target.value, 10) || 0,
                          }))
                        }
                        className="input"
                        type="number"
                        min={100}
                        step={50}
                      />
                    </Field>
                  </div>
                  <Field label="Preferred travel pace">
                    <div className="flex flex-wrap gap-3">
                      {(["relaxed", "balanced", "fast-paced"] as TravelerProfile["travelStyle"][]).map((style) => (
                        <button
                          type="button"
                          key={style}
                          onClick={() => setProfile((prev) => ({ ...prev, travelStyle: style }))}
                          className={`pill ${profile.travelStyle === style ? "pill-active" : ""}`}
                        >
                          {style === "relaxed" && "Slow & Restful"}
                          {style === "balanced" && "Balanced"}
                          {style === "fast-paced" && "See it all"}
                        </button>
                      ))}
                    </div>
                  </Field>
                </>
              )}

              {currentStep.key === "preferences" && (
                <>
                  <Field label="Ideal climate" helper="Pick as many as you like." required>
                    <div className="flex flex-wrap gap-3">
                      {climateOptions.map((option) => {
                        const selected = profile.climatePreference.includes(option.value);
                        return (
                          <button
                            type="button"
                            key={option.value}
                            onClick={() =>
                              setProfile((prev) => ({
                                ...prev,
                                climatePreference: selected
                                  ? prev.climatePreference.filter((value) => value !== option.value)
                                  : [...prev.climatePreference, option.value],
                              }))
                            }
                            className={`pill ${selected ? "pill-active" : ""}`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label="Must-have experiences" helper="We will confirm availability before finalising." required>
                    <div className="flex flex-wrap gap-3">
                      {activityOptions.map((option) => {
                        const selected = profile.activityPreferences.includes(option.value);
                        return (
                          <button
                            type="button"
                            key={option.value}
                            onClick={() =>
                              setProfile((prev) => ({
                                ...prev,
                                activityPreferences: selected
                                  ? prev.activityPreferences.filter((value) => value !== option.value)
                                  : [...prev.activityPreferences, option.value],
                              }))
                            }
                            className={`pill ${selected ? "pill-active" : ""}`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label="Accommodation style" helper="We'll stage reservations that match your vibe." required>
                    <div className="flex flex-wrap gap-3">
                      {accommodationOptions.map((option) => {
                        const selected = profile.accommodationStyle.includes(option.value);
                        return (
                          <button
                            type="button"
                            key={option.value}
                            onClick={() =>
                              setProfile((prev) => ({
                                ...prev,
                                accommodationStyle: selected
                                  ? prev.accommodationStyle.filter((value) => value !== option.value)
                                  : [...prev.accommodationStyle, option.value],
                              }))
                            }
                            className={`pill ${selected ? "pill-active" : ""}`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label="Anything else we should know?">
                    <textarea
                      value={profile.specialNotes}
                      onChange={(event) => setProfile((prev) => ({ ...prev, specialNotes: event.target.value }))}
                      className="input min-h-[120px]"
                      placeholder="Dietary needs, accessibility considerations, loyalty memberships..."
                    />
                  </Field>
                </>
              )}

              {currentStep.key === "review" && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <h3 className="text-lg font-semibold text-white">Confirmed traveller profile</h3>
                    <dl className="mt-3 grid gap-y-2 text-sm text-slate-300 md:grid-cols-2">
                      <div>
                        <dt className="font-medium text-slate-400">Lead traveller</dt>
                        <dd>{profile.fullName}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-400">Contact</dt>
                        <dd>{profile.email} · {profile.phone}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-400">Routing</dt>
                        <dd>Departing from {profile.departureCity}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-400">Dates</dt>
                        <dd>
                          {profile.travelDates.start} → {profile.travelDates.end} ({profile.travelerCount} travellers)
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-400">Budget</dt>
                        <dd>${profile.budgetPerPerson.toLocaleString()} per person · {profile.travelStyle} pace</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-400">Preferences</dt>
                        <dd>
                          {profile.climatePreference.map((pref) => pref).join(", ")} ·{" "}
                          {profile.activityPreferences.map((pref) => pref).join(", ")} ·{" "}
                          {profile.accommodationStyle.map((pref) => pref).join(", ")}
                        </dd>
                      </div>
                    </dl>
                    {profile.specialNotes && (
                      <p className="mt-2 text-sm text-slate-400">Notes: {profile.specialNotes}</p>
                    )}
                  </div>

                  {proposals.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Curated itinerary holds</h3>
                        <span className="text-xs uppercase tracking-[0.3em] text-emerald-400">
                          {completedAt ? `Generated ${new Date(completedAt).toLocaleString()}` : "Processing"}
                        </span>
                      </div>
                      <ul className="flex flex-col gap-4">
                        {proposals.map((proposal) => (
                          <li key={proposal.destination.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <h4 className="text-xl font-semibold text-white">
                                  {proposal.destination.name}, {proposal.destination.country}
                                </h4>
                                <p className="text-sm text-slate-300">{proposal.destination.description}</p>
                              </div>
                              <span className="inline-flex h-fit items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                                Confidence {proposal.confidence}%
                              </span>
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3">
                                <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                                  Accommodations staged
                                </h5>
                                <ul className="mt-2 flex flex-col gap-2 text-sm text-slate-300">
                                  {proposal.travelPlan.accommodations.map((stay) => (
                                    <li key={stay.name} className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-3">
                                      <div className="flex items-center justify-between gap-3">
                                        <span className="font-semibold text-white">{stay.name}</span>
                                        <span
                                          className={`text-xs uppercase tracking-[0.25em] ${
                                            stay.status === "reserved" ? "text-emerald-300" : "text-slate-400"
                                          }`}
                                        >
                                          {stay.status}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-400">
                                        {stay.style.toUpperCase()} · Est. ${(stay.totalCostEstimate / 1000).toFixed(1)}k
                                      </p>
                                      <p className="mt-1 text-xs text-slate-400">{stay.blurb}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3">
                                <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                                  Experiences arranged
                                </h5>
                                <ul className="mt-2 flex flex-col gap-2 text-sm text-slate-300">
                                  {proposal.travelPlan.experiences.map((experience) => (
                                    <li
                                      key={experience.name}
                                      className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-3"
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <span className="font-semibold text-white">
                                          Day {experience.day}: {experience.name}
                                        </span>
                                        <span className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                                          {experience.status}
                                        </span>
                                      </div>
                                      <p className="mt-1 text-xs text-slate-400">{experience.summary}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3 text-sm text-slate-300">
                              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                  Concierge notes
                                </span>
                                <span className="text-base font-semibold text-white">
                                  Est. trip investment ${proposal.travelPlan.totalTripEstimate.toLocaleString()}
                                </span>
                              </div>
                              <ul className="list-disc space-y-1 pl-4">
                                {proposal.matchedReasons.map((reason) => (
                                  <li key={reason}>{reason}</li>
                                ))}
                                {proposal.travelPlan.notes.map((note) => (
                                  <li key={note}>{note}</li>
                                ))}
                              </ul>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
                      Submit to generate tailored itineraries with bookings staged for you.
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && <p className="mt-4 rounded-lg border border-rose-500 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}

            <footer className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-xs text-slate-400">
                Data is encrypted in transit and purged automatically after bookings are finalised or within 30 days.
              </div>
              <div className="flex items-center gap-2">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                  >
                    Back
                  </button>
                )}
                {currentStep.key !== "review" && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                  >
                    Continue
                  </button>
                )}
                {currentStep.key === "review" && (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {proposals.length > 0 ? "Refresh recommendations" : loading ? "Submitting..." : "Submit details"}
                    </button>
                    <button
                      type="button"
                      onClick={resetPlanner}
                      className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                    >
                      Start over
                    </button>
                  </>
                )}
              </div>
            </footer>
          </form>

          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur">
              <h3 className="text-lg font-semibold text-white">How the concierge agent works</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>
                  <strong className="text-white">01. Intake & compliance</strong> — We collect personal data only to
                  coordinate travel logistics. Everything routes through GDPR and CCPA compliant storage.
                </li>
                <li>
                  <strong className="text-white">02. Matching intelligence</strong> — A scoring engine weighs climate,
                  activities, and budget against live availability to stage provisional holds.
                </li>
                <li>
                  <strong className="text-white">03. Human verification</strong> — A travel specialist confirms each
                  hold before charging anything to your preferred payment method.
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-300">
              <h4 className="text-base font-semibold text-white">Privacy promise</h4>
              <p className="mt-2">
                You can request deletion of your personal data at any time by emailing{" "}
                <a href="mailto:privacy@atlas-voyage.ai" className="text-emerald-300 underline">
                  privacy@atlas-voyage.ai
                </a>
                . We never share details with third parties beyond vetted travel suppliers necessary for fulfilling
                your trip.
              </p>
              <p className="mt-3">
                By submitting, you authorise Atlas Voyage to provisionally reserve accommodations and experiences that
                align with your profile. Payment is requested only after you approve the final summary.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  helper,
  children,
  required,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-200">
      <span className="flex items-center gap-2 text-sm font-medium text-white">
        {label}
        {required && <span className="rounded-full border border-slate-600 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-slate-300">Required</span>}
      </span>
      {helper && <span className="text-xs text-slate-400">{helper}</span>}
      {children}
    </label>
  );
}
