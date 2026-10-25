import { useMemo, useState } from "react"

type View = "hospital" | "patient" | "insurer" | "pipeline" | "model" | "sharing" | "audit"

const patients = [
  {
    id: "PM-10024",
    date: "18 Jun 2025",
    egfr: 27,
    trend: "↓ 8 in 90d",
    uacr: "284 mg/g",
    risk: "High",
    confidence: "High",
    status: "Awaiting review",
  },
  {
    id: "PM-10482",
    date: "17 Jun 2025",
    egfr: 41,
    trend: "↓ 4 in 90d",
    uacr: "118 mg/g",
    risk: "Medium",
    confidence: "Medium",
    status: "Follow-up required",
  },
  {
    id: "PM-10811",
    date: "15 Jun 2025",
    egfr: 36,
    trend: "— Stable",
    uacr: "92 mg/g",
    risk: "Medium",
    confidence: "Low",
    status: "Data correction",
  },
  {
    id: "PM-10207",
    date: "13 Jun 2025",
    egfr: 58,
    trend: "↑ 2 in 90d",
    uacr: "34 mg/g",
    risk: "Low",
    confidence: "High",
    status: "Reviewed",
  },
]

const nav = [
  ["hospital", "Clinical review", "pulse"],
  ["insurer", "Care management", "users"],
  ["pipeline", "Data pipeline", "flow"],
  ["model", "Model & features", "spark"],
  ["sharing", "Sharing policy", "shield"],
  ["audit", "Audit trail", "list"],
] as const

function Icon({ name, size = 18 }: { name: string size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    pulse: (
      <>
        <path d="M3 12h4l2-7 4 14 2-7h6" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M17 14c2.5.3 4 2 4 4.5" />
      </>
    ),
    flow: (
      <>
        <rect x="3" y="4" width="6" height="5" rx="1" />
        <rect x="15" y="15" width="6" height="5" rx="1" />
        <path d="M9 6.5h5a3 3 0 0 1 3 3V15M15 17.5H10a3 3 0 0 1-3-3V9" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.4 4.1L18 8.5l-4.6 1.4L12 14l-1.4-4.1L6 8.5l4.6-1.4L12 3Z" />
        <path d="m18.5 15 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4.5 6v5.5c0 4.4 3 7.7 7.5 9.5 4.5-1.8 7.5-5.1 7.5-9.5V6L12 3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    list: (
      <>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <circle cx="3.5" cy="6" r=".5" />
        <circle cx="3.5" cy="12" r=".5" />
        <circle cx="3.5" cy="18" r=".5" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    back: <path d="m15 18-6-6 6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    warning: (
      <>
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 9v5M12 17.5v.1" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.pulse}
    </svg>
  )
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode
  tone?: string
}) {
  return <span className={`badge ${tone}`}>{children}</span>
}

function Metric({
  label,
  value,
  note,
  tone,
}: {
  label: string
  value: string
  note: string
  tone?: string
}) {
  return (
    <div className="metric">
      <div className="metric-top">
        <span>{label}</span>
        <i className={tone || ""} />
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  )
}

function PageHeading({
  title,
  subtitle,
  eyebrow,
}: {
  title: string
  subtitle: string
  eyebrow?: string
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="heading-actions">
        <Badge tone="mint">SYNTHETIC DEMO DATA</Badge>
        <button className="secondary">Last 90 days⌄</button>
        <button className="primary">Refresh data</button>
      </div>
    </div>
  )
}

function Filters({
  search,
  setSearch,
}: {
  search?: string
  setSearch?: (v: string) => void
}) {
  return (
    <div className="filters">
      <label className="search">
        <Icon name="search" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch?.(e.target.value)}
          placeholder="Search patient ID"
        />
      </label>
      <button>Priority: All⌄</button>
      <button>Data quality: All⌄</button>
      <button>Status: All⌄</button>
      <span className="spacer" />
      <small>4 results</small>
    </div>
  )
}

