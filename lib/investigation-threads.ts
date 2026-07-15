import { records, type InvestigationTheme, type LedgerRecord } from "@/lib/records";

export interface InvestigationThread {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  dateRange: string;
  dek: string;
  thesis: string;
  limit: string;
  theme: InvestigationTheme;
  recordIds: string[];
  prompt: string;
}

export const investigationThreads: InvestigationThread[] = [
  {
    id: "public-safety-friction",
    number: "01",
    eyebrow: "Police, courts, dispatch, and public leadership",
    title: "When public-safety systems collide",
    dateRange: "2003–2026",
    dek: "Defense judgments, civil-rights pleadings and resolutions, judicial-complaint dismissals, an officer-certification settlement, dispatch friction, and leadership litigation form a record that deserves to be read in sequence.",
    thesis:
      "The sources document multiple distinct public-safety disputes and proceedings across Hardin and the wider Big Horn region; they do not establish a single pattern or scheme.",
    limit:
      "Separate episodes cannot be treated as coordinated misconduct without evidence connecting the people, decisions, and intent.",
    theme: "Law enforcement & courts",
    recordIds: [
      "BHA-2003-003",
      "BHA-2010-001",
      "BHA-2013-001",
      "BHA-2016-001",
      "BHA-2022-001",
      "BHA-2022-002",
      "BHA-2023-001",
      "BHA-2023-003",
      "BHA-2024-001",
      "BHA-2024-002",
      "BHA-2024-003",
      "BHA-2024-005",
      "BHA-2025-001",
      "BHA-2026-001",
      "BHA-2026-002",
      "BHA-2026-003",
    ],
    prompt: "Follow the gap between allegation, administrative action, dismissal, and final judgment.",
  },
  {
    id: "custody",
    number: "02",
    eyebrow: "Detention, care, and constitutional claims",
    title: "What happens behind closed doors",
    dateRange: "1979–2021",
    dek: "Montana and federal courts have repeatedly been asked to review deaths, medical care, force, and living conditions connected to local custody.",
    thesis:
      "Deaths and allegations concerning medical care, force, and living conditions have generated litigation with materially different outcomes.",
    limit:
      "A claim surviving one stage is not a final finding; a government victory does not erase the historical allegation that brought the case to court.",
    theme: "Detention & custody",
    recordIds: ["BHA-1979-001", "BHA-2016-002", "BHA-2021-001"],
    prompt: "Read what the courts decided—and exactly what they did not decide.",
  },
  {
    id: "two-rivers",
    number: "03",
    eyebrow: "Debt, development, and the empty jail",
    title: "$27 million and an empty facility",
    dateRange: "2007–2009",
    dek: "Hardin’s detention project drew national attention after the facility opened without prisoners and the revenue bonds later defaulted.",
    thesis:
      "Official legislative material documents the project’s financing, regulatory mismatch, vacancy, and the public consequences of a failed operating plan.",
    limit:
      "The later American Police Force proposal did not become a completed operating agreement, and the reviewed record does not establish an adjudicated fraud finding.",
    theme: "Public money & audits",
    recordIds: ["BHA-2008-001"],
    prompt: "Trace the difference between a documented policy failure and an unproven criminal accusation.",
  },
  {
    id: "public-money",
    number: "04",
    eyebrow: "Audits, grants, and public trust",
    title: "What the audits, convictions, and findings show",
    dateRange: "1990–2025",
    dek: "Federal opinions, prosecutions, inspector-general reports, and Single Audits document specific convictions, audit deficiencies, and oversight findings across public, tribal, and federally funded entities.",
    thesis:
      "The set contains final convictions and official audit findings, each limited to its named person, entity, period, and legal label.",
    limit:
      "Questioned or unsupported costs are not automatically theft; each audit finding and criminal judgment must retain its own legal label.",
    theme: "Public money & audits",
    recordIds: [
      "BHA-1990-001",
      "BHA-1991-001",
      "BHA-1991-002",
      "BHA-2000-001",
      "BHA-2003-001",
      "BHA-2003-002",
      "BHA-2004-001",
      "BHA-2005-001",
      "BHA-2015-001",
      "BHA-2016-003",
      "BHA-2017-001",
      "BHA-2019-001",
      "BHA-2021-002",
      "BHA-2023-002",
      "BHA-2024-004",
      "BHA-2024-006",
      "BHA-2024-007",
      "BHA-2025-002",
      "BHA-2025-003",
      "BHA-2025-004",
      "BHA-2025-005",
      "BHA-2025-006",
      "BHA-2025-007",
    ],
    prompt: "Separate audit findings, corrective actions, and criminal judgments.",
  },
  {
    id: "civil-rights",
    number: "05",
    eyebrow: "Voting power and equal participation",
    title: "Who gets heard—and who gets represented",
    dateRange: "1986",
    dek: "A landmark federal voting-rights judgment found Big Horn County election systems unlawfully diluted Native voting strength.",
    thesis:
      "This is a final merits finding and an essential historical anchor for understanding historical public trust.",
    limit:
      "A historic judgment does not, by itself, prove that every later election or officeholder violated the law.",
    theme: "Civil & voting rights",
    recordIds: ["BHA-1986-001"],
    prompt: "Start with the court’s findings, then follow the remedial record.",
  },
  {
    id: "death-investigations",
    number: "06",
    eyebrow: "MMIP and the limits of official closure",
    title: "What official closure does—and does not—resolve",
    dateRange: "2019–2020",
    dek: "Federal no-charge decisions and civil litigation can close legal pathways while families and communities continue to seek a fuller account.",
    thesis:
      "The reviewed sources establish official decisions and procedural outcomes while preserving the distinction between legal sufficiency and public understanding.",
    limit:
      "A no-charge decision is not a conviction, but neither is it a factual finding resolving every disputed circumstance.",
    theme: "MMIP & death investigations",
    recordIds: ["BHA-2019-002", "BHA-2020-001"],
    prompt: "Read the stated reason for each decision and the questions left outside its scope.",
  },
];

const recordIndex = new Map(records.map((record) => [record.id, record]));

export function recordsForThread(thread: InvestigationThread): LedgerRecord[] {
  return thread.recordIds
    .map((id) => recordIndex.get(id))
    .filter((record): record is LedgerRecord => Boolean(record));
}
