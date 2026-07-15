export type RecordStatus =
  | "Administrative settlement"
  | "Audit finding"
  | "Claim survived this stage"
  | "Criminal conviction"
  | "Defendant prevailed"
  | "Filed allegation"
  | "Final merits finding"
  | "Dismissed"
  | "No-charge decision"
  | "Procedural ruling"
  | "Operational dispute"
  | "Leadership record"
  | "Stipulated dismissal";

export type InvestigationTheme =
  | "Law enforcement & courts"
  | "Detention & custody"
  | "Public money & audits"
  | "Civil & voting rights"
  | "MMIP & death investigations"
  | "Government operations";

export type SourceKind =
  | "Official agency record"
  | "Published opinion"
  | "Federal docket index"
  | "News report"
  | "Inspector General report"
  | "Legislative briefing"
  | "Court order";

export type PublicationState = "Reviewed" | "Current docket needed";

export interface LedgerSource {
  label: string;
  url: string;
  kind: SourceKind;
  checkedOn: string;
  note?: string;
}

export interface LedgerRecord {
  id: string;
  slug: string;
  title: string;
  date: string;
  year: number;
  place: string;
  institution: string;
  officialType: string;
  theme: InvestigationTheme;
  people: string[];
  status: RecordStatus;
  publicationState: PublicationState;
  summary: string;
  whatItEstablishes: string;
  whatItDoesNotEstablish: string;
  nextVerification?: string;
  tags: string[];
  sources: LedgerSource[];
}