function Hospital({ setView }: { setView: (v: View) => void }) {
  const [search, setSearch] = useState("")
  const rows = useMemo(
    () =>
      patients.filter((p) => p.id.toLowerCase().includes(search.toLowerCase())),
    [search],
  )
  return (
    <>
      <PageHeading
        title="Hospital Clinical Review"
        subtitle="Monitor CKD trends and prioritize cases for clinical review."
      />
      <div className="metrics five">
        <Metric
          label="Eligible CKD members"
          value="1,284"
          note="+32 this month"
        />
        <Metric
          label="Awaiting review"
          value="42"
          note="8 due today"
          tone="amber"
        />
        <Metric
          label="High-priority reviews"
          value="12"
          note="3 added today"
          tone="red"
        />
        <Metric
          label="Data quality warnings"
          value="17"
          note="1.3% of cohort"
          tone="amber"
        />
        <Metric label="Stale lab records" value="29" note="Over 90 days" />
      </div>
      <div className="dashboard-grid">
        <section className="card risk-card">
          <div className="card-head">
            <div>
              <h2>Review-priority distribution</h2>
              <p>Current eligible cohort</p>
            </div>
            <button className="icon-button">
              <Icon name="more" />
            </button>
          </div>
          <div className="donut-wrap">
            <div className="donut">
              <div>
                <strong>1,284</strong>
                <small>Members</small>
              </div>
            </div>
            <div className="legend">
              <span>
                <i className="low" />
                Low <b>866</b>
              </span>
              <span>
                <i className="medium" />
                Medium <b>326</b>
              </span>
              <span>
                <i className="high" />
                High <b>92</b>
              </span>
            </div>
          </div>
        </section>
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Laboratory data quality</h2>
              <p>Latest ingestion window</p>
            </div>
            <Badge tone="green">98.7% valid</Badge>
          </div>
          <div className="quality-bar">
            <i />
            <i />
            <i />
          </div>
          <div className="quality-list">
            <span>
              Valid records <b>2,418</b>
            </span>
            <span>
              Rejected <b>21</b>
            </span>
            <span>
              Missing values <b>11</b>
            </span>
            <span>
              Stale <b>29</b>
            </span>
          </div>
        </section>
        <section className="card activity">
          <div className="card-head">
            <div>
              <h2>Recent activity</h2>
              <p>Last 24 hours</p>
            </div>
            <button className="link">View all</button>
          </div>
          <ul>
            <li>
              <i className="event green" />
              <div>
                <b>128 new lab events validated</b>
                <span>12 minutes ago</span>
              </div>
            </li>
            <li>
              <i className="event amber" />
              <div>
                <b>4 validation failures quarantined</b>
                <span>38 minutes ago</span>
              </div>
            </li>
            <li>
              <i className="event blue" />
              <div>
                <b>Review completed for PM-10207</b>
                <span>1 hour ago</span>
              </div>
            </li>
          </ul>
        </section>
      </div>
      <section className="card table-card">
        <div className="card-head queue-head">
          <div>
            <h2>Clinical review queue</h2>
            <p>Prioritized by dated evidence, confidence, and review status</p>
          </div>
          <span className="updated">Updated 2 min ago</span>
        </div>
        <Filters search={search} setSearch={setSearch} />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Assessment</th>
                <th>Latest eGFR</th>
                <th>eGFR trend</th>
                <th>Latest UACR</th>
                <th>Review priority</th>
                <th>Data confidence</th>
                <th>Review status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.id} onClick={() => setView("patient")}>
                  <td>
                    <b>{p.id}</b>
                  </td>
                  <td>{p.date}</td>
                  <td>
                    <b>{p.egfr}</b> <small>mL/min</small>
                  </td>
                  <td className={p.trend.startsWith("↓") ? "down" : ""}>
                    {p.trend}
                  </td>
                  <td>{p.uacr}</td>
                  <td>
                    <Badge
                      tone={
                        p.risk === "High"
                          ? "red"
                          : p.risk === "Medium"
                            ? "amber"
                            : "green"
                      }
                    >
                      {p.risk}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      tone={
                        p.confidence === "High"
                          ? "green"
                          : p.confidence === "Medium"
                            ? "amber"
                            : "neutral"
                      }
                    >
                      {p.confidence}
                    </Badge>
                  </td>
                  <td>
                    <span className={`status-dot s${i}`} />
                    {p.status}
                  </td>
                  <td>
                    <Icon name="chevron" size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function Patient({ setView }: { setView: (v: View) => void }) {
  const [reviewed, setReviewed] = useState(false)
  return (
    <>
      <button className="back" onClick={() => setView("hospital")}>
        <Icon name="back" size={16} /> Back to review queue
      </button>
      <div className="patient-title">
        <div>
          <div className="eyebrow">PATIENT CLINICAL DETAIL</div>
          <h1>PM-10024</h1>
          <p>CKD cohort · Last assessment 18 Jun 2025</p>
        </div>
        <div className="patient-badges">
          <Badge tone={reviewed ? "green" : "amber"}>
            {reviewed ? "Reviewed" : "Awaiting review"}
          </Badge>
          <Badge tone="green">High data confidence</Badge>
        </div>
      </div>
      {reviewed && (
        <div className="success">
          <Icon name="check" /> Review completed and recorded in the audit trail
          at 10:42 AM.
        </div>
      )}
      <div className="detail-grid">
        <section className="card chart-card">
          <div className="card-head">
            <div>
              <h2>Laboratory trend analysis</h2>
              <p>Dated measurements from validated synthetic records</p>
            </div>
            <div className="tabs">
              <button className="active">eGFR</button>
              <button>Creatinine</button>
              <button>UACR</button>
            </div>
          </div>
          <div className="chart-legend">
            <span>
              <i />
              eGFR (mL/min/1.73m²)
            </span>
            <Badge tone="neutral">12 measurements</Badge>
          </div>
          <svg className="line-chart" viewBox="0 0 700 260">
            <g className="grid-lines">
              <path d="M48 20H680M48 75H680M48 130H680M48 185H680M48 235H680" />
            </g>
            <g className="axis-labels">
              <text x="12" y="25">
                60
              </text>
              <text x="12" y="80">
                50
              </text>
              <text x="12" y="135">
                40
              </text>
              <text x="12" y="190">
                30
              </text>
              <text x="12" y="240">
                20
              </text>
              <text x="48" y="258">
                Jul '24
              </text>
              <text x="190" y="258">
                Oct '24
              </text>
              <text x="340" y="258">
                Jan '25
              </text>
              <text x="500" y="258">
                Apr '25
              </text>
              <text x="635" y="258">
                Jun '25
              </text>
            </g>
            <path
              className="area"
              d="M55 50 140 68 220 82 300 102 380 120 460 146 540 165 610 190 670 205V235H55Z"
            />
            <path
              className="trend-line"
              d="M55 50 140 68 220 82 300 102 380 120 460 146 540 165 610 190 670 205"
            />
            {[
              [55, 50],
              [140, 68],
              [220, 82],
              [300, 102],
              [380, 120],
              [460, 146],
              [540, 165],
              [610, 190],
              [670, 205],
            ].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="5" />
            ))}
          </svg>
          <div className="chart-note">
            <Icon name="warning" size={16} />
            <span>
              <b>Downward trend observed:</b> eGFR decreased from 35 to 27
              across the last 90 days. Illustrative trend only; does not
              establish a diagnosis.
            </span>
          </div>
        </section>
        <aside className="card evidence">
          <div className="card-head">
            <div>
              <h2>Risk & evidence</h2>
              <p>Assessment summary</p>
            </div>
            <Badge tone="red">High priority</Badge>
          </div>
          <div className="demo-warning">
            Demo risk estimate — not clinically validated
          </div>
          <dl>
            <div>
              <dt>Assessment date</dt>
              <dd>18 Jun 2025</dd>
            </div>
            <div>
              <dt>Model version</dt>
              <dd>CKD-demo-v0.8</dd>
            </div>
            <div>
              <dt>Data confidence</dt>
              <dd>
                <Badge tone="green">High</Badge>
              </dd>
            </div>
          </dl>
          <h3>Evidence contributing to review</h3>
          <ul className="evidence-list">
            <li>eGFR declined across 3 consecutive dated measurements.</li>
            <li>Latest UACR remained elevated in the synthetic record.</li>
            <li>All contributing records passed validation checks.</li>
          </ul>
          <div className="limitation">
            <b>Uncertainty & limitations</b>
            <p>
              Prototype estimate for prioritization only. It is not a diagnosis
              or treatment recommendation.
            </p>
          </div>
        </aside>
        <section className="card data-panel">
          <div className="card-head">
            <div>
              <h2>Data quality</h2>
              <p>Evidence completeness and validity</p>
            </div>
            <Badge tone="green">No blocking issues</Badge>
          </div>
          <div className="quality-stats">
            <div>
              <span>Missing measurements</span>
              <b>0</b>
            </div>
            <div>
              <span>Duplicate records</span>
              <b>0</b>
            </div>
            <div>
              <span>Unit inconsistencies</span>
              <b>0</b>
            </div>
            <div>
              <span>Last valid measurement</span>
              <b>17 Jun 2025</b>
            </div>
          </div>
        </section>
        <section className="card actions">
          <div className="card-head">
            <div>
              <h2>Clinical review actions</h2>
              <p>Actions are timestamped and auditable</p>
            </div>
          </div>
          <textarea placeholder="Add a review note (required for escalation or follow-up)…" />
          <div className="action-row">
            <button
              className="primary"
              onClick={() => setReviewed(true)}
              disabled={reviewed}
            >
              <Icon name="check" size={16} />
              {reviewed ? "Reviewed" : "Mark as reviewed"}
            </button>
            <button className="secondary">Follow-up required</button>
            <button className="secondary">Request data correction</button>
            <button className="danger">Escalate</button>
          </div>
        </section>
      </div>
    </>
  )
}

