import { records, type LedgerRecord, type RecordStatus } from "@/lib/records";

export type ProfileKind = "Person" | "Institution";

export type ProfileRole =
  | "Police officer"
  | "Police leadership"
  | "Federal law enforcement"
  | "Sheriff"
  | "County commissioner"
  | "Judiciary"
  | "Tribal employee"
  | "Tribal finance official"
  | "Tribal executive"
  | "Municipal government"
  | "County government"
  | "Law enforcement agency"
  | "Detention"
  | "Tribal government"
  | "Federal agency"
  | "Federal employee"
  | "State oversight"
  | "Public health"
  | "Public finance";

export interface ProfileDefinition {
  slug: string;
  name: string;
  kind: ProfileKind;
  role: ProfileRole;
  jurisdiction: string;
  descriptor: string;
  scopeNote: string;
  recordIds: string[];
}

export interface EvidenceProfile extends ProfileDefinition {
  records: LedgerRecord[];
  statuses: RecordStatus[];
  firstYear: number;
  lastYear: number;
  posture: ProfilePosture;
}

export type ProfilePosture =
  | "Adjudicated or official outcome"
  | "Mixed record"
  | "Allegation only"
  | "Procedural or operational record"
  | "Context record";

const profileDefinitions: ProfileDefinition[] = [
  {
    slug: "calen-curtin",
    name: "Calen Curtin",
    kind: "Person",
    role: "Police officer",
    jurisdiction: "Hardin / Montana",
    descriptor: "Former Hardin officer named across an administrative certification matter, a reported criminal-case dismissal, and a federal civil complaint.",
    scopeNote: "The certification settlement is administrative, the reported charges were dismissed, and the later federal case ended through an accepted Rule 68 offer whose terms are not available in the reviewed docket.",
    recordIds: ["BHA-2023-001", "BHA-2022-002", "BHA-2024-001"],
  },
  {
    slug: "donald-babbin-jr",
    name: "Donald Babbin Jr.",
    kind: "Person",
    role: "Police leadership",
    jurisdiction: "Hardin / Montana",
    descriptor: "Former Hardin police chief named in Crooked Arm v. City of Hardin, which ended after the plaintiff accepted a Rule 68 offer of judgment.",
    scopeNote: "The docket establishes the procedural resolution but not the amount, terms, admission, or truth of the complaint allegations.",
    recordIds: ["BHA-2024-001"],
  },
  {
    slug: "paul-george-jr",
    name: "Paul George Jr.",
    kind: "Person",
    role: "Police leadership",
    jurisdiction: "Hardin / Bullhead City",
    descriptor: "Former Hardin police chief documented in a government leadership announcement and named in a later federal complaint index.",
    scopeNote: "A job transition is not misconduct evidence. The separately indexed federal complaint states allegations and requires a live docket before any merits description.",
    recordIds: ["BHA-2026-001", "BHA-2026-002"],
  },
  {
    slug: "jeramie-middlestead",
    name: "Jeramie Middlestead",
    kind: "Person",
    role: "Sheriff",
    jurisdiction: "Big Horn County",
    descriptor: "Big Horn County sheriff named in Montana Supreme Court litigation concerning qualification for office.",
    scopeNote: "The Supreme Court resolved procedural issues and remanded unresolved claims; it did not hold the sheriff ineligible.",
    recordIds: ["BHA-2025-001"],
  },
  {
    slug: "lawrence-pete-big-hair",
    name: "Lawrence Pete Big Hair",
    kind: "Person",
    role: "County commissioner",
    jurisdiction: "Big Horn County",
    descriptor: "Current District 2 county commissioner and former Big Horn County sheriff whose 2013 tribal-court charges were reported dismissed.",
    scopeNote: "The dismissal is documented by contemporaneous reporting, but the underlying tribal-court order remains sought. It is not evidence of current wrongdoing or a merits finding about the original allegations.",
    recordIds: ["BHA-2013-001"],
  },
  {
    slug: "ernie-bear-dont-walk",
    name: "Ernie Bear Don’t Walk",
    kind: "Person",
    role: "Judiciary",
    jurisdiction: "Big Horn County Justice Court",
    descriptor: "Justice of the peace identified in a Judicial Standards Commission biennial-report complaint table.",
    scopeNote: "The official report records that the complaint was dismissed. A dismissal is not discipline or a finding of misconduct.",
    recordIds: ["BHA-2024-002"],
  },
  {
    slug: "matthew-wald",
    name: "Matthew Wald",
    kind: "Person",
    role: "Judiciary",
    jurisdiction: "22nd Judicial District",
    descriptor: "Montana district judge identified in a Judicial Standards Commission biennial-report complaint table and the current official court roster.",
    scopeNote: "The Commission report records that complaint 24-067 was dismissed. Inclusion documents the disposition and current role; it is not discipline or a finding of misconduct.",
    recordIds: ["BHA-2024-005"],
  },
  {
    slug: "dale-drew-old-horn",
    name: "Dale Drew Old Horn",
    kind: "Person",
    role: "Tribal employee",
    jurisdiction: "Crow Reservation",
    descriptor: "Crow cultural monitor whose federal fraud and tribal-funds convictions were affirmed by the Ninth Circuit.",
    scopeNote: "The unpublished appellate memorandum affirms the named defendant’s convictions. It does not implicate the Crow Tribe generally and is not precedential except as Ninth Circuit Rule 36-3 permits.",
    recordIds: ["BHA-2015-001"],
  },
  {
    slug: "allen-joseph-old-horn",
    name: "Allen Joseph Old Horn",
    kind: "Person",
    role: "Tribal employee",
    jurisdiction: "Crow Reservation",
    descriptor: "Crow cultural monitor whose federal fraud, tribal-funds, extortion, and tax-fraud convictions were affirmed by the Ninth Circuit.",
    scopeNote: "The unpublished memorandum addresses the named defendant and the charged scheme only. It does not establish wrongdoing by the Crow Tribe or unrelated cultural-monitoring staff.",
    recordIds: ["BHA-2015-001"],
  },
  {
    slug: "shawn-talking-eagle-danforth",
    name: "Shawn Talking Eagle Danforth",
    kind: "Person",
    role: "Tribal employee",
    jurisdiction: "Crow Reservation",
    descriptor: "Crow cultural monitor whose federal fraud and tribal-funds convictions were affirmed by the Ninth Circuit.",
    scopeNote: "The unpublished appellate memorandum affirms the named defendant’s convictions. It does not implicate the Crow Tribe generally and is not precedential except as Ninth Circuit Rule 36-3 permits.",
    recordIds: ["BHA-2015-001"],
  },
  {
    slug: "lawrence-jace-killsback",
    name: "Lawrence Jace Killsback",
    kind: "Person",
    role: "Tribal executive",
    jurisdiction: "Northern Cheyenne Reservation",
    descriptor: "Former Northern Cheyenne Tribal President whose federal travel-reimbursement conviction and sentence were reported by the U.S. Attorney’s Office.",
    scopeNote: "The conviction is limited to the named defendant and specified conduct; it does not establish wrongdoing by the Tribe or unrelated officials.",
    recordIds: ["BHA-2019-001"],
  },
  {
    slug: "murrell-deela",
    name: "Murrell Deela",
    kind: "Person",
    role: "Federal law enforcement",
    jurisdiction: "Northern Cheyenne Reservation / BIA",
    descriptor: "Former Bureau of Indian Affairs officer who pleaded guilty to sexual abuse involving a minor and lying to federal investigators.",
    scopeNote: "The official source establishes the plea and official-capacity conduct. No official sentencing announcement was located at the July 15, 2026 review, and the record does not implicate unrelated personnel or the Tribe.",
    recordIds: ["BHA-2026-003"],
  },
  {
    slug: "clifford-g-birdinground",
    name: "Clifford G. Birdinground",
    kind: "Person",
    role: "Tribal executive",
    jurisdiction: "Crow Reservation",
    descriptor: "Former Crow Tribal Chairman whose federal bribery conviction, sentence, restitution, and unsuccessful plea-withdrawal appeal are documented in official records.",
    scopeNote: "The profile is limited to the count of conviction and reviewed disposition. Separate contractor payments not charged under the plea agreement are not presented as convictions.",
    recordIds: ["BHA-2004-001"],
  },
  {
    slug: "richard-real-bird",
    name: "Richard Real Bird",
    kind: "Person",
    role: "Tribal executive",
    jurisdiction: "Crow Reservation",
    descriptor: "Former Crow Tribal Chairman with two distinct federal conviction records affirmed by the Ninth Circuit in 1991.",
    scopeNote: "The bank-fraud case and Crow Tribal Housing Authority embezzlement case remain separate; neither record establishes present-day conduct or wrongdoing by the Tribe generally.",
    recordIds: ["BHA-1991-001", "BHA-1991-002"],
  },
  {
    slug: "kelly-passes",
    name: "Kelly Passes",
    kind: "Person",
    role: "Tribal finance official",
    jurisdiction: "Crow Reservation",
    descriptor: "Former Crow Tribe Finance Director whose conspiracy and obstruction pleas, sentence, and restitution were reported by the Interior Inspector General.",
    scopeNote: "The OIG report supplies a reporting-period date rather than the exact sentencing day. The profile does not assign criminal responsibility to every person or contract mentioned.",
    recordIds: ["BHA-2005-001"],
  },
  {
    slug: "charles-c-dillon",
    name: "Charles C. Dillon",
    kind: "Person",
    role: "Federal employee",
    jurisdiction: "Crow Agency / Bureau of Indian Affairs",
    descriptor: "Former BIA facilities supervisor whose bribery, wire-fraud, and false-statement pleas and sentence were reported by DOI OIG.",
    scopeNote: "Dillon was a federal facilities supervisor, not a police officer or elected official. The record is person-specific and does not establish current or agency-wide misconduct.",
    recordIds: ["BHA-2003-001"],
  },
  {
    slug: "emmett-old-bull",
    name: "Emmett Old Bull",
    kind: "Person",
    role: "Federal employee",
    jurisdiction: "Crow Agency / Bureau of Indian Affairs",
    descriptor: "Former BIA accounting technician whose illegal-gratuity plea, resignation, and probation sentence were reported by DOI OIG.",
    scopeNote: "Old Bull was an administrative federal employee, not law enforcement or elected leadership. The record does not establish broader agency misconduct.",
    recordIds: ["BHA-2003-002"],
  },
  {
    slug: "city-of-hardin",
    name: "City of Hardin",
    kind: "Institution",
    role: "Municipal government",
    jurisdiction: "Hardin, Montana",
    descriptor: "Municipal government appearing in reviewed records about detention, public-safety operations, civil litigation, and public finance.",
    scopeNote: "Records span different decades, actors, and legal standards. Their inclusion together establishes an institutional timeline, not a single continuing scheme.",
    recordIds: ["BHA-1979-001", "BHA-2008-001", "BHA-2022-001", "BHA-2024-001", "BHA-2026-001"],
  },
  {
    slug: "hardin-police-department",
    name: "Hardin Police Department",
    kind: "Institution",
    role: "Law enforcement agency",
    jurisdiction: "City of Hardin",
    descriptor: "Municipal police agency connected to reviewed administrative, operational, leadership, and court records.",
    scopeNote: "The profile separates settlements, dismissals, allegations, and neutral leadership records. Recurrence across records does not itself prove agency-wide misconduct.",
    recordIds: ["BHA-2022-001", "BHA-2022-002", "BHA-2023-001", "BHA-2024-001", "BHA-2026-001", "BHA-2026-002"],
  },
  {
    slug: "big-horn-county-government",
    name: "Big Horn County government",
    kind: "Institution",
    role: "County government",
    jurisdiction: "Big Horn County, Montana",
    descriptor: "County government connected to reviewed voting-rights, jail-conditions, law-enforcement-pursuit, and public-safety records.",
    scopeNote: "Each record has its own parties, period, outcome, and proof standard. This page is an index of those records, not a finding about every county office or employee.",
    recordIds: ["BHA-1986-001", "BHA-2010-001", "BHA-2013-001", "BHA-2016-001", "BHA-2016-002", "BHA-2022-001", "BHA-2023-003"],
  },
  {
    slug: "big-horn-county-sheriff",
    name: "Big Horn County Sheriff",
    kind: "Institution",
    role: "Law enforcement agency",
    jurisdiction: "Big Horn County, Montana",
    descriptor: "County law-enforcement office appearing in reviewed response, pursuit, dispatch, civil-rights, and sheriff-qualification records.",
    scopeNote: "The records include a defense judgment, a stipulated dismissal with unknown terms, and procedural rulings. Their recurrence does not itself establish agency-wide misconduct.",
    recordIds: ["BHA-2010-001", "BHA-2013-001", "BHA-2016-001", "BHA-2022-001", "BHA-2023-003", "BHA-2025-001"],
  },
  {
    slug: "big-horn-county-justice-court",
    name: "Big Horn County Justice Court",
    kind: "Institution",
    role: "Judiciary",
    jurisdiction: "Big Horn County, Montana",
    descriptor: "Court of limited jurisdiction represented here by an official judicial-complaint disposition record.",
    scopeNote: "The reviewed complaint was dismissed. Its presence documents process, not discipline or misconduct.",
    recordIds: ["BHA-2024-002"],
  },
  {
    slug: "twenty-second-judicial-district-court",
    name: "22nd Judicial District Court",
    kind: "Institution",
    role: "Judiciary",
    jurisdiction: "Big Horn, Carbon, and Stillwater Counties",
    descriptor: "Montana district court represented here by an official current-role roster and a dismissed Judicial Standards Commission complaint involving its judge.",
    scopeNote: "The linked Commission complaint was dismissed. This institutional page documents the source and disposition; it is not a court-wide or individual misconduct finding.",
    recordIds: ["BHA-2024-005"],
  },
  {
    slug: "big-horn-county-jail",
    name: "Big Horn County Jail",
    kind: "Institution",
    role: "Detention",
    jurisdiction: "Big Horn County, Montana",
    descriptor: "County detention institution named in federal conditions-of-confinement litigation.",
    scopeNote: "Several claims survived summary judgment, but the plaintiff later voluntarily dismissed the case without prejudice. Neither stage is a liability finding.",
    recordIds: ["BHA-2016-002"],
  },
  {
    slug: "rocky-mountain-regional-detention-facility",
    name: "Rocky Mountain Regional Detention Facility",
    kind: "Institution",
    role: "Detention",
    jurisdiction: "Hardin, Montana",
    descriptor: "Detention facility named in a federal civil-rights complaint that ended through procedural dismissal.",
    scopeNote: "The court did not decide the alleged conditions on the merits and did not find that the complaint was false.",
    recordIds: ["BHA-2021-001"],
  },
  {
    slug: "two-rivers-authority",
    name: "Two Rivers Authority",
    kind: "Institution",
    role: "Public finance",
    jurisdiction: "Hardin, Montana",
    descriptor: "Public-development authority connected to the reviewed legislative briefing on the Hardin detention project.",
    scopeNote: "The briefing documented design, financing, occupancy, and default concerns; it did not adjudicate fraud or individual criminal liability.",
    recordIds: ["BHA-2008-001"],
  },
  {
    slug: "crow-tribal-government",
    name: "Crow Tribal Government",
    kind: "Institution",
    role: "Tribal government",
    jurisdiction: "Crow Reservation",
    descriptor: "Tribal government and related offices appearing in reviewed grant-oversight and federal criminal records.",
    scopeNote: "The records are limited to specified programs, offices, and named defendants. They do not establish wrongdoing by the Tribe generally.",
    recordIds: ["BHA-1991-001", "BHA-1991-002", "BHA-2004-001", "BHA-2005-001", "BHA-2015-001", "BHA-2016-003", "BHA-2017-001", "BHA-2024-004", "BHA-2024-006"],
  },
  {
    slug: "northern-cheyenne-tribal-government",
    name: "Northern Cheyenne Tribal Government",
    kind: "Institution",
    role: "Tribal government",
    jurisdiction: "Northern Cheyenne Reservation",
    descriptor: "Tribal government connected to a reviewed federal conviction involving a former tribal president.",
    scopeNote: "The conviction concerns one named defendant and defined travel-reimbursement conduct, not the Tribe generally.",
    recordIds: ["BHA-2019-001"],
  },
  {
    slug: "crow-tribal-police",
    name: "Crow Tribal Police",
    kind: "Institution",
    role: "Law enforcement agency",
    jurisdiction: "Crow Reservation",
    descriptor: "Tribal police agency described in reviewed federal litigation arising from a fatal vehicle pursuit.",
    scopeNote: "The United States prevailed on the reviewed federal liability theory; the ruling did not find that every aspect of the pursuit was proper.",
    recordIds: ["BHA-2024-003"],
  },
  {
    slug: "bureau-of-indian-affairs",
    name: "Bureau of Indian Affairs",
    kind: "Institution",
    role: "Federal agency",
    jurisdiction: "Federal / Indian Country",
    descriptor: "Federal agency appearing in reviewed employee convictions, civil-rights and pursuit litigation, grant oversight, and a death-investigation charging decision.",
    scopeNote: "These records span distinct employees, programs, events, and legal standards. They do not establish a unified course of conduct or institutional guilt.",
    recordIds: ["BHA-2003-001", "BHA-2003-002", "BHA-2016-003", "BHA-2019-002", "BHA-2023-003", "BHA-2024-003", "BHA-2026-003"],
  },
  {
    slug: "federal-bureau-of-investigation",
    name: "Federal Bureau of Investigation",
    kind: "Institution",
    role: "Federal agency",
    jurisdiction: "Federal / Indian Country",
    descriptor: "Federal investigative agency named in reviewed equal-protection litigation and a separate no-charge death investigation.",
    scopeNote: "A pleading-stage decision and a charging declination are different outcomes and should not be collapsed into a merits finding.",
    recordIds: ["BHA-2019-002", "BHA-2020-001"],
  },
  {
    slug: "montana-post-council",
    name: "Montana POST Council",
    kind: "Institution",
    role: "State oversight",
    jurisdiction: "Montana",
    descriptor: "State public-safety certification body represented by a reviewed council settlement record.",
    scopeNote: "Certification proceedings are administrative. The reviewed settlement is not a criminal conviction or a judicial finding that every allegation was true.",
    recordIds: ["BHA-2023-001"],
  },
  {
    slug: "montana-judicial-standards-commission",
    name: "Montana Judicial Standards Commission",
    kind: "Institution",
    role: "State oversight",
    jurisdiction: "Montana",
    descriptor: "State judicial-discipline body represented by its official biennial complaint-disposition report.",
    scopeNote: "The reviewed report records a dismissal. Many underlying complaint materials remain confidential under the governing process.",
    recordIds: ["BHA-2024-002", "BHA-2024-005"],
  },
  {
    slug: "crow-northern-cheyenne-hospital",
    name: "Crow/Northern Cheyenne Hospital",
    kind: "Institution",
    role: "Public health",
    jurisdiction: "Crow Agency / Indian Health Service",
    descriptor: "Federal health facility reviewed in an HHS Inspector General background-check and supervision audit.",
    scopeNote: "The audit found compliance deficiencies and increased risk; it did not find that a sampled staff member harmed a child.",
    recordIds: ["BHA-2023-002"],
  },
];

