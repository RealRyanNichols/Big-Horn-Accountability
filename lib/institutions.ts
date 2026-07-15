export interface InstitutionGuide {
  name: string;
  jurisdiction: string;
  role: string;
  likelyRecords: string[];
  requestNote: string;
  officialUrl: string;
  sourceLabel: string;
}

export const institutionGuides: InstitutionGuide[] = [
  {
    name: "City of Hardin / Hardin Police Department",
    jurisdiction: "Municipal",
    role: "City governance and municipal law enforcement.",
    likelyRecords: ["Police policies and rosters", "Initial offense and arrest records originated by HPD", "City council minutes and contracts"],
    requestNote: "Ask the City to identify the originating or maintaining custodian for each record. Do not assume a county office owns city police media.",
    officialUrl: "https://www.hardinmt.com/",
    sourceLabel: "City of Hardin official website",
  },
  {
    name: "Big Horn County Sheriff",
    jurisdiction: "County",
    role: "County law enforcement and sheriff administration.",
    likelyRecords: ["Sheriff-originated incident and arrest records", "Office policies", "Public jail or enforcement information maintained by the sheriff"],
    requestNote: "Request only records the office originated or is authorized to maintain; separate sheriff, dispatch, detention, and city-police systems.",
    officialUrl: "https://www.bighorncountymt.gov/176/Sheriff",
    sourceLabel: "Big Horn County Sheriff directory",
  },
  {
    name: "Big Horn County Dispatch",
    jurisdiction: "County / intergovernmental",
    role: "Enhanced 911 public-safety answering point and dispatch operation.",
    likelyRecords: ["CAD event metadata", "911 records", "Radio and unit-status records", "Dispatch policies and agreements"],
    requestNote: "Confidential criminal-justice and private information may require redaction or separate legal process. A dispatch record is not automatically public in full.",
    officialUrl: "https://www.bighorncountymt.gov/241/Dispatch",
    sourceLabel: "Big Horn County Dispatch",
  },
  {
    name: "Big Horn County Detention",
    jurisdiction: "County",
    role: "Pretrial and sentenced detention facility.",
    likelyRecords: ["Public booking and release information", "Daily jail roster", "Facility policies", "Custody records subject to privacy limits"],
    requestNote: "Medical, safety, surveillance, and protected custody information can be restricted even when basic booking data is public.",
    officialUrl: "https://www.bighorncountymt.gov/239/Detention",
    sourceLabel: "Big Horn County Detention",
  },
  {
    name: "Big Horn County Attorney",
    jurisdiction: "County / state prosecution",
    role: "Prosecution and county legal office.",
    likelyRecords: ["Public filed charging documents", "Office policies", "Public correspondence and meeting materials subject to applicable exemptions"],
    requestNote: "A prosecutor’s discovery file is not converted into a public file by a records request. Court filings and public criminal-justice records follow their own rules.",
    officialUrl: "https://www.bighorncountymt.gov/163/County-Attorney",
    sourceLabel: "Big Horn County Attorney directory",
  },
  {
    name: "Big Horn County Justice Court",
    jurisdiction: "Montana judiciary",
    role: "Court of limited jurisdiction handling criminal, traffic, protection-order, and civil matters within its authority.",
    likelyRecords: ["Registers of action", "Filed complaints and orders", "Public hearing calendars", "Court audio and copies under court rules"],
    requestNote: "Request certified dockets and signed orders when a disposition matters. A complaint entry alone does not show the outcome.",
    officialUrl: "https://www.bighorncountymt.gov/172/Justice-Court",
    sourceLabel: "Big Horn County Justice Court",
  },
  {
    name: "Montana POST Council",
    jurisdiction: "State administrative oversight",
    role: "Public-safety officer standards, training, certification, and certification discipline.",
    likelyRecords: ["Council agendas and minutes", "Certification status", "Public disciplinary materials", "Complaint-process guidance"],
    requestNote: "Certification proceedings are administrative. A settlement, suspension, or revocation must not be described as a criminal conviction.",
    officialUrl: "https://dojmt.gov/post/",
    sourceLabel: "Montana Department of Justice — POST",
  },
  {
    name: "Montana Judicial Standards Commission",
    jurisdiction: "State judicial oversight",
    role: "Judicial-discipline process governed by Montana law and Commission rules.",
    likelyRecords: ["Biennial reports", "Public discipline records", "Complaint rules and forms"],
    requestNote: "Many complaint materials are confidential. A listed dismissal is not discipline or proof of wrongdoing.",
    officialUrl: "https://courts.mt.gov/courts/boards/jud_stand_comm/",
    sourceLabel: "Montana Judicial Branch — Judicial Standards Commission",
  },
  {
    name: "Crow Tribal Government and courts",
    jurisdiction: "Tribal sovereign",
    role: "Distinct sovereign government and judicial institutions on the Crow Reservation.",
    likelyRecords: ["Records identified as public under tribal law or policy", "Public tribal court rules and opinions", "Legislative and executive materials made public by the Tribe"],
    requestNote: "Montana public-record law does not automatically govern a tribal sovereign. Confirm the correct tribal law, forum, custodian, and any waiver before sending a request.",
    officialUrl: "https://www.crow-nsn.gov/",
    sourceLabel: "Crow Tribe official website",
  },
  {
    name: "U.S. District Court for the District of Montana",
    jurisdiction: "Federal judiciary",
    role: "Federal trial court, including civil-rights cases under federal law.",
    likelyRecords: ["Dockets", "Filed pleadings", "Orders and judgments", "Hearing and appellate references"],
    requestNote: "Use the live PACER docket for current posture. Free docket mirrors can lag and should be labeled as mirrors.",
    officialUrl: "https://pacer.uscourts.gov/",
    sourceLabel: "Public Access to Court Electronic Records",
  },
];