function Insurer({ openDrawer }: { openDrawer: (title: string) => void }) {
  return (
    <>
      <PageHeading
        eyebrow="RESTRICTED CARE-MANAGEMENT VIEW"
        title="Insurer Care Management"
        subtitle="Review authorized cases and coordinate follow-up."
      />
      <div className="privacy-strip">
        <Icon name="shield" />
        <span>
          This view contains only policy-approved, minimum-necessary
          information. Full hospital records are not available.
        </span>
      </div>
      <div className="metrics five">
        <Metric label="Authorized cases" value="86" note="Current caseload" />
        <Metric
          label="Awaiting outreach"
          value="18"
          note="5 due today"
          tone="amber"
        />
        <Metric
          label="Follow-up in progress"
          value="31"
          note="Across 4 managers"
        />
        <Metric
          label="Follow-up completed"
          value="34"
          note="This month"
          tone="green"
        />
        <Metric
          label="Overdue follow-ups"
          value="3"
          note="Needs attention"
          tone="red"
        />
      </div>
      <section className="card table-card">
        <div className="card-head">
          <div>
            <h2>Care-management queue</h2>
            <p>Authorized cases only</p>
          </div>
          <Badge tone="navy">POLICY FILTERED</Badge>
        </div>
        <Filters />
        <table>
          <thead>
            <tr>
              <th>Approved member ref.</th>
              <th>Assessment</th>
              <th>Priority</th>
              <th>Approved evidence summary</th>
              <th>Care manager</th>
              <th>Follow-up due</th>
              <th>Outreach status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {[
              [
                "CM-70241",
                "18 Jun 2025",
                "High",
                "Declining renal function trend",
                "Jordan Lee",
                "20 Jun",
                "Awaiting outreach",
              ],
              [
                "CM-70882",
                "17 Jun 2025",
                "Medium",
                "Follow-up requested by hospital",
                "Unassigned",
                "24 Jun",
                "Not started",
              ],
              [
                "CM-70139",
                "15 Jun 2025",
                "Medium",
                "Repeat assessment recommended",
                "Sam Rivera",
                "19 Jun",
                "In progress",
              ],
              [
                "CM-70620",
                "12 Jun 2025",
                "Low",
                "Routine follow-up",
                "Jordan Lee",
                "28 Jun",
                "Completed",
              ],
            ].map((r, i) => (
              <tr key={r[0]} onClick={() => openDrawer(r[0])}>
                {r.map((c, j) => (
                  <td key={j}>
                    {j === 0 ? (
                      <b>{c}</b>
                    ) : j === 2 ? (
                      <Badge
                        tone={
                          c === "High"
                            ? "red"
                            : c === "Medium"
                              ? "amber"
                              : "green"
                        }
                      >
                        {c}
                      </Badge>
                    ) : (
                      c
                    )}
                  </td>
                ))}
                <td>
                  <Icon name="chevron" size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="disclaimer">
        Decision support only. Not an automated insurance coverage decision.
      </p>
    </>
  )
}

const stages = [
  "Synthetic lab feed",
  "Kafka / Airflow ingestion",
  "Data quality validation",
  "Iceberg storage",
  "Feature engineering",
  "Model scoring",
  "Hospital review queue",
]
function Pipeline({ openDrawer }: { openDrawer: (title: string) => void }) {
  return (
    <>
      <PageHeading
        title="Data Quality & Pipeline Monitoring"
        subtitle="Trace synthetic laboratory data from ingestion to clinical review."
      />
      <div className="metrics six">
        <Metric label="Events received" value="2,461" note="Last 24 hours" />
        <Metric
          label="Records validated"
          value="2,418"
          note="98.3%"
          tone="green"
        />
        <Metric
          label="Records rejected"
          value="21"
          note="Quarantined"
          tone="red"
        />
        <Metric
          label="Duplicate events"
          value="12"
          note="Not scored"
          tone="amber"
        />
        <Metric label="Stale records" value="29" note="Over 90 days" />
        <Metric label="Last success" value="10:36" note="4 minutes ago" />
      </div>
      <section className="card pipeline-card">
        <div className="card-head">
          <div>
            <h2>Longitudinal data pipeline</h2>
            <p>Rejected records are quarantined and never silently scored</p>
          </div>
          <Badge tone="green">All systems operational</Badge>
        </div>
        <div className="pipeline-flow">
          {stages.map((s, i) => (
            <button
              key={s}
              className={`stage ${i === 2 ? "warning" : ""}`}
              onClick={() => openDrawer(s)}
            >
              <span className="stage-icon">
                <Icon name={i === 2 ? "shield" : i === 6 ? "pulse" : "flow"} />
              </span>
              <b>{s}</b>
              <small>
                <i />
                {i === 2 ? "Warning" : "Healthy"}
              </small>
            </button>
          ))}
        </div>
      </section>
      <div className="split">
        <section className="card table-card">
          <div className="card-head">
            <div>
              <h2>Rejected records</h2>
              <p>Latest validation failures</p>
            </div>
            <button className="link">View quarantine</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Patient ID</th>
                <th>Received</th>
                <th>Rejection reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["EVT-92841", "PM-10992", "10:31", "Invalid measurement unit"],
                ["EVT-92833", "PM-10318", "10:24", "Duplicate event"],
                ["EVT-92818", "PM-10172", "10:08", "Out-of-order timestamp"],
              ].map((r) => (
                <tr key={r[0]} onClick={() => openDrawer(r[0])}>
                  {r.map((c) => (
                    <td key={c}>{c}</td>
                  ))}
                  <td>
                    <Badge tone="amber">Quarantined</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="card jobs">
          <div className="card-head">
            <div>
              <h2>Orchestration jobs</h2>
              <p>Airflow and event processing</p>
            </div>
          </div>
          {[
            "Batch ingestion",
            "Feature building",
            "Model scoring",
            "Kafka event consumer",
          ].map((j, i) => (
            <div className="job" key={j}>
              <span className={`job-icon ${i === 1 ? "processing" : ""}`}>
                <Icon name={i === 1 ? "flow" : "check"} size={16} />
              </span>
              <div>
                <b>{j}</b>
                <small>
                  {i === 1 ? "Processing · 64%" : "Succeeded · 10:36"}
                </small>
              </div>
              <Badge tone={i === 1 ? "blue" : "green"}>
                {i === 1 ? "Running" : "Healthy"}
              </Badge>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}

function Model({ openDrawer }: { openDrawer: (title: string) => void }) {
  return (
    <>
      <PageHeading
        title="Model Experiments & Feature Agent"
        subtitle="Evaluate bounded experiments with required human approval."
      />
      <div className="model-banner">
        <div>
          <Badge tone="navy">CURRENT APPROVED DEMO MODEL</Badge>
          <h2>Gradient Boosting · CKD-demo-v0.8</h2>
          <p>Dataset SYN-CKD-2025.06 · Evaluated 14 Jun 2025</p>
        </div>
        <button className="primary">Compare models</button>
      </div>
      <div className="workflow">
        {[
          "Screen candidates",
          "Reject unsafe features",
          "Propose subset",
          "Run experiment",
          "Compare baseline",
          "Log to MLflow",
          "Human approval",
        ].map((x, i) => (
          <div key={x}>
            <span>{i + 1}</span>
            <b>{x}</b>
          </div>
        ))}
      </div>
      <section className="card table-card">
        <div className="card-head">
          <div>
            <h2>Experiment comparison</h2>
            <p>All figures are synthetic demonstration results</p>
          </div>
          <Badge tone="amber">NOT CLINICALLY VALIDATED</Badge>
        </div>
        <table>
          <thead>
            <tr>
              <th>Experiment ID</th>
              <th>Model type</th>
              <th>Feature set</th>
              <th>PR-AUC</th>
              <th>ROC-AUC</th>
              <th>Recall</th>
              <th>Precision</th>
              <th>Brier</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "EXP-241",
                "Gradient Boosting",
                "FS-18",
                "0.71",
                "0.78",
                "0.73",
                "0.62",
                "0.16",
                "Approved demo",
              ],
              [
                "EXP-246",
                "Logistic Regression",
                "FS-21",
                "0.68",
                "0.75",
                "0.70",
                "0.60",
                "0.18",
                "Baseline",
              ],
              [
                "EXP-251",
                "Gradient Boosting",
                "FS-24",
                "0.73",
                "0.79",
                "0.74",
                "0.64",
                "0.15",
                "Awaiting approval",
              ],
            ].map((r, i) => (
              <tr key={r[0]} onClick={() => openDrawer(r[0])}>
                {r.map((c, j) => (
                  <td key={j}>
                    {j === 0 ? (
                      <b>{c}</b>
                    ) : j === 8 ? (
                      <Badge
                        tone={i === 2 ? "amber" : i === 0 ? "green" : "neutral"}
                      >
                        {c}
                      </Badge>
                    ) : (
                      c
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className="guardrail">
        <Icon name="shield" />
        <div>
          <b>Agent guardrails</b>
          <p>
            The agent cannot change labels or validation splits, send
            notifications, promote models, or make clinical decisions. Model
            promotion requires human approval.
          </p>
        </div>
        <button
          className="secondary"
          onClick={() => openDrawer("Agent recommendation EXP-251")}
        >
          Review recommendation
        </button>
      </div>
    </>
  )
}

function Sharing({ openDrawer }: { openDrawer: (title: string) => void }) {
  const checks = [
    "Member matched to participating insurer",
    "Authorization and permissions passed",
    "Hospital review completed",
    "Intended recipient verified",
    "Requested fields allowed by policy",
    "Minimum-necessary payload generated",
    "Notification event logged",
  ]
  return (
    <>
      <PageHeading
        title="Notifications & Sharing Policy"
        subtitle="Control what may leave the hospital review boundary."
      />
      <div className="sharing-grid">
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Policy validation sequence</h2>
              <p>All seven checks are required</p>
            </div>
            <Badge tone="green">ENFORCED</Badge>
          </div>
          <ol className="policy-list">
            {checks.map((c, i) => (
              <li key={c}>
                <span>
                  <Icon name="check" size={15} />
                </span>
                <div>
                  <b>{c}</b>
                  <small>Required policy gate {i + 1}</small>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="card cases">
          <div className="card-head">
            <div>
              <h2>Sharing decisions</h2>
              <p>Recent simulated requests</p>
            </div>
          </div>
          {[
            [
              "PM-10024",
              "Approved for sharing",
              "All policy gates passed",
              "green",
            ],
            [
              "PM-10482",
              "Blocked — member match failed",
              "No participating insurer match",
              "red",
            ],
            [
              "PM-10811",
              "Blocked — review incomplete",
              "Hospital review required",
              "amber",
            ],
          ].map((r) => (
            <button key={r[0]} onClick={() => openDrawer(r[0])}>
              <div>
                <b>{r[0]}</b>
                <span>{r[2]}</span>
              </div>
              <Badge tone={r[3]}>{r[1]}</Badge>
              <Icon name="chevron" size={16} />
            </button>
          ))}
        </section>
        <aside className="card payload">
          <div className="card-head">
            <div>
              <h2>Minimum-data payload</h2>
              <p>Preview for approved case</p>
            </div>
            <Icon name="shield" />
          </div>
          <pre>{`{
  "member_ref": "CM-70241",
  "assessment_date": "2025-06-18",
  "priority": "HIGH",
  "hospital_review": "COMPLETED",
  "follow_up_due": "2025-06-20"
}`}</pre>
          <div className="payload-note">
            Excluded: full lab history, diagnosis list, contact details, and
            unrelated clinical data.
          </div>
          <button
            className="primary full"
            onClick={() => openDrawer("Payload preview")}
          >
            Preview payload
          </button>
          <button className="secondary full">Validate sharing rules</button>
        </aside>
      </div>
    </>
  )
}

function Audit({ openDrawer }: { openDrawer: (title: string) => void }) {
  return (
    <>
      <PageHeading
        title="Audit Trail"
        subtitle="Search security, clinical workflow, model, and sharing events."
      />
      <section className="card table-card">
        <Filters />
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor / role</th>
              <th>Action</th>
              <th>Case reference</th>
              <th>Purpose</th>
              <th>Outcome</th>
              <th>Correlation ID</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "18 Jun, 10:36",
                "System",
                "Lab event received",
                "PM-10024",
                "Clinical review",
                "Success",
                "COR-84A2",
              ],
              [
                "18 Jun, 10:31",
                "Validation service",
                "Data quality validation failed",
                "PM-10992",
                "Data integrity",
                "Quarantined",
                "COR-839D",
              ],
              [
                "18 Jun, 09:58",
                "Dr. Morgan / Reviewer",
                "Hospital review completed",
                "PM-10207",
                "Clinical review",
                "Success",
                "COR-82FF",
              ],
              [
                "18 Jun, 09:42",
                "Policy service",
                "Insurer notification blocked",
                "PM-10482",
                "Care coordination",
                "Blocked",
                "COR-81C4",
              ],
              [
                "18 Jun, 09:18",
                "MLflow service",
                "Model experiment logged",
                "EXP-251",
                "Model evaluation",
                "Success",
                "COR-809A",
              ],
            ].map((r, i) => (
              <tr key={i} onClick={() => openDrawer(r[2])}>
                {r.map((c, j) => (
                  <td key={j}>
                    {j === 5 ? (
                      <Badge
                        tone={
                          c === "Success"
                            ? "green"
                            : c === "Blocked"
                              ? "red"
                              : "amber"
                        }
                      >
                        {c}
                      </Badge>
                    ) : (
                      c
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

function Drawer({ title, close }: { title: string close: () => void }) {
  return (
    <div className="overlay" onClick={close}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <div className="eyebrow">DETAIL VIEW</div>
            <h2>{title}</h2>
          </div>
          <button className="icon-button" onClick={close}>
            ×
          </button>
        </div>
        <Badge tone="mint">SYNTHETIC DEMO DATA</Badge>
        <div className="drawer-section">
          <h3>Record summary</h3>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>
                <Badge tone="green">Verified</Badge>
              </dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>18 Jun 2025, 10:36</dd>
            </div>
            <div>
              <dt>Correlation ID</dt>
              <dd>COR-84A2</dd>
            </div>
            <div>
              <dt>Authorization</dt>
              <dd>Minimum necessary</dd>
            </div>
          </dl>
        </div>
        <div className="drawer-section">
          <h3>Policy & audit notes</h3>
          <p>
            This synthetic record passed applicable validation and authorization
            checks. No sensitive source values are exposed in this detail view.
          </p>
        </div>
        <div className="drawer-footer">
          <button className="secondary" onClick={close}>
            Close
          </button>
          <button className="primary">View audit event</button>
        </div>
      </aside>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>("hospital")
  const [drawer, setDrawer] = useState("")
  const [notifications, setNotifications] = useState(false)
  const active = view === "patient" ? "hospital" : view
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span>
            <Icon name="pulse" />
          </span>
          <div>
            <b>PredictMed</b>
            <small>CKD Decision Support</small>
          </div>
        </div>
        <nav>
          {nav.map(([id, label, icon]) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              onClick={() => setView(id)}
            >
              <Icon name={icon} />
              <span>{label}</span>
              {id === "hospital" && <em>12</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="privacy-mini">
            <Icon name="shield" />
            <div>
              <b>Privacy-aware</b>
              <span>Minimum necessary access</span>
            </div>
          </div>
          <button className="profile">
            <span>AM</span>
            <div>
              <b>Alex Morgan</b>
              <small>Hospital Reviewer</small>
            </div>
            <Icon name="more" size={16} />
          </button>
        </div>
      </aside>
      <main>
        <header>
          <div className="breadcrumb">
            PredictMed <span>/</span> {nav.find((n) => n[0] === active)?.[1]}
          </div>
          <div className="header-actions">
            <button
              className="icon-button"
              onClick={() => setNotifications(!notifications)}
            >
              <Icon name="bell" />
              <i />
            </button>
            <div className="role">HOSPITAL REVIEWER</div>
          </div>
          {notifications && (
            <div className="notifications">
              <div className="card-head">
                <h2>Notifications</h2>
                <Badge tone="navy">3 NEW</Badge>
              </div>
              <p>
                <b>3 high-priority cases</b>
                <span>Added to your review queue</span>
              </p>
              <p>
                <b>Pipeline validation warning</b>
                <span>4 records quarantined</span>
              </p>
              <p>
                <b>Review due today</b>
                <span>PM-10024 · by 5:00 PM</span>
              </p>
            </div>
          )}
        </header>
        <div className="content">
          {view === "hospital" && <Hospital setView={setView} />}{" "}
          {view === "patient" && <Patient setView={setView} />}{" "}
          {view === "insurer" && <Insurer openDrawer={setDrawer} />}{" "}
          {view === "pipeline" && <Pipeline openDrawer={setDrawer} />}{" "}
          {view === "model" && <Model openDrawer={setDrawer} />}{" "}
          {view === "sharing" && <Sharing openDrawer={setDrawer} />}{" "}
          {view === "audit" && <Audit openDrawer={setDrawer} />}
        </div>
      </main>
      {drawer && <Drawer title={drawer} close={() => setDrawer("")} />}
    </div>
  )
}