const outcomeStatuses = new Set<RecordStatus>([
  "Administrative settlement",
  "Audit finding",
  "Criminal conviction",
  "Guilty plea",
  "Rule 68 judgment",
  "Defendant prevailed",
  "Dismissed",
  "Final merits finding",
  "No-charge decision",
  "Stipulated dismissal",
]);

const proceduralStatuses = new Set<RecordStatus>([
  "Claim survived this stage",
  "Operational dispute",
  "Procedural ruling",
]);

function derivePosture(linkedRecords: LedgerRecord[]): ProfilePosture {
  const statusSet = new Set(linkedRecords.map((record) => record.status));
  if (statusSet.size === 1 && statusSet.has("Filed allegation")) return "Allegation only";
  if (statusSet.size === 1 && statusSet.has("Leadership record")) return "Context record";
  const hasOutcome = linkedRecords.some((record) => outcomeStatuses.has(record.status));
  const hasInterim = linkedRecords.some(
    (record) => proceduralStatuses.has(record.status) || record.status === "Filed allegation" || record.status === "Leadership record",
  );
  if (hasOutcome && hasInterim) return "Mixed record";
  if (hasOutcome) return "Adjudicated or official outcome";
  if (hasInterim) return "Procedural or operational record";
  return "Context record";
}

