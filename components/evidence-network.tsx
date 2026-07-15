"use client";

import {
  ArrowUpRight,
  CalendarRange,
  Info,
  Network,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { InvestigationTheme, LedgerRecord } from "@/lib/records";

interface EvidenceNetworkProps {
  records: LedgerRecord[];
}

type ThemeSelection = InvestigationTheme | "All topics";

const themeOrder: InvestigationTheme[] = [
  "Law enforcement & courts",
  "Detention & custody",
  "Public money & audits",
  "Civil & voting rights",
  "MMIP & death investigations",
  "Government operations",
];

const themeMeta: Record<InvestigationTheme, { short: string; color: string }> = {
  "Law enforcement & courts": { short: "Law + courts", color: "#4f8f78" },
  "Detention & custody": { short: "Custody", color: "#c18d3f" },
  "Public money & audits": { short: "Public money", color: "#5f7fa0" },
  "Civil & voting rights": { short: "Civil rights", color: "#9b655d" },
  "MMIP & death investigations": { short: "MMIP", color: "#846a9c" },
  "Government operations": { short: "Operations", color: "#6c7669" },
};

const normalizeInstitution = (name: string) => {
  if (name === "Federal Bureau of Investigation") return "FBI";
  if (name === "Big Horn County court system") return "Big Horn County courts";
  return name;
};

// The ledger stores a reviewed composite institution label. Keep it intact here rather
// than inferring a relationship between the individual names inside that label.
const institutionsFor = (record: LedgerRecord) => [normalizeInstitution(record.institution)];

const compactLabel = (name: string) => {
  const fixed: Record<string, string> = {
    "Hardin Police Department": "HPD",
    "Big Horn County Sheriff": "Sheriff",
    "Big Horn County courts": "County courts",
    "Big Horn County Justice Court": "Justice Court",
    "Big Horn County Jail": "County jail",
    "Big Horn County government and local school boards": "County + schools",
    "Bureau of Indian Affairs": "BIA",
    "U.S. Attorney’s Office": "U.S. Attorney",
    "U.S. District Court": "Federal court",
    "Judicial Standards Commission": "Judicial Standards",
    "Montana Native Women’s Coalition": "Native Women’s Coalition",
    "Crow Historic Preservation Office": "Crow Preservation",
    "Crow/Northern Cheyenne Hospital": "C–NC Hospital",
    "Rocky Mountain Regional Detention Facility": "Regional jail",
  };
  return fixed[name] ?? (name.length > 20 ? `${name.slice(0, 18)}…` : name);
};

function plural(value: number, singular: string, pluralForm = `${singular}s`) {
  return `${value} ${value === 1 ? singular : pluralForm}`;
}

export function EvidenceNetwork({ records }: EvidenceNetworkProps) {
  const minYear = Math.min(...records.map((record) => record.year));
  const maxYear = Math.max(...records.map((record) => record.year));
  const [year, setYear] = useState(maxYear);
  const [theme, setTheme] = useState<ThemeSelection>("All topics");
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [hoveredInstitution, setHoveredInstitution] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setYear((current) => {
        if (current >= maxYear) {
          setIsPlaying(false);
          return maxYear;
        }
        return current + 1;
      });
    }, 620);
    return () => window.clearInterval(timer);
  }, [isPlaying, maxYear]);

  const filteredRecords = useMemo(
    () => records.filter((record) => record.year <= year && (theme === "All topics" || record.theme === theme)),
    [records, theme, year],
  );

  const network = useMemo(() => {
    const allInstitutions = Array.from(new Set(records.flatMap(institutionsFor))).sort();
    const themePositions = new Map(
      themeOrder.map((themeName, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / themeOrder.length;
        return [themeName, { x: 500 + Math.cos(angle) * 150, y: 350 + Math.sin(angle) * 150, angle }] as const;
      }),
    );

    // Alphabetical placement is deliberately neutral: spatial proximity is not an
    // editorial claim about institutional ownership, coordination, or responsibility.
    const nodes = allInstitutions.map((institution, index) => {
      const angle = -Math.PI / 2 + (index * Math.PI * 2) / allInstitutions.length;
      const radius = index % 2 === 0 ? 274 : 324;
      return {
        name: institution,
        x: 500 + Math.cos(angle) * radius,
        y: 350 + Math.sin(angle) * radius,
      };
    });

    return { nodes, themePositions };
  }, [records]);

  const activeInstitutionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    filteredRecords.forEach((record) => {
      institutionsFor(record).forEach((institution) => counts.set(institution, (counts.get(institution) ?? 0) + 1));
    });
    return counts;
  }, [filteredRecords]);

  const activeEdges = useMemo(() => {
    const counts = new Map<string, number>();
    filteredRecords.forEach((record) => {
      institutionsFor(record).forEach((institution) => {
        const key = `${record.theme}|||${institution}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      });
    });
    return Array.from(counts, ([key, count]) => {
      const [themeName, institution] = key.split("|||") as [InvestigationTheme, string];
      return { theme: themeName, institution, count };
    });
  }, [filteredRecords]);

  const selectedRecords = useMemo(() => {
    if (!selectedInstitution) return [];
    return filteredRecords.filter((record) => institutionsFor(record).includes(selectedInstitution));
  }, [filteredRecords, selectedInstitution]);

  const reviewedCount = filteredRecords.filter((record) => record.publicationState === "Reviewed").length;
  const docketCount = filteredRecords.length - reviewedCount;

  const inspectedInstitution = hoveredInstitution ?? selectedInstitution;
  const institutionNode = inspectedInstitution
    ? network.nodes.find((node) => node.name === inspectedInstitution)
    : null;

  const reset = () => {
    setYear(maxYear);
    setTheme("All topics");
    setSelectedInstitution(null);
    setIsPlaying(false);
  };

  const beginPlayback = () => {
    if (year >= maxYear) setYear(minYear);
    setIsPlaying(true);
  };

  return (
    <section className="network-section" aria-labelledby="evidence-map-title">
      <div className="shell">
        <div className="network-heading">
          <div>
            <p className="eyebrow"><Network size={15} /> Interactive evidence map</p>
            <h2 id="evidence-map-title">See where the records touch institutions.</h2>
          </div>
          <p>
            Move through four decades, isolate a topic, and select an institution label to inspect every ledger record behind its line.
          </p>
        </div>

        <div className="network-shell">
          <div className="network-workspace">
            <div className="network-toolbar" aria-label="Evidence map controls">
              <div className="network-thread-controls" role="group" aria-label="Filter map by editorial topic">
                <button
                  type="button"
                  className={theme === "All topics" ? "active" : undefined}
                  onClick={() => setTheme("All topics")}
                  aria-pressed={theme === "All topics"}
                >
                  All topics
                </button>
                {themeOrder.map((item) => (
                  <button
                    type="button"
                    className={theme === item ? "active" : undefined}
                    style={{ "--thread-color": themeMeta[item].color } as CSSProperties}
                    onClick={() => setTheme(item)}
                    aria-pressed={theme === item}
                    key={item}
                  >
                    <span />{themeMeta[item].short}
                  </button>
                ))}
              </div>

              <div className="network-time-control">
                <button
                  type="button"
                  className="network-play"
                  onClick={() => (isPlaying ? setIsPlaying(false) : beginPlayback())}
                  aria-label={isPlaying ? "Pause timeline" : "Play timeline from the beginning"}
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <CalendarRange size={16} />
                <label htmlFor="network-year">Through <strong>{year}</strong></label>
                <input
                  id="network-year"
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={year}
                  onChange={(event) => {
                    setYear(Number(event.target.value));
                    setIsPlaying(false);
                  }}
                />
                <button type="button" className="network-reset" onClick={reset}><RotateCcw size={14} /> Reset</button>
              </div>
            </div>

            <div className="network-canvas-wrap">
              <svg
                className="network-canvas"
                viewBox="0 0 1000 700"
                role="img"
                aria-labelledby="network-svg-title network-svg-desc"
              >
                <title id="network-svg-title">Network of ledger records, editorial topics, and composite institution labels</title>
                <desc id="network-svg-desc">
                  Six colored topic hubs connect to composite institution labels in ledger records through {year}. Select an institution label using the map or institution index to inspect its records.
                </desc>
                <defs>
                  <radialGradient id="networkGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f8f1e3" stopOpacity=".92" />
                    <stop offset="65%" stopColor="#f1f2eb" stopOpacity=".36" />
                    <stop offset="100%" stopColor="#f1f2eb" stopOpacity="0" />
                  </radialGradient>
                  <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#102c24" floodOpacity=".18" />
                  </filter>
                  <pattern id="mapGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="#143f33" opacity=".08" />
                  </pattern>
                </defs>
                <rect width="1000" height="700" rx="22" fill="url(#mapGrid)" />
                <circle cx="500" cy="350" r="238" fill="none" stroke="#143f33" strokeOpacity=".08" />
                <circle cx="500" cy="350" r="326" fill="none" stroke="#143f33" strokeOpacity=".055" />
                <circle cx="500" cy="350" r="230" fill="url(#networkGlow)" />

                <g className="network-edges" aria-hidden="true">
                  {activeEdges.map((edge) => {
                    const from = network.themePositions.get(edge.theme)!;
                    const to = network.nodes.find((node) => node.name === edge.institution)!;
                    const emphasized = !inspectedInstitution || inspectedInstitution === edge.institution;
                    return (
                      <path
                        key={`${edge.theme}-${edge.institution}`}
                        d={`M ${from.x} ${from.y} Q 500 350 ${to.x} ${to.y}`}
                        stroke={themeMeta[edge.theme].color}
                        strokeWidth={Math.min(5, 1.2 + edge.count * 0.8)}
                        opacity={emphasized ? 0.58 : 0.07}
                        className={emphasized ? "network-edge active" : "network-edge"}
                      />
                    );
                  })}
                </g>

                <g className="network-center" aria-hidden="true">
                  <circle cx="500" cy="350" r="69" fill="#112f27" filter="url(#nodeShadow)" />
                  <circle cx="500" cy="350" r="58" fill="none" stroke="#d6b36f" strokeOpacity=".45" />
                  <text x="500" y="338" textAnchor="middle" className="network-center-count">{filteredRecords.length}</text>
                  <text x="500" y="361" textAnchor="middle" className="network-center-label">LEDGER RECORDS</text>
                  <text x="500" y="379" textAnchor="middle" className="network-center-year">THROUGH {year}</text>
                </g>

                <g className="network-themes">
                  {themeOrder.map((item) => {
                    const position = network.themePositions.get(item)!;
                    const count = filteredRecords.filter((record) => record.theme === item).length;
                    const active = theme === "All topics" || theme === item;
                    return (
                      <g
                        key={item}
                        className={`network-theme-node${active ? " active" : ""}`}
                        transform={`translate(${position.x} ${position.y})`}
                        onClick={() => setTheme(theme === item ? "All topics" : item)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${themeMeta[item].short}: ${plural(count, "record")}. Select to filter.`}
                        aria-pressed={theme === item}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setTheme(theme === item ? "All topics" : item);
                          }
                        }}
                      >
                        <circle r="42" fill={themeMeta[item].color} opacity={active ? 1 : 0.16} filter={active ? "url(#nodeShadow)" : undefined} />
                        <text y="-3" textAnchor="middle" className="network-theme-count">{count}</text>
                        <text y="60" textAnchor="middle" className="network-theme-label">{themeMeta[item].short.toUpperCase()}</text>
                      </g>
                    );
                  })}
                </g>

                <g className="network-institutions">
                  {network.nodes.map((node) => {
                    const count = activeInstitutionCounts.get(node.name) ?? 0;
                    const selected = selectedInstitution === node.name;
                    const hovered = hoveredInstitution === node.name;
                    const visible = count > 0;
                    return (
                      <g
                        key={node.name}
                        transform={`translate(${node.x} ${node.y})`}
                        className={`network-institution-node${visible ? " active" : ""}${selected ? " selected" : ""}`}
                        onClick={() => visible && setSelectedInstitution(selected ? null : node.name)}
                        onMouseEnter={() => visible && setHoveredInstitution(node.name)}
                        onMouseLeave={() => setHoveredInstitution(null)}
                        onFocus={() => visible && setHoveredInstitution(node.name)}
                        onBlur={() => setHoveredInstitution(null)}
                        role="button"
                        tabIndex={visible ? 0 : -1}
                        aria-pressed={selected}
                        aria-label={`${node.name}: ${plural(count, "linked record")}. Select to inspect.`}
                        onKeyDown={(event) => {
                          if (visible && (event.key === "Enter" || event.key === " ")) {
                            event.preventDefault();
                            setSelectedInstitution(selected ? null : node.name);
                          }
                        }}
                      >
                        <circle className="institution-halo" r={selected || hovered ? 20 : 15} fill="#1f5b48" />
                        <circle r={selected || hovered ? 10 : 7} fill="#fffefa" stroke="#1f5b48" strokeWidth="3" />
                        <text
                          x={node.x < 500 ? -18 : 18}
                          y="4"
                          textAnchor={node.x < 500 ? "end" : "start"}
                          className="institution-node-label"
                        >
                          {compactLabel(node.name)}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {institutionNode && (
                  <g
                    className="network-hover-card"
                    transform={`translate(${Math.min(760, Math.max(70, institutionNode.x - 92))} ${Math.min(620, Math.max(35, institutionNode.y - 82))})`}
                    pointerEvents="none"
                  >
                    <rect width="184" height="52" rx="10" />
                    <text x="13" y="21">{compactLabel(institutionNode.name)}</text>
                    <text x="13" y="39">{plural(activeInstitutionCounts.get(institutionNode.name) ?? 0, "linked record")}</text>
                  </g>
                )}
              </svg>
              <div className="network-map-key" aria-hidden="true">
                <span><i className="hub" /> Topic hub</span>
                <span><i className="institution" /> Composite institution label</span>
                <span><i className="line" /> Ledger-record link</span>
              </div>
            </div>

            <div className="network-mobile-summary" aria-label="Explore ledger records by topic">
              <p>Explore the network by topic</p>
              <div>
                {themeOrder.map((item) => {
                  const count = filteredRecords.filter((record) => record.theme === item).length;
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setTheme(theme === item ? "All topics" : item)}
                      aria-pressed={theme === item}
                    >
                      <span style={{ background: themeMeta[item].color }} />
                      <strong>{themeMeta[item].short}</strong>
                      <small>{plural(count, "record")}</small>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="institution-index" aria-label="Active institutions in the evidence map">
              <div>
                <span>Institution index</span>
                <small>{activeInstitutionCounts.size} visible at this point in the timeline</small>
              </div>
              <div className="institution-chip-list">
                {Array.from(activeInstitutionCounts)
                  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
                  .map(([institution, count]) => (
                    <button
                      type="button"
                      key={institution}
                      className={selectedInstitution === institution ? "active" : undefined}
                      onClick={() => setSelectedInstitution(selectedInstitution === institution ? null : institution)}
                      aria-pressed={selectedInstitution === institution}
                    >
                      {institution}<span>{count}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <aside className="network-inspector" aria-live="polite">
            {selectedInstitution ? (
              <>
                <div className="inspector-kicker"><span /> Institution selected</div>
                <h3>{selectedInstitution}</h3>
                <p className="inspector-summary">
                  {plural(selectedRecords.length, "ledger record")} in the selected topic and timeline window.
                </p>
                <div className="inspector-records">
                  {selectedRecords.map((record) => (
                    <article key={record.id}>
                      <div>
                        <span style={{ background: themeMeta[record.theme].color }} />
                        <small>{record.date} · {record.status}</small>
                      </div>
                      <h4>{record.title}</h4>
                      <p>{record.whatItEstablishes}</p>
                      <div>
                        <a href={`/#${record.id}`}>Open ledger entry <ArrowUpRight size={13} /></a>
                        <span className={record.publicationState === "Reviewed" ? "source-reviewed" : "docket-needed"}>
                          {record.publicationState === "Reviewed" ? "Source reviewed" : "Docket needed"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="inspector-kicker"><Info size={14} /> How to read this</div>
                <h3>Connections are evidence links—not accusations.</h3>
                <p className="inspector-summary">
                  Each line means the displayed composite institution label appears in one or more records inside that editorial topic. Its weight grows with the number of linked records.
                </p>
                <dl className="network-readout">
                  <div><dt>Visible ledger records</dt><dd>{filteredRecords.length}</dd></div>
                  <div><dt>Source reviewed</dt><dd>{reviewedCount}</dd></div>
                  <div><dt>Current docket needed</dt><dd>{docketCount}</dd></div>
                  <div><dt>Institution labels</dt><dd>{activeInstitutionCounts.size}</dd></div>
                </dl>
                <div className="network-guardrail">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>The line we do not cross</strong>
                    <p>Proximity on this map does not establish coordination, guilt, corruption, or shared responsibility.</p>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