export const oversightRoutes = [
  {
    topic: "Montana peace-officer certification",
    authority: "Montana POST Council",
    canHandle: "Certification, training, employment-history records maintained by POST, and certification discipline.",
    limit: "POST action is administrative; it does not replace a criminal, civil, labor, or agency complaint process.",
    url: "https://dojmt.gov/post/forms-and-other-documents/",
  },
  {
    topic: "Judicial conduct",
    authority: "Montana Judicial Standards Commission",
    canHandle: "Complaints within the Commission’s authority over Montana judicial officers.",
    limit: "A complaint is not discipline. Many complaint materials remain confidential unless the process reaches a public stage.",
    url: "https://courts.mt.gov/courts/boards/jud_stand_comm/",
  },
  {
    topic: "Attorney discipline",
    authority: "Montana Office of Disciplinary Counsel",
    canHandle: "Professional-discipline grievances involving Montana lawyers.",
    limit: "ODC says it cannot handle grievances against judges, police, probation officers, or general discrimination claims.",
    url: "https://montanaodc.org/filing-a-grievance",
  },
  {
    topic: "Campaign, lobbying, and covered ethics matters",
    authority: "Montana Commissioner of Political Practices",
    canHandle: "Formal complaints within COPP’s statutory campaign, lobbying, and ethics jurisdiction.",
    limit: "A docketed complaint is an allegation, not an ethics violation; use the final decision docket for outcomes.",
    url: "https://politicalpractices.mt.gov/Home/Ethics",
  },
  {
    topic: "Federal civil-rights reporting",
    authority: "U.S. DOJ Civil Rights Division / FBI",
    canHandle: "Reports of potential federal civil-rights violations and color-of-law crimes within federal jurisdiction.",
    limit: "Submitting a report does not establish an investigation, violation, charge, or entitlement to a particular outcome.",
    url: "https://civilrights.justice.gov/",
  },
  {
    topic: "BIA or tribal law-enforcement administrative misconduct",
    authority: "BIA Office of Justice Services — Internal Affairs",
    canHandle: "Administrative misconduct matters involving BIA and tribal law-enforcement personnel in Indian Country within OJS authority.",
    limit: "Confirm employer, commissioning authority, land status, contract/compact structure, and the proper sovereign forum before routing.",
    url: "https://www.bia.gov/bia/ojs/internal-affairs-division",
  },
  {
    topic: "Local-government and federal-award audits",
    authority: "Montana LGSB / Federal Audit Clearinghouse",
    canHandle: "Published financial reports, Single Audits, findings, questioned costs, and corrective-action materials.",
    limit: "An audit finding is not automatically proof of fraud or intentional wrongdoing; read management response and follow-up status.",
    url: "https://sfsd.mt.gov/LGSB",
  },
] as const;