const profileSlugs = new Set<string>();

export const profiles: EvidenceProfile[] = profileDefinitions.map((definition) => {
  if (profileSlugs.has(definition.slug)) {
    throw new Error(`Duplicate profile slug: ${definition.slug}`);
  }
  profileSlugs.add(definition.slug);

  const linkedRecords = definition.recordIds
    .map((id) => records.find((record) => record.id === id))
    .filter((record): record is LedgerRecord => Boolean(record))
    .sort((a, b) => b.date.localeCompare(a.date));
  if (linkedRecords.length !== definition.recordIds.length) {
    const foundIds = new Set(linkedRecords.map((record) => record.id));
    const missingIds = definition.recordIds.filter((id) => !foundIds.has(id));
    throw new Error(`Profile ${definition.slug} references missing records: ${missingIds.join(", ")}`);
  }
  const years = linkedRecords.map((record) => record.year);

  return {
    ...definition,
    records: linkedRecords,
    statuses: Array.from(new Set(linkedRecords.map((record) => record.status))).sort(),
    firstYear: Math.min(...years),
    lastYear: Math.max(...years),
    posture: derivePosture(linkedRecords),
  };
});

export const profileRoles = Array.from(new Set(profiles.map((profile) => profile.role))).sort();
export const profileStatuses = Array.from(new Set(profiles.flatMap((profile) => profile.statuses))).sort();

export function getProfile(slug: string) {
  return profiles.find((profile) => profile.slug === slug);
}

export function getProfilesForRecord(recordId: string) {
  return profiles.filter((profile) => profile.recordIds.includes(recordId));
}