export const records: LedgerRecord[] = [
  {
    id: "BHA-2023-001",
    slug: "montana-post-curtin-settlement",
    title: "Montana POST approved a settlement in a certification matter involving a former Hardin officer",
    date: "2023-12-06",
    year: 2023,
    place: "Hardin / Montana",
    institution: "Hardin Police Department / Montana POST",
    officialType: "Law enforcement",
    theme: "Law enforcement & courts",
    people: ["Calen Curtin"],
    status: "Administrative settlement",
    publicationState: "Reviewed",
    summary:
      "Montana POST meeting materials record allegations concerning two encounters, the City’s response, and a negotiated certification settlement. The Council approved two years of certification probation; the denial was stayed and certificate advancement was restricted during probation.",
    whatItEstablishes:
      "An administrative certification case existed and ended through a Council-approved settlement imposing two years of probation with the denial stayed.",
    whatItDoesNotEstablish:
      "The settlement is not a criminal conviction and is not a judicial finding that every allegation was true. The same transcript records the City’s position that the force was justified.",
    tags: ["POST", "certification", "use of force", "administrative record"],
    sources: [
      {
        label: "Montana POST Council meeting materials — December 6, 2023",
        url: "https://dojmt.gov/wp-content/uploads/12-6-23-Council-Meeting-Materials.pdf",
        kind: "Official agency record",
        checkedOn: "2026-07-14",
        note: "See the Curtin settlement transcript and quarterly case-status table in the compiled packet.",
      },
    ],
  },
  {
    id: "BHA-2022-002",
    slug: "curtin-misdemeanor-charges-dismissed",
    title: "News report says two misdemeanor charges against a former Hardin officer were dismissed with prejudice",
    date: "2022-08-18",
    year: 2022,
    place: "Hardin",
    institution: "Hardin Police Department / Big Horn County court system",
    officialType: "Law enforcement",
    theme: "Law enforcement & courts",
    people: ["Calen Curtin"],
    status: "Dismissed",
    publicationState: "Current docket needed",
    summary:
      "KTVQ reported that a district judge dismissed two misdemeanor charges arising from a March 2022 encounter.",
    whatItEstablishes:
      "A reputable local news report describes the charges and their dismissal with prejudice.",
    whatItDoesNotEstablish:
      "A dismissal is not a conviction and, without the order and full docket, this card does not characterize the underlying facts as proven or disproven.",
    nextVerification: "Obtain the signed dismissal order and certified register of actions before expanding this entry.",
    tags: ["criminal case", "dismissal", "use of force"],
    sources: [
      {
        label: "KTVQ / MTN News — Charges dropped against Hardin police officer",
        url: "https://www.ktvq.com/news/crime-watch/charges-dropped-against-hardin-police-officer",
        kind: "News report",
        checkedOn: "2026-07-14",
        note: "Secondary source; the underlying court order remains the preferred publication record.",
      },
    ],
  },
  {
    id: "BHA-2024-001",
    slug: "crooked-arm-v-city-of-hardin",
    title: "Federal civil-rights complaint filed against the City of Hardin and individual officers",
    date: "2024-05-17",
    year: 2024,
    place: "Hardin / U.S. District Court for the District of Montana",
    institution: "City of Hardin / Hardin Police Department",
    officialType: "Law enforcement and municipal government",
    theme: "Law enforcement & courts",
    people: ["Donald Babbin Jr.", "Calen Curtin"],
    status: "Filed allegation",
    publicationState: "Current docket needed",
    summary:
      "The public docket index records a federal 42 U.S.C. § 1983 complaint and a City answer in Crooked Arm v. City of Hardin, No. 1:24-cv-00054.",
    whatItEstablishes:
      "A lawsuit was filed and the indexed defendants included the City and named officers.",
    whatItDoesNotEstablish:
      "A complaint states allegations; it is not proof. The reviewed public mirror does not establish the present disposition.",
    nextVerification: "Retrieve the live PACER docket and controlling orders before describing the case as pending, settled, dismissed, or adjudicated.",
    tags: ["Section 1983", "federal court", "civil rights", "docket refresh"],
    sources: [
      {
        label: "Public federal docket index — Crooked Arm v. City of Hardin",
        url: "https://dockets.justia.com/docket/montana/mtdce/1%3A2024cv00054/76743",
        kind: "Federal docket index",
        checkedOn: "2026-07-14",
        note: "Mirror may lag PACER; current status must be confirmed from the live docket.",
      },
    ],
  },
  {
    id: "BHA-2025-001",
    slug: "bartel-v-middlestead",
    title: "Montana Supreme Court remanded sheriff-qualification litigation for further proceedings",
    date: "2025-09-03",
    year: 2025,
    place: "Big Horn County / Montana Supreme Court",
    institution: "Big Horn County Sheriff",
    officialType: "County law enforcement leadership",
    theme: "Law enforcement & courts",
    people: ["Jeramie Middlestead"],
    status: "Procedural ruling",
    publicationState: "Reviewed",
    summary:
      "In Bartel v. Middlestead, 2025 MT 195, the Montana Supreme Court held the case was not moot, affirmed denial of preliminary injunctive relief, and remanded unresolved claims.",
    whatItEstablishes:
      "The published opinion resolves mootness and preliminary-injunction issues and sends the remaining dispute back for further proceedings.",
    whatItDoesNotEstablish:
      "The opinion did not hold the sheriff ineligible and did not finally decide the underlying qualification claim.",
    nextVerification: "Obtain the post-remand district-court docket for the final disposition.",
    tags: ["election qualification", "sheriff", "Montana Supreme Court", "remand"],
    sources: [
      {
        label: "Bartel v. Middlestead, 2025 MT 195",
        url: "https://law.justia.com/cases/montana/supreme-court/2025/da-25-0175.html",
        kind: "Published opinion",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2024-002",
    slug: "judicial-standards-complaint-dismissed",
    title: "Judicial Standards Commission report lists a complaint involving the Big Horn County justice of the peace as dismissed",
    date: "2024-05-20",
    year: 2024,
    place: "Big Horn County / Montana",
    institution: "Big Horn County Justice Court / Judicial Standards Commission",
    officialType: "Judiciary",
    theme: "Law enforcement & courts",
    people: ["Ernie Bear Don’t Walk"],
    status: "Dismissed",
    publicationState: "Reviewed",
    summary:
      "The Commission’s 2023–2024 biennial report lists complaint 24-026 and records a unanimous dismissal on May 20, 2024.",
    whatItEstablishes:
      "A complaint was docketed and dismissed according to the Commission’s official report.",
    whatItDoesNotEstablish:
      "A dismissed complaint is not discipline, a finding of misconduct, or proof that the complaint’s allegations were true.",
    tags: ["judicial standards", "complaint", "dismissal", "justice court"],
    sources: [
      {
        label: "Montana Judicial Standards Commission 2023–2024 biennial report",
        url: "https://courts.mt.gov/courts/boards/2025_JSC-Report_69th-Leglislature.pdf",
        kind: "Official agency record",
        checkedOn: "2026-07-14",
        note: "The complaint disposition appears in the report’s complaint table.",
      },
    ],
  },
  {
    id: "BHA-2022-001",
    slug: "hardin-dispatch-service-interruption",
    title: "County dispatch temporarily stopped dispatching Hardin police during an intergovernmental dispute",
    date: "2022-03-08",
    year: 2022,
    place: "Hardin / Big Horn County",
    institution: "City of Hardin / Big Horn County Dispatch and Sheriff",
    officialType: "Intergovernmental public safety",
    theme: "Government operations",
    people: [],
    status: "Operational dispute",
    publicationState: "Reviewed",
    summary:
      "KTVQ reported that county dispatch stopped dispatching Hardin police for roughly a week while officials negotiated liability and performance terms.",
    whatItEstablishes:
      "Contemporaneous reporting documents a temporary dispatch-service interruption and the stated positions of city and county officials.",
    whatItDoesNotEstablish:
      "The report does not prove an ongoing feud, corruption, or a connection to any later incident.",
    tags: ["dispatch", "intergovernmental agreement", "public safety operations"],
    sources: [
      {
        label: "KTVQ — Hardin mayor hopeful agreement will restore police dispatch service",
        url: "https://www.ktvq.com/news/local-news/hardin-mayor-hopeful-a-liability-agreement-will-restore-city-police-dispatch-service-with-big-horn-county-sheriff",
        kind: "News report",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2026-001",
    slug: "gv-towing-v-city-of-hardin",
    title: "Federal civil-rights complaint filed by a towing company and individuals against the City of Hardin and its former police chief",
    date: "2026-04-23",
    year: 2026,
    place: "Hardin / U.S. District Court for the District of Montana",
    institution: "City of Hardin / Hardin Police Department",
    officialType: "Law enforcement and municipal government",
    theme: "Law enforcement & courts",
    people: ["Paul George Jr."],
    status: "Filed allegation",
    publicationState: "Current docket needed",
    summary:
      "The public docket index records a federal 42 U.S.C. § 1983 complaint in GV Towing, LLC et al. v. City of Hardin et al., No. 1:26-cv-00039.",
    whatItEstablishes:
      "A federal complaint was filed and the index identifies the City and former chief among the defendants.",
    whatItDoesNotEstablish:
      "The complaint’s allegations are not findings. The initial index does not establish the current case posture or merits.",
    nextVerification: "Retrieve the live PACER docket, answer, and any substantive orders before publishing a status beyond ‘filed.’",
    tags: ["Section 1983", "federal court", "records governance", "docket refresh"],
    sources: [
      {
        label: "Public federal docket index — GV Towing, LLC v. City of Hardin",
        url: "https://dockets.justia.com/docket/montana/mtdce/1%3A2026cv00039/84720",
        kind: "Federal docket index",
        checkedOn: "2026-07-14",
        note: "Mirror may lag PACER; current status must be confirmed from the live docket.",
      },
    ],
  },
  {
    id: "BHA-2026-002",
    slug: "hardin-chief-leadership-transition",
    title: "Official announcement documents the former Hardin police chief’s move to Bullhead City",
    date: "2026-03-26",
    year: 2026,
    place: "Hardin / Bullhead City, Arizona",
    institution: "Hardin Police Department",
    officialType: "Law enforcement leadership",
    theme: "Government operations",
    people: ["Paul George Jr."],
    status: "Leadership record",
    publicationState: "Reviewed",
    summary:
      "Bullhead City announced Paul George Jr.’s appointment on March 26, 2026, with an expected May 4 start, and identified him as Hardin police chief since 2023.",
    whatItEstablishes:
      "The dated government announcement documents a planned leadership transition and prior role.",
    whatItDoesNotEstablish:
      "A job transition is not evidence of wrongdoing and this record should not be presented as one.",
    tags: ["leadership", "employment record", "agency timeline"],
    sources: [
      {
        label: "Bullhead City — City hires new police chief",
        url: "https://www.bullheadcityaz.gov/news/posts/city-hires-new-police-chief/",
        kind: "Official agency record",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-1986-001",
    slug: "windy-boy-v-big-horn-county",
    title: "Federal court found Big Horn County election systems violated Section 2 of the Voting Rights Act",
    date: "1986-06-13",
    year: 1986,
    place: "Big Horn County / U.S. District Court for the District of Montana",
    institution: "Big Horn County government and local school boards",
    officialType: "Voting rights and local government",
    theme: "Civil & voting rights",
    people: [],
    status: "Final merits finding",
    publicationState: "Reviewed",
    summary:
      "In Windy Boy v. County of Big Horn, the court held that at-large commissioner and school-board election systems denied Native voters equal political opportunity under Section 2 and ordered district-based remedies.",
    whatItEstablishes:
      "A federal merits judgment found a Voting Rights Act violation and documented official interference with some Native citizens’ registration and voting rights.",
    whatItDoesNotEstablish:
      "The court expressly did not find a constitutional violation or award actual damages; Section 2 did not require proof of discriminatory intent.",
    tags: ["Voting Rights Act", "Native voting rights", "election districts", "final judgment"],
    sources: [
      {
        label: "Windy Boy v. County of Big Horn, 647 F. Supp. 1002",
        url: "https://static.case.law/f-supp/647/cases/1002-01.json",
        kind: "Published opinion",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-1979-001",
    slug: "pretty-on-top-v-city-of-hardin",
    title: "Montana Supreme Court entered judgment for Hardin in litigation over a Native man’s jail death",
    date: "1979-04-18",
    year: 1979,
    place: "Hardin / Montana Supreme Court",
    institution: "City of Hardin / Hardin jail",
    officialType: "Detention and wrongful-death litigation",
    theme: "Detention & custody",
    people: ["Melvin Pretty On Top"],
    status: "Defendant prevailed",
    publicationState: "Reviewed",
    summary:
      "The Montana Supreme Court affirmed summary judgment for the City and police chief in a negligence suit arising from Melvin Pretty On Top’s death in the Hardin jail.",
    whatItEstablishes:
      "The majority found no evidence that officials knew or should have known he was suicidal and no sufficient proximate-cause showing. The opinion also recorded that most jail cases were alcohol-related and most prisoners were Native.",
    whatItDoesNotEstablish:
      "No City liability was found. A dissent’s concern that the jail operated as a de facto detoxification facility was not the court’s holding.",
    tags: ["jail death", "detention", "Native prisoners", "defense judgment"],
    sources: [
      {
        label: "Pretty On Top v. City of Hardin, 182 Mont. 311",
        url: "https://static.case.law/mont/182/cases/0311-01.json",
        kind: "Published opinion",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2016-001",
    slug: "estate-of-woody-v-big-horn-county",
    title: "Montana Supreme Court revived a wrongful-death suit arising from a fatal sheriff’s-deputy pursuit",
    date: "2016-07-26",
    year: 2016,
    place: "Big Horn County / Montana Supreme Court",
    institution: "Big Horn County Sheriff / Big Horn County",
    officialType: "Law-enforcement pursuit litigation",
    theme: "Law enforcement & courts",
    people: ["Kenneth Woody IV"],
    status: "Procedural ruling",
    publicationState: "Reviewed",
    summary:
      "The Montana Supreme Court reversed a limitations dismissal and remanded negligence and wrongful-death claims arising from Kenneth Woody IV’s death during a vehicle pursuit.",
    whatItEstablishes:
      "The estate’s administrative claim tolled the filing period, and the County’s failure to deny it meant the statutory filing window had not begun.",
    whatItDoesNotEstablish:
      "The Supreme Court did not decide whether the deputy or County was negligent. The later merits outcome remains unverified.",
    nextVerification: "Obtain the post-remand district-court docket and final disposition.",
    tags: ["vehicle pursuit", "wrongful death", "Montana Supreme Court", "remand"],
    sources: [
      {
        label: "Estate of Woody v. Big Horn County, 2016 MT 180",
        url: "https://static.case.law/mont/384/cases/0185-01.json",
        kind: "Published opinion",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2016-002",
    slug: "matthew-v-big-horn-county-jail",
    title: "Federal court allowed multiple Big Horn County jail-condition claims to continue past summary judgment",
    date: "2016-09-28",
    year: 2016,
    place: "Big Horn County / U.S. District Court for the District of Montana",
    institution: "Big Horn County Jail / Big Horn County",
    officialType: "Conditions-of-confinement litigation",
    theme: "Detention & custody",
    people: ["Lawrence Big Hair Simpson"],
    status: "Claim survived this stage",
    publicationState: "Current docket needed",
    summary:
      "Orders in Matthew v. Big Horn County Jail allowed multiple conditions and deliberate-indifference claims against County and jail defendants to continue while granting judgment to separate clinic defendants.",
    whatItEstablishes:
      "The court found that multiple jail claims could not be resolved against the plaintiff at dismissal or summary judgment on the record then before it.",
    whatItDoesNotEstablish:
      "Surviving a litigation stage is not a liability finding. The final disposition was not verified in the reviewed official documents.",
    nextVerification: "Refresh the complete federal docket and retrieve any settlement, judgment, or dismissal.",
    tags: ["jail conditions", "medical care", "overcrowding", "summary judgment"],
    sources: [
      {
        label: "January 25, 2016 federal order",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_15-cv-00038/pdf/USCOURTS-mtd-1_15-cv-00038-0.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
      {
        label: "September 28, 2016 federal order",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_15-cv-00038/pdf/USCOURTS-mtd-1_15-cv-00038-1.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2024-003",
    slug: "old-bull-v-united-states",
    title: "United States prevailed in federal litigation arising from a fatal Crow-area police pursuit",
    date: "2024-06-04",
    year: 2024,
    place: "Crow Reservation / U.S. District Court for the District of Montana",
    institution: "Crow Tribal Police / Bureau of Indian Affairs / United States",
    officialType: "Law-enforcement pursuit and Federal Tort Claims Act litigation",
    theme: "Law enforcement & courts",
    people: ["Braven Glenn"],
    status: "Defendant prevailed",
    publicationState: "Reviewed",
    summary:
      "A federal order describes the fatal 2020 pursuit of seventeen-year-old Braven Glenn and grants summary judgment to the United States on the estate’s FTCA negligence claims.",
    whatItEstablishes:
      "The court found the asserted federal theory lacked the required private-person analogue and that the evidence could not establish BIA response caused the death.",
    whatItDoesNotEstablish:
      "The ruling did not find that every aspect of the pursuit was proper; it held that the federal liability theory failed on the record presented.",
    tags: ["Crow Tribal Police", "BIA", "vehicle pursuit", "FTCA", "defense judgment"],
    sources: [
      {
        label: "Old Bull v. United States — June 4, 2024 order",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_22-cv-00109/pdf/USCOURTS-mtd-1_22-cv-00109-2.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2020-001",
    slug: "cole-v-oravec-bearcrane-investigation",
    title: "Bearcrane family’s equal-protection theory survived pleading; the action later ended by stipulated dismissal",
    date: "2020-06-16",
    year: 2020,
    place: "Crow Reservation / federal courts",
    institution: "Federal Bureau of Investigation / U.S. District Court",
    officialType: "Death-investigation and equal-protection litigation",
    theme: "MMIP & death investigations",
    people: ["Steven Bearcrane"],
    status: "Stipulated dismissal",
    publicationState: "Reviewed",
    summary:
      "The Ninth Circuit held that the Bearcrane family had sufficiently pleaded an equal-protection theory concerning an FBI death investigation. After further litigation, the remaining action was dismissed with prejudice by stipulation in 2020.",
    whatItEstablishes:
      "The allegations were legally sufficient to proceed at the pleading stage, and the later official order records a stipulated dismissal with prejudice.",
    whatItDoesNotEstablish:
      "The pleading decision was not a finding that discrimination occurred, and the dismissal order states no liability finding or admission.",
    tags: ["FBI", "death investigation", "equal protection", "stipulated dismissal"],
    sources: [
      {
        label: "Cole v. Oravec, 465 F. App’x 687",
        url: "https://static.case.law/f-appx/465/cases/0687-01.json",
        kind: "Published opinion",
        checkedOn: "2026-07-14",
      },
      {
        label: "June 16, 2020 stipulated-dismissal order",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_09-cv-00021/pdf/USCOURTS-mtd-1_09-cv-00021-21.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2008-001",
    slug: "two-rivers-detention-center-briefing",
    title: "State legislative briefing documented a $27 million Hardin detention project standing empty after being built outside correctional-facility requirements",
    date: "2008-01-10",
    year: 2008,
    place: "Hardin / Montana Legislature",
    institution: "Two Rivers Authority / City of Hardin",
    officialType: "Detention infrastructure and public finance",
    theme: "Public money & audits",
    people: [],
    status: "Operational dispute",
    publicationState: "Reviewed",
    summary:
      "A Montana Legislative Services briefing described the completed 464-bed facility as empty, financed by about $27 million in revenue bonds, and unable to house the out-of-state or federal felony population contemplated by its business plan.",
    whatItEstablishes:
      "The official briefing states that the facility was not built in compliance with state requirements for regional or private correctional facilities and faced a real possibility of bond default.",
    whatItDoesNotEstablish:
      "The briefing did not adjudicate fraud, corruption, or individual criminal liability; it also states that the City, County, and State were not obligated on the revenue bonds.",
    nextVerification: "Retrieve the bond official statement, default notices, final state-court docket, and current federal lease or operating agreement.",
    tags: ["Two Rivers", "detention center", "revenue bonds", "public finance", "empty jail"],
    sources: [
      {
        label: "Montana Legislative Services — Hardin Detention Center Controversy",
        url: "https://archive.legmt.gov/content/Committees/Interim/2007_2008/law_justice/staff_reports/Hardin%20Det%20Facility.pdf",
        kind: "Legislative briefing",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2016-003",
    slug: "crow-transit-building-funds-oig",
    title: "Interior Inspector General confirmed misuse of a $2.56 million Crow transit-facility grant and a federal oversight failure",
    date: "2016-10-06",
    year: 2016,
    place: "Crow Reservation / Bureau of Indian Affairs",
    institution: "Crow Tribe / Bureau of Indian Affairs",
    officialType: "Federal grant and oversight investigation",
    theme: "Public money & audits",
    people: [],
    status: "Audit finding",
    publicationState: "Reviewed",
    summary:
      "DOI OIG reported that an independent review confirmed the Crow Tribe used a $2,564,045 transit-building grant to offset general operations and that responsible BIA officials failed to act or provide appropriate oversight.",
    whatItEstablishes:
      "A federal Inspector General investigation confirmed misuse of the specified grant and documented BIA knowledge and oversight failures.",
    whatItDoesNotEstablish:
      "The summary does not identify an individual criminal conviction or prove that every tribal or federal official participated in the misuse.",
    nextVerification: "Request the agency response, repayment or corrective-action history, and any referral or declination records.",
    tags: ["DOI OIG", "Crow Transit", "grant misuse", "BIA oversight", "federal funds"],
    sources: [
      {
        label: "DOI OIG — Investigation of Misuse of Crow Transit Building Funds",
        url: "https://www.doioig.gov/reports/investigation/investigation-misuse-crow-transit-building-funds-0",
        kind: "Inspector General report",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2023-002",
    slug: "crow-northern-cheyenne-hospital-background-check-audit",
    title: "HHS Inspector General found widespread background-check and supervision deficiencies at the Crow/Northern Cheyenne Hospital",
    date: "2023-04-21",
    year: 2023,
    place: "Crow Agency / Indian Health Service",
    institution: "Crow/Northern Cheyenne Hospital / Indian Health Service",
    officialType: "Federal health-facility compliance audit",
    theme: "Public money & audits",
    people: [],
    status: "Audit finding",
    publicationState: "Reviewed",
    summary:
      "HHS OIG found noncompliant background-investigation processes for 44 of 50 sampled staff and insufficient supervision documentation for 47 of 50 while investigations were pending. The current tracker lists three recommendations implemented and three still open.",
    whatItEstablishes:
      "The official audit found federal compliance failures and concluded that Indian children faced increased risk. IHS has implemented three recommendations; three supervision-related recommendations remain open.",
    whatItDoesNotEstablish:
      "The audit did not find that a sampled staff member harmed a child, and it was a federal IHS facility audit—not a finding against Big Horn County or tribal government.",
    nextVerification: "Monitor the OIG tracker for the three open recommendations; its next update was expected October 30, 2026 at the July review.",
    tags: ["HHS OIG", "IHS", "hospital", "background checks", "child safety", "corrective action"],
    sources: [
      {
        label: "HHS OIG Report A-02-21-02004 and recommendation tracker",
        url: "https://oig.hhs.gov/reports/all/2023/crownorthern-cheyenne-hospitalan-ihs-operated-health-facilitydid-not-timely-conduct-required-background-checks-of-staff-and-supervise-certain-staff/",
        kind: "Inspector General report",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2019-001",
    slug: "killsback-travel-fraud-sentence",
    title: "Former Northern Cheyenne president sentenced in federal court for travel-reimbursement fraud",
    date: "2019-12-12",
    year: 2019,
    place: "Northern Cheyenne Reservation / U.S. District Court",
    institution: "Northern Cheyenne Tribal Government / United States",
    officialType: "Federal program-fraud prosecution",
    theme: "Public money & audits",
    people: ["Lawrence Jace Killsback"],
    status: "Criminal conviction",
    publicationState: "Reviewed",
    summary:
      "The U.S. Attorney’s Office reported that former Northern Cheyenne Tribal President Lawrence Jace Killsback received six months in prison and was ordered to pay $25,092 restitution after a federal conviction involving false travel claims.",
    whatItEstablishes:
      "An official DOJ release records the conviction, sentence, and restitution order entered by the federal court.",
    whatItDoesNotEstablish:
      "The conviction concerns the specified travel-reimbursement conduct and does not establish wrongdoing by the Tribe generally or by unrelated officials.",
    tags: ["Northern Cheyenne", "travel fraud", "restitution", "federal conviction"],
    sources: [
      {
        label: "U.S. Attorney — Ex-Northern Cheyenne Tribal President sentenced",
        url: "https://www.justice.gov/usao-mt/pr/ex-northern-cheyenne-tribal-president-sentenced-six-months-prison-travel-fraud-scheme",
        kind: "Official agency record",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2019-002",
    slug: "henny-scott-no-federal-charges",
    title: "Federal prosecutors declined charges after the Henny Scott death investigation",
    date: "2019-08-22",
    year: 2019,
    place: "Northern Cheyenne Reservation",
    institution: "FBI / Bureau of Indian Affairs / U.S. Attorney’s Office",
    officialType: "Death investigation and charging decision",
    theme: "MMIP & death investigations",
    people: ["Henny Scott"],
    status: "No-charge decision",
    publicationState: "Reviewed",
    summary:
      "The U.S. Attorney’s Office announced it would not seek federal charges after an FBI and BIA investigation into fourteen-year-old Henny Scott’s death.",
    whatItEstablishes:
      "Federal prosecutors said they could not prove a federal crime and reported that the forensic examination found accidental death from hypothermia without significant trauma.",
    whatItDoesNotEstablish:
      "A federal declination does not erase family or public criticism of the response, but those concerns must not be presented as a homicide finding or proof of criminal neglect.",
    tags: ["Henny Scott", "MMIP", "FBI", "BIA", "charging declination"],
    sources: [
      {
        label: "U.S. Attorney — No Federal Charges to be Sought in Death of Henny Scott",
        url: "https://www.justice.gov/usao-mt/pr/no-federal-charges-be-sought-death-henny-scott",
        kind: "Official agency record",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2015-001",
    slug: "united-states-v-old-horn",
    title: "Ninth Circuit affirmed federal convictions in the Crow cultural-monitoring payment scheme",
    date: "2015-09-23",
    year: 2015,
    place: "Crow Reservation / Ninth Circuit",
    institution: "Crow Historic Preservation Office / United States",
    officialType: "Federal criminal prosecution and appeal",
    theme: "Public money & audits",
    people: ["Dale Drew Old Horn", "Allen Joseph Old Horn", "Shawn Talking Eagle Danforth"],
    status: "Criminal conviction",
    publicationState: "Reviewed",
    summary:
      "The Ninth Circuit affirmed convictions for mail fraud, conspiracy, theft from federally funded and tribal organizations, and related offenses arising from direct cultural-monitoring payments. District-court orders later ended each defendant’s probation early in January 2017.",
    whatItEstablishes:
      "The appellate court held that a rational jury could find the charged scheme and intent beyond a reasonable doubt; the record described more than $500,000 paid directly to monitors rather than the Tribe. Later orders establish that supervision ended early.",
    whatItDoesNotEstablish:
      "The convictions concern the named defendants and conduct in the case, not the Crow Tribe or every cultural-monitoring employee. The 2015 appellate memorandum is unpublished and should not be presented as precedential.",
    tags: ["Crow Tribe", "mail fraud", "tribal funds", "federal conviction", "Ninth Circuit"],
    sources: [
      {
        label: "Ninth Circuit memorandum — United States v. Old Horn",
        url: "https://cdn.ca9.uscourts.gov/datastore/memoranda/2015/09/23/14-30124.pdf",
        kind: "Published opinion",
        checkedOn: "2026-07-14",
        note: "Unpublished memorandum; use only as Ninth Circuit Rule 36-3 permits.",
      },
      {
        label: "District-court orders ending probation early — consolidated PDF 0",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_12-cr-00103/pdf/USCOURTS-mtd-1_12-cr-00103-0.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
      {
        label: "District-court orders ending probation early — consolidated PDF 1",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_12-cr-00103/pdf/USCOURTS-mtd-1_12-cr-00103-1.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
      {
        label: "District-court orders ending probation early — consolidated PDF 2",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_12-cr-00103/pdf/USCOURTS-mtd-1_12-cr-00103-2.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2021-001",
    slug: "morrison-detention-complaint-procedural-dismissal",
    title: "Federal jail-conditions complaint ended through a procedural dismissal without a merits finding",
    date: "2021-07-20",
    year: 2021,
    place: "Hardin / U.S. District Court for the District of Montana",
    institution: "Rocky Mountain Regional Detention Facility",
    officialType: "Detention conditions and federal civil-rights procedure",
    theme: "Detention & custody",
    people: ["James Morrison"],
    status: "Dismissed",
    publicationState: "Reviewed",
    summary:
      "A detainee filed a federal civil-rights complaint concerning the facility. The court dismissed under Rule 41(b) after the plaintiff did not comply with orders, provide required account statements, or keep a current address; defendants had not been served.",
    whatItEstablishes:
      "The order establishes why the federal case ended and that the court warned the plaintiff before dismissal.",
    whatItDoesNotEstablish:
      "The court did not decide whether the alleged conditions occurred, clear the facility on the merits, or find that the complaint was false.",
    tags: ["detention", "civil rights", "Rule 41(b)", "procedural dismissal", "no merits finding"],
    sources: [
      {
        label: "Morrison v. Rocky Mountain Regional Detention Facility — dismissal order",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_20-cv-00142/pdf/USCOURTS-mtd-1_20-cv-00142-0.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2017-001",
    slug: "maccatherine-federal-judgment",
    title: "Federal judgment records a guilty plea and restitution for embezzlement from a tribal organization",
    date: "2017-02-02",
    year: 2017,
    place: "Crow Reservation / U.S. District Court for the District of Montana",
    institution: "Crow Tribe / United States",
    officialType: "Federal prosecution involving tribal funds",
    theme: "Public money & audits",
    people: ["Karla Elizabeth MacCatherine"],
    status: "Criminal conviction",
    publicationState: "Reviewed",
    summary:
      "Karla Elizabeth MacCatherine pleaded guilty to embezzlement from an Indian tribal organization. The court imposed two years of probation and $30,000 restitution to the Crow Tribe.",
    whatItEstablishes:
      "The federal judgment establishes the guilty plea, sentence, restitution, and dismissal of a separate complaint on the government’s motion.",
    whatItDoesNotEstablish:
      "The judgment does not establish a particular public job title, does not implicate the Tribe as a whole, and does not show that probation remains active today.",
    tags: ["Crow Tribe", "embezzlement", "federal judgment", "restitution", "guilty plea"],
    sources: [
      {
        label: "United States v. MacCatherine — federal judgment",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_16-cr-00079/pdf/USCOURTS-mtd-1_16-cr-00079-2.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2021-002",
    slug: "montana-native-womens-coalition-judgments",
    title: "Federal judgments record distinct convictions and sentences in the Montana Native Women’s Coalition case",
    date: "2021-10-27",
    year: 2021,
    place: "Billings / U.S. District Court for the District of Montana",
    institution: "Montana Native Women’s Coalition / United States",
    officialType: "Federal grant-fund prosecution",
    theme: "Public money & audits",
    people: ["Meredith McConnell", "Barbara Mary Daychief", "Sheryl Lynn Lawrence"],
    status: "Criminal conviction",
    publicationState: "Reviewed",
    summary:
      "McConnell was convicted at trial and received four concurrent years of probation plus $29,114.14 restitution; the Ninth Circuit affirmed in an unpublished 2023 memorandum. Daychief and Lawrence pleaded guilty to theft of federal funds and received separate probation and restitution terms; Daychief’s probation ended early in 2022.",
    whatItEstablishes:
      "The judgments establish different offenses, adjudications, restitution amounts, and sentences for the three defendants, plus Daychief’s later early termination of probation and the affirmance of McConnell’s conviction and restitution.",
    whatItDoesNotEstablish:
      "The dispositions should not be collapsed into one loss figure or identical sentence. The McConnell memorandum is unpublished and nonprecedential, and the case involved a federally funded nonprofit—not a finding of police or public-official corruption.",
    tags: ["federal funds", "wire fraud", "restitution", "grant program", "separate dispositions"],
    sources: [
      {
        label: "Meredith McConnell — judgment",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_19-cr-00090/pdf/USCOURTS-mtd-1_19-cr-00090-27.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
      {
        label: "Ninth Circuit memorandum affirming McConnell conviction and restitution",
        url: "https://cdn.ca9.uscourts.gov/datastore/memoranda/2023/05/18/21-30224.pdf",
        kind: "Published opinion",
        checkedOn: "2026-07-14",
        note: "Unpublished, nonprecedential memorandum.",
      },
      {
        label: "Barbara Mary Daychief — judgment",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_19-cr-00090/pdf/USCOURTS-mtd-1_19-cr-00090-19.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
      {
        label: "Barbara Mary Daychief — early termination order",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_19-cr-00090/pdf/USCOURTS-mtd-1_19-cr-00090-31.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
      {
        label: "Sheryl Lynn Lawrence — judgment",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_19-cr-00090/pdf/USCOURTS-mtd-1_19-cr-00090-23.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
    ],
  },
  {
    id: "BHA-2024-004",
    slug: "brien-wire-fraud-judgment",
    title: "Federal judgment records wire-fraud plea, restitution, and dismissed counts in Crow payroll-check case",
    date: "2024-08-01",
    year: 2024,
    place: "Crow Reservation / U.S. District Court for the District of Montana",
    institution: "Crow Tribe / United States",
    officialType: "Federal prosecution involving tribal funds",
    theme: "Public money & audits",
    people: ["Jonathan Cleve Brien"],
    status: "Criminal conviction",
    publicationState: "Reviewed",
    summary:
      "Jonathan Cleve Brien pleaded guilty to two wire-fraud counts. The court imposed time served, three years of supervised release, and $6,236 restitution to the Crow Tribe; the remaining indictment counts were dismissed with prejudice on the government’s motion.",
    whatItEstablishes:
      "The judgment establishes the two convictions, sentence, restitution, and favorable disposition of the remaining counts.",
    whatItDoesNotEstablish:
      "The judgment does not establish that Brien held public or tribal office, and the original sentence does not prove his present supervision status.",
    tags: ["Crow Tribe", "wire fraud", "federal judgment", "dismissed counts", "restitution"],
    sources: [
      {
        label: "United States v. Brien — federal judgment",
        url: "https://www.govinfo.gov/content/pkg/USCOURTS-mtd-1_22-cr-00085/pdf/USCOURTS-mtd-1_22-cr-00085-1.pdf",
        kind: "Court order",
        checkedOn: "2026-07-14",
      },
    ],
  },
];

export const statusDefinitions: Record<RecordStatus, string> = {
  "Administrative settlement":
    "An agency and a subject resolved an administrative matter without a judicial merits trial.",
  "Audit finding":
    "An authorized auditor or inspector general documented a defined deficiency, questioned cost, misuse, or oversight failure.",
  "Claim survived this stage":
    "A court allowed a claim to continue at pleading, screening, or summary judgment; liability was not necessarily established.",
  "Criminal conviction":
    "A court entered a criminal conviction. The card remains limited to the named defendant, counts, and reviewed disposition.",
  "Defendant prevailed":
    "The identified defendant won the reviewed claim or case; the allegation must not be presented as proven.",
  "Filed allegation":
    "A complaint was filed. Its allegations are not treated as proven unless a later adjudication says so.",
  "Final merits finding":
    "A court or authorized agency reached a substantive determination after applying the governing legal standard.",
  Dismissed:
    "A complaint or charge ended without an adverse merits judgment. The reason and prejudice language matter.",
  "No-charge decision":
    "A prosecutor or authorized charging office announced that the reviewed evidence would not support charges.",
  "Procedural ruling":
    "A court resolved an interim or threshold question, not necessarily the underlying merits.",
  "Operational dispute":
    "A documented disagreement or service interruption between public institutions.",
  "Leadership record":
    "A neutral official record used to establish who served when; it is not misconduct evidence.",
  "Stipulated dismissal":
    "The parties ended the case by agreement. No admission or liability finding is implied unless the agreement says so.",
};

export const institutions = Array.from(new Set(records.map((record) => record.institution))).sort();
export const statuses = Array.from(new Set(records.map((record) => record.status))).sort();

export const themes = Array.from(new Set(records.map((record) => record.theme))).sort();

export const lastEditorialReview = "July 14, 2026";
