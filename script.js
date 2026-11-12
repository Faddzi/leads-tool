/* =============================================================================
   App config
   ============================================================================= */
/* Optional: paste your Supabase details here so nobody has to type them in.
   The "anon" key is safe to put in this file; the database only answers signed-in team members. */
const CONFIG = { url: "", key: "" };

/* ------------------------------------------------------------------ helpers */
const $ = (s) => document.querySelector(s);
const LS = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  },
  del(k) {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  },
};
const esc = (s) =>
  String(s == null ? "" : s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const pad = (n) => String(n).padStart(2, "0");
const iso = (d) =>
  d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const today = () => iso(new Date());
const MON = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const fmt = (d) => {
  if (!d) return "";
  const p = String(d).slice(0, 10).split("-");
  return MON[+p[1] - 1] + " " + +p[2] + ", " + p[0];
};
const pct = (a, b) => (b ? ((100 * a) / b).toFixed(1) + "%" : "–");
const money = (n) => (n ? "$" + Math.round(n).toLocaleString("en-US") : "–");
const uuid = () =>
  crypto.randomUUID
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16),
      );
function toast(msg, ms) {
  const t = $("#toast");
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (t.style.display = "none"), ms || 3500);
}
const uniq = (a) =>
  [...new Set(a.filter(Boolean))].sort((x, y) => x.localeCompare(y));

const ICON = {
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  chart: '<path d="M3 3v18h18"/><path d="M8 17V9M13 17V5M18 17v-6"/>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  note: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  play: '<path d="m6 3 14 9-14 9V3z"/>',
  reply: '<path d="m9 17-5-5 5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
  logout:
    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  board:
    '<rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="11" rx="1"/>',
  dollar:
    '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
  sheet:
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
};
const ic = (n) =>
  '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  ICON[n] +
  "</svg>";
function avatar(name, cls) {
  const s = String(name || "?").trim(),
    parts = s.split(/\s+/);
  const ini = (
    (parts[0] || "?")[0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
  ).toUpperCase();
  return '<span class="av ' + (cls || "") + '">' + esc(ini) + "</span>";
}
function tone(s) {
  if (/^(not |no show|ghost|dead|cancel)/i.test(s)) return "bad";
  if (/^(converted|completed)$/i.test(s)) return "good";
  if (/^(free trial|active)$/i.test(s)) return "vio";
  if (/^(call scheduled|scheduled|cold)$/i.test(s)) return "info";
  if (/^(hot|warm)$/i.test(s)) return "warn";
  return "";
}
const badge = (s, cls) =>
  s
    ? '<span class="pill ' +
      (cls == null ? tone(s) : cls) +
      '">' +
      esc(s) +
      "</span>"
    : "";
const person = (l) =>
  '<div class="person">' +
  avatar(l.name || l.email) +
  "<div><b>" +
  esc(l.name || "(no name)") +
  "</b><small>" +
  esc(l.company_name || l.email || "") +
  "</small></div></div>";

/* ------------------------------------------------------------------ state */
let sb = null,
  me = null,
  isAdmin = false;
const D = {
  leads: [],
  activities: [],
  calls: [],
  trials: [],
  plans: [],
  team: [],
};
const by = { lead: new Map() };
const kids = (table, leadId) => D[table].filter((r) => r.lead_id === leadId);
const isOpen = (l) =>
  l.outcome !== "Converted" && l.outcome !== "Not Converted";
const view = {
  q: "",
  status: "",
  quality: "",
  source: "",
  outcome: "",
  open: "",
  page: 0,
  range: "all",
  from: "",
  to: "",
  mode: LS.get("leads_mode") || "list",
};

const DEF = {
  lead_type: ["New", "Reactivated"],
  quality: ["Hot", "Warm", "Cold", "Dead"],
  status: [
    "Follow-up",
    "Call Scheduled",
    "Free Trial",
    "Converted",
    "Not Interested",
    "Ghosted",
  ],
  outcome: ["Converted", "Not Converted", "Follow-up Later"],
  source: ["Google Ads", "Emailer", "Unknown"],
  company_type: ["Agency", "Non Agency"],
  linkedin_accepted: ["Yes", "No"],
  call_status: ["Scheduled", "Completed", "No Show", "Cancelled"],
};
const opts = (f) => uniq([...(DEF[f] || []), ...D.leads.map((l) => l[f])]);

const FIELDS = [
  ["Contact"],
  ["name", "Name", "text"],
  ["email", "Email", "text"],
  ["alt_email", "Alternate email", "text"],
  ["phone", "Phone / contact", "text"],
  ["Pipeline"],
  ["quality", "Quality", "list"],
  ["status", "Status", "list"],
  ["status_date", "Status date", "date"],
  ["next_follow_up", "Next follow-up", "date"],
  ["outcome", "Outcome", "list"],
  ["outcome_date", "Outcome date", "date"],
  ["lead_type", "Lead type", "list"],
  ["generated_on", "Lead date", "date"],
  ["no_signup_reason", "Reason for no sign-up", "list"],
  ["Source"],
  ["source", "Source", "list"],
  ["campaign", "Campaign", "text"],
  ["ad_group", "Ad group", "text"],
  ["keyword", "Keyword", "text"],
  ["Company"],
  ["company_name", "Company", "text"],
  ["company_type", "Company type", "list"],
  ["domain", "Domain", "text"],
  ["designation", "Designation", "text"],
  ["company_size", "Company size", "text"],
  ["linkedin_accepted", "LinkedIn accepted", "list"],
  ["Notes"],
  ["notes", "Notes", "textarea"],
];

/* ------------------------------------------------------------------ database */
async function run(p) {
  const r = await p;
  if (r.error) {
    toast("Error: " + r.error.message, 7000);
    throw r.error;
  }
  return r.data;
}
async function fetchAll(table) {
  let out = [],
    from = 0;
  for (;;) {
    const rows = await run(
      sb
        .from(table)
        .select("*")
        .order("created_at")
        .order("id")
        .range(from, from + 999),
    );
    out = out.concat(rows);
    if (rows.length < 1000) break;
    from += 1000;
  }
  return out;
}
async function loadAll() {
  const [leads, activities, calls, trials, plans, team] = await Promise.all(
    ["leads", "activities", "calls", "trials", "plans"]
      .map(fetchAll)
      .concat([run(sb.from("team_members").select("*").order("email"))]),
  );
  Object.assign(D, { leads, activities, calls, trials, plans, team });
  by.lead = new Map(leads.map((l) => [l.id, l]));
  isAdmin = team.some(
    (t) => t.email.toLowerCase() === me && t.role === "admin",
  );
}
async function insertChunks(table, rows, onStep) {
  for (let i = 0; i < rows.length; i += 200) {
    await run(sb.from(table).insert(rows.slice(i, i + 200)));
    if (onStep) onStep();
  }
}
async function updateLead(id, patch) {
  patch = Object.assign(
    { edited_in_tool: true, updated_at: new Date().toISOString() },
    patch,
  );
  await run(sb.from("leads").update(patch).eq("id", id));
  Object.assign(by.lead.get(id), patch);
}
async function addActivity(leadId, kind, body, date) {
  const row = {
    id: uuid(),
    lead_id: leadId,
    kind,
    body: body || null,
    happened_on: date || today(),
    created_by: me,
    created_at: new Date().toISOString(),
  };
  await run(sb.from("activities").insert(row));
  D.activities.push(row);
}
async function addRow(table, row) {
  row = Object.assign(
    { id: uuid(), created_at: new Date().toISOString() },
    row,
  );
  await run(sb.from(table).insert(row));
  D[table].push(row);
  return row;
}
async function patchRow(table, id, patch) {
  await run(sb.from(table).update(patch).eq("id", id));
  Object.assign(
    D[table].find((r) => r.id === id),
    patch,
  );
}

/* ------------------------------------------------------------------ dialogs */
function formDialog(title, fields, okLabel, intro) {
  return new Promise((resolve) => {
    const d = $("#dlg");
    d.innerHTML =
      '<form method="dialog" class="dlg"><h2>' +
      esc(title) +
      "</h2>" +
      (intro ? '<p class="mut">' + esc(intro) + "</p>" : "<p></p>") +
      fields
        .map((f) => {
          const v = esc(f.value || ""),
            req = f.required ? " required" : "";
          let ctl;
          if (f.type === "textarea")
            ctl =
              '<textarea name="' + f.name + '"' + req + ">" + v + "</textarea>";
          else if (f.type === "select")
            ctl =
              '<select name="' +
              f.name +
              '">' +
              f.options
                .map(
                  (o) =>
                    "<option" +
                    (o === f.value ? " selected" : "") +
                    ">" +
                    esc(o) +
                    "</option>",
                )
                .join("") +
              "</select>";
          else if (f.type === "list")
            ctl =
              '<input name="' +
              f.name +
              '" list="dl_' +
              f.name +
              '" value="' +
              v +
              '"' +
              req +
              '><datalist id="dl_' +
              f.name +
              '">' +
              f.options.map((o) => '<option value="' + esc(o) + '">').join("") +
              "</datalist>";
          else
            ctl =
              '<input type="' +
              (f.type || "text") +
              '" name="' +
              f.name +
              '" value="' +
              v +
              '"' +
              req +
              (f.type === "number" ? ' step="any" min="0"' : "") +
              ">";
          return "<label>" + esc(f.label) + ctl + "</label>";
        })
        .join("") +
      '<div class="row" style="justify-content:flex-end;margin-top:18px"><button type="button" value="cancel" id="dlgCancel">Cancel</button><button class="pri" value="ok">' +
      esc(okLabel || "Save") +
      "</button></div></form>";
    const done = (v) => {
      d.onclose = null;
      if (d.open) d.close();
      resolve(v);
    };
    d.querySelector("#dlgCancel").onclick = () => done(null);
    d.querySelector("form").onsubmit = (e) => {
      e.preventDefault();
      const o = {};
      new FormData(e.target).forEach((v, k) => (o[k] = String(v).trim()));
      done(o);
    };
    d.onclose = () => resolve(null);
    d.showModal();
  });
}

/* ------------------------------------------------------------------ start-up */
function shell(inner) {
  $("#app").innerHTML =
    '<div class="auth"><div class="card"><div class="logo">' +
    ic("chart") +
    "</div>" +
    inner +
    "</div></div>";
}
async function boot() {
  const url = CONFIG.url || LS.get("sb_url"),
    key = CONFIG.key || LS.get("sb_key");
  if (!url || !key) return showConnect();
  try {
    sb = supabase.createClient(url, key);
  } catch (e) {
    return showConnect("That project URL does not look right.");
  }
  const { data } = await sb.auth.getSession();
  if (data && data.session) return enter(data.session);
  showLogin();
}
function showConnect(msg) {
  shell(
    '<h1>Connect your database</h1><p class="mut">One-time step. In Supabase open Project Settings, then API, and copy the two values below.</p>' +
      (msg ? '<div class="note bad">' + esc(msg) + "</div>" : "") +
      '<form id="fConn" class="dlg"><label>Project URL<input name="url" placeholder="https://xxxx.supabase.co" required></label>' +
      '<label>Publishable (anon) key<input name="key" required></label><button class="pri" style="width:100%">Connect</button></form>',
  );
  $("#fConn").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    LS.set("sb_url", String(f.get("url")).trim().replace(/\/+$/, ""));
    LS.set("sb_key", String(f.get("key")).trim());
    boot();
  };
}
function showLogin(msg) {
  shell(
    '<h1>Leads &amp; Stats</h1><p class="mut">Sign in with your team account.</p>' +
      '<div id="lmsg" class="note" style="' +
      (msg ? "" : "display:none") +
      '">' +
      esc(msg || "") +
      "</div>" +
      '<form id="fLogin" class="dlg"><label>Email<input type="email" name="email" required autocomplete="username"></label>' +
      '<label>Password<input type="password" name="pw" required minlength="6" autocomplete="current-password"></label>' +
      '<div class="row"><button class="pri" name="go" value="in">Sign in</button><button name="go" value="up">Create account</button></div></form>' +
      (CONFIG.url
        ? ""
        : '<p class="sm" style="margin:16px 0 0;text-align:center"><a href="#" id="reconn">Use a different database</a></p>'),
  );
  const say = (t, cls) => {
    const m = $("#lmsg");
    m.textContent = t;
    m.className = "note " + (cls || "");
    m.style.display = "";
  };
  const rc = $("#reconn");
  if (rc)
    rc.onclick = (e) => {
      e.preventDefault();
      LS.del("sb_url");
      LS.del("sb_key");
      showConnect();
    };
  $("#fLogin").onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target),
      email = String(f.get("email")).trim(),
      password = String(f.get("pw"));
    const up = e.submitter && e.submitter.value === "up";
    const r = up
      ? await sb.auth.signUp({ email, password })
      : await sb.auth.signInWithPassword({ email, password });
    if (r.error) return say(r.error.message, "bad");
    if (r.data.session) return enter(r.data.session);
    say(
      "Account created. Open the confirmation email, then sign in here.",
      "good",
    );
  };
}
async function enter(session) {
  me = (session.user.email || "").toLowerCase();
  shell('<p class="mut" style="margin:0">Loading leads…</p>');
  let ok = false;
  try {
    ok = await run(sb.rpc("claim_first_admin"));
  } catch (e) {
    shell(
      '<h1>Database not set up yet</h1><p>Run <b>schema.sql</b> in the Supabase SQL Editor, then reload this page.</p><p class="mut sm">' +
        esc(e.message || "") +
        '</p><button id="so">Sign out</button>',
    );
    $("#so").onclick = signOut;
    return;
  }
  if (!ok) {
    shell(
      "<h1>Not on the team list</h1><p>" +
        esc(me) +
        ' has an account but has not been added to this tool. Ask an admin to add this email under Team.</p><button id="so">Sign out</button>',
    );
    $("#so").onclick = signOut;
    return;
  }
  await loadAll();
  window.onhashchange = render;
  if (!location.hash) location.hash = D.leads.length ? "#today" : "#import";
  render();
}
async function signOut() {
  await sb.auth.signOut();
  location.hash = "";
  showLogin();
}

/* =============================================================================
   App shell + routing
   ============================================================================= */
const dueList = () => {
  const t = today();
  return D.leads.filter(
    (l) => isOpen(l) && l.next_follow_up && l.next_follow_up <= t,
  );
};
function render() {
  const h = location.hash.slice(1) || "today",
    parts = h.split("/"),
    tab = parts[0];
  const tabs = [
    ["today", "Today", "calendar"],
    ["leads", "Leads", "users"],
    ["stats", "Stats", "chart"],
    ["import", "Import", "download"],
    ["team", "Team", "shield"],
  ];
  const body =
    tab === "lead"
      ? vLead(parts[1])
      : tab === "leads"
        ? vLeads()
        : tab === "stats"
          ? vStats()
          : tab === "import"
            ? vImport()
            : tab === "team"
              ? vTeam()
              : vToday();
  const due = dueList().length;
  $("#app").innerHTML =
    '<div class="app"><nav class="side"><div class="brand"><div class="logo">' +
    ic("chart") +
    "</div><span>Leads &amp; Stats</span></div>" +
    tabs
      .map(
        (t) =>
          '<a class="tab' +
          (tab === t[0] || (tab === "lead" && t[0] === "leads") ? " on" : "") +
          '" href="#' +
          t[0] +
          '">' +
          ic(t[2]) +
          t[1] +
          (t[0] === "today" && due
            ? '<span class="cnt">' + due + "</span>"
            : "") +
          "</a>",
      )
      .join("") +
    '<span class="sp"></span><div class="who">' +
    avatar(me) +
    '<small title="' +
    esc(me) +
    '">' +
    esc(me) +
    '</small><button class="iconbtn" data-act="signout" title="Sign out" aria-label="Sign out">' +
    ic("logout") +
    "</button></div></nav><main>" +
    body +
    "</main></div>";
}
const go = (h) => {
  if (location.hash === "#" + h) render();
  else location.hash = h;
};
const head = (title, sub, right) =>
  '<div class="head"><div><h1>' +
  title +
  "</h1>" +
  (sub ? '<div class="sub">' + sub + "</div>" : "") +
  '</div><span class="grow"></span>' +
  (right || "") +
  "</div>";
const kpi = (v, l, icon, sub) =>
  '<div class="card kpi"><div class="l">' +
  (icon ? "<i>" + ic(icon) + "</i>" : "") +
  l +
  "</div><b>" +
  v +
  "</b>" +
  (sub ? "<span>" + sub + "</span>" : "") +
  "</div>";
const cardBox = (title, count, inner, flush) =>
  '<div class="card"><div class="hd"><h2>' +
  title +
  "</h2>" +
  (count == null ? "" : '<span class="n">' + count + "</span>") +
  '</div><div class="bd' +
  (flush ? " flush" : "") +
  '">' +
  inner +
  "</div></div>";

/* =============================================================================
   Dashboard views
   ============================================================================= */
function vToday() {
  const t = today(),
    hr = new Date().getHours();
  const due = dueList().sort((a, b) =>
    a.next_follow_up.localeCompare(b.next_follow_up),
  );
  const calls = D.calls
    .filter(
      (c) =>
        c.status === "Scheduled" && c.scheduled_for && c.scheduled_for >= t,
    )
    .sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for));
  const trials = D.trials
    .filter((x) => x.outcome === "Active")
    .sort((a, b) => String(b.started_on).localeCompare(String(a.started_on)));
  const open = D.leads.filter(isOpen),
    noNext = open.filter((l) => !l.next_follow_up).length;
  const mini = (rows, f) =>
    rows.length
      ? "<table>" + rows.map(f).join("") + "</table>"
      : '<div class="empty">Nothing here.</div>';
  return (
    head(
      "Today",
      fmt(t),
    ) +
    '<div class="grid k4" style="margin-bottom:16px">' +
    kpi(due.length, "Follow-ups due", "reply") +
    kpi(calls.length, "Upcoming calls", "phone") +
    kpi(trials.length, "Active free trials", "play") +
    kpi(open.length, "Open leads", "users") +
    "</div>" +
    cardBox(
      "Follow-ups due",
      due.length,
      (due.length
        ? '<div class="scroll"><table><tr><th>Lead</th><th>Status</th><th>Due</th><th>Last follow-up</th></tr>' +
          due
            .map(
              (l) =>
                '<tr class="click" data-lead="' +
                l.id +
                '"><td>' +
                person(l) +
                "</td><td>" +
                badge(l.status) +
                "</td><td>" +
                (l.next_follow_up < t
                  ? badge("Overdue · " + fmt(l.next_follow_up), "bad")
                  : badge("Today", "warn")) +
                "</td><td>" +
                (l.last_follow_up
                  ? fmt(l.last_follow_up) +
                    ' <span class="mut">· ' +
                    l.follow_up_count +
                    " so far</span>"
                  : '<span class="mut">None yet</span>') +
                "</td></tr>",
            )
            .join("") +
          "</table></div>"
        : '<div class="empty">No follow-ups due. A lead appears here on its next follow-up date.</div>') +
        (noNext
          ? '<div class="pager" style="justify-content:flex-start"><span class="mut">' +
            noNext +
            ' open leads have no next follow-up date.</span><a href="#" data-act="show-nonext">Show them</a></div>'
          : ""),
      true,
    ) +
    '<div class="grid g2">' +
    cardBox(
      "Upcoming calls",
      calls.length,
      mini(calls.slice(0, 30), (c) => {
        const l = by.lead.get(c.lead_id) || {};
        return (
          '<tr class="click" data-lead="' +
          c.lead_id +
          '"><td>' +
          person(l) +
          '</td><td class="n">' +
          fmt(c.scheduled_for) +
          "</td></tr>"
        );
      }),
      true,
    ) +
    cardBox(
      "Active free trials",
      trials.length,
      mini(trials.slice(0, 50), (x) => {
        const l = by.lead.get(x.lead_id) || {};
        return (
          '<tr class="click" data-lead="' +
          x.lead_id +
          '"><td>' +
          person(l) +
          '</td><td class="n">' +
          (x.started_on ? "Started " + fmt(x.started_on) : "") +
          "</td></tr>"
        );
      }),
      true,
    ) +
    "</div>"
  );
}

/* =============================================================================
   Lead list + filtering
   ============================================================================= */
function filtered() {
  const q = view.q.toLowerCase();
  return D.leads
    .filter(
      (l) =>
        (!view.status || l.status === view.status) &&
        (!view.quality || l.quality === view.quality) &&
        (!view.source || l.source === view.source) &&
        (!view.outcome || l.outcome === view.outcome) &&
        (!view.open ||
          (view.open === "nonext"
            ? isOpen(l) && !l.next_follow_up
            : isOpen(l))) &&
        (!q ||
          [
            l.name,
            l.email,
            l.alt_email,
            l.company_name,
            l.domain,
            l.notes,
            l.campaign,
          ].some((v) => v && v.toLowerCase().includes(q))),
    )
    .sort((a, b) =>
      String(b.generated_on || "").localeCompare(String(a.generated_on || "")),
    );
}
function sel(name, label, list) {
  return (
    '<select data-f="' +
    name +
    '" aria-label="' +
    label +
    '"><option value="">' +
    label +
    "</option>" +
    list
      .map(
        (o) =>
          "<option" +
          (view[name] === o ? " selected" : "") +
          ">" +
          esc(o) +
          "</option>",
      )
      .join("") +
    "</select>"
  );
}
function vLeads() {
  const rows = filtered(),
    per = 50,
    pages = Math.max(1, Math.ceil(rows.length / per));
  if (view.page >= pages) view.page = 0;
  const pg = rows.slice(view.page * per, view.page * per + per);
  const tools =
    '<div class="toolbar"><div class="search">' +
    ic("search") +
    '<input id="q" placeholder="Search name, email, company, notes" value="' +
    esc(view.q) +
    '"></div>' +
    sel("status", "All statuses", opts("status")) +
    sel("quality", "All qualities", opts("quality")) +
    sel("source", "All sources", opts("source")) +
    sel("outcome", "All outcomes", opts("outcome")) +
    '<select data-f="open" aria-label="Open or closed"><option value="">Open and closed</option><option value="open"' +
    (view.open === "open" ? " selected" : "") +
    '>Open only</option><option value="nonext"' +
    (view.open === "nonext" ? " selected" : "") +
    ">Open, no next follow-up</option></select></div>";
  let body;
  if (view.mode === "board") {
    const cols = uniq(rows.map((l) => l.status || "(no status)")),
      order = DEF.status
        .filter((s) => cols.includes(s))
        .concat(cols.filter((s) => !DEF.status.includes(s)));
    body = rows.length
      ? '<div class="board">' +
        order
          .map((s) => {
            const list = rows.filter((l) => (l.status || "(no status)") === s);
            return (
              '<div class="col"><h3>' +
              badge(s) +
              "<span>" +
              list.length +
              "</span></h3>" +
              list
                .slice(0, 30)
                .map(
                  (l) =>
                    '<div class="tile" data-lead="' +
                    l.id +
                    '"><b>' +
                    esc(l.name || "(no name)") +
                    "</b><small>" +
                    esc(l.company_name || l.email || "") +
                    '</small><div class="row" style="gap:6px">' +
                    badge(l.quality) +
                    '<span class="mut sm">' +
                    (l.next_follow_up
                      ? "Next " + fmt(l.next_follow_up)
                      : fmt(l.generated_on)) +
                    "</span></div></div>",
                )
                .join("") +
              (list.length > 30
                ? '<div class="mut sm" style="padding:2px 4px">+ ' +
                  (list.length - 30) +
                  " more. Use the filters to narrow down.</div>"
                : "") +
              "</div>"
            );
          })
          .join("") +
        "</div>"
      : '<div class="empty">No leads match these filters.</div>';
  } else {
    body =
      (rows.length
        ? '<div class="scroll"><table><tr><th>Lead</th><th>Email</th><th>Lead date</th><th>Quality</th><th>Status</th><th>Source</th><th class="n">Follow-ups</th><th>Next follow-up</th></tr>' +
          pg
            .map(
              (l) =>
                '<tr class="click" data-lead="' +
                l.id +
                '"><td>' +
                person({
                  name: l.name,
                  company_name:
                    l.company_name ||
                    (l.lead_type === "Reactivated" ? "Reactivated lead" : ""),
                }) +
                '</td><td class="mut">' +
                esc(l.email || "") +
                "</td><td>" +
                fmt(l.generated_on) +
                "</td><td>" +
                badge(l.quality) +
                "</td><td>" +
                badge(l.status) +
                "</td><td>" +
                esc(l.source || "") +
                '</td><td class="n">' +
                l.follow_up_count +
                "</td><td>" +
                (l.next_follow_up
                  ? fmt(l.next_follow_up)
                  : '<span class="mut">–</span>') +
                "</td></tr>",
            )
            .join("") +
          "</table></div>"
        : '<div class="empty">No leads match these filters.</div>') +
      '<div class="pager"><span class="mut grow">' +
      rows.length +
      ' leads</span><button data-act="pg" data-d="-1"' +
      (view.page ? "" : " disabled") +
      '>Previous</button><span class="mut">Page ' +
      (view.page + 1) +
      " of " +
      pages +
      '</span><button data-act="pg" data-d="1"' +
      (view.page < pages - 1 ? "" : " disabled") +
      ">Next</button></div>";
  }
  return (
    head(
      "Leads",
      rows.length + " of " + D.leads.length + " leads",
      '<div class="seg"><button data-act="mode" data-m="list" class="' +
        (view.mode === "list" ? "on" : "") +
        '" title="List view">' +
        ic("list") +
        'List</button><button data-act="mode" data-m="board" class="' +
        (view.mode === "board" ? "on" : "") +
        '" title="Board view">' +
        ic("board") +
        "Board</button></div>" +
        '<button class="pri" data-act="add-lead">' +
        ic("plus") +
        "Add lead</button>",
    ) +
    '<div class="card">' +
    tools +
    body +
    "</div>"
  );
}

/* ------------------------------------------------------------------ Lead page */
function vLead(id) {
  const l = by.lead.get(id);
  if (!l) return '<p>Lead not found. <a href="#leads">Back to leads</a></p>';
  const acts = kids("activities", id).sort((a, b) =>
    (b.happened_on + b.created_at).localeCompare(a.happened_on + a.created_at),
  );
  const calls = kids("calls", id),
    trials = kids("trials", id),
    plans = kids("plans", id);
  const prev = l.previous_lead_id && by.lead.get(l.previous_lead_id);
  const later = D.leads.filter((x) => x.previous_lead_id === id);
  const KIND = {
    follow_up: ["Follow-up", "reply"],
    note: ["Note", "note"],
    status: ["Status change", "flag"],
    call: ["Call", "phone"],
    trial: ["Free trial", "play"],
    plan: ["Plan", "dollar"],
    import: ["Imported from sheet", "sheet"],
  };
  const field = (f) => {
    if (f.length === 1) return '<div class="sec">' + f[0] + "</div>";
    const v = esc(l[f[0]] == null ? "" : l[f[0]]);
    if (f[2] === "textarea")
      return (
        '<label class="wide">' +
        f[1] +
        '<textarea name="' +
        f[0] +
        '">' +
        v +
        "</textarea></label>"
      );
    if (f[2] === "list")
      return (
        "<label>" +
        f[1] +
        '<input name="' +
        f[0] +
        '" value="' +
        v +
        '" list="l_' +
        f[0] +
        '"><datalist id="l_' +
        f[0] +
        '">' +
        opts(f[0])
          .map((o) => '<option value="' + esc(o) + '">')
          .join("") +
        "</datalist></label>"
      );
    return (
      "<label>" +
      f[1] +
      '<input type="' +
      f[2] +
      '" name="' +
      f[0] +
      '" value="' +
      v +
      '"></label>'
    );
  };
  const sub = [
    l.email,
    l.company_name,
    l.source ? "via " + l.source : "",
    l.generated_on ? "lead since " + fmt(l.generated_on) : "",
  ]
    .filter(Boolean)
    .map(esc)
    .join(" · ");
  return (
    '<p style="margin:0 0 14px"><a href="#leads">' +
    ic("back") +
    " All leads</a></p>" +
    '<div class="card"><div class="hero">' +
    avatar(l.name || l.email, "lg") +
    '<div class="t"><h1>' +
    esc(l.name || "(no name)") +
    '</h1><div class="mut">' +
    sub +
    '</div><div class="row">' +
    badge(l.quality) +
    badge(l.status) +
    (l.outcome && l.outcome !== l.status ? badge(l.outcome) : "") +
    (l.lead_type === "Reactivated" ? badge("Reactivated", "plain") : "") +
    (l.sheet_key && !l.edited_in_tool
      ? '<span class="pill plain" title="Still matches the sheet. A new import will refresh it.">From sheet</span>'
      : "") +
    "</div>" +
    (prev
      ? '<div class="sm" style="margin-top:8px">Earlier record: <a href="#lead/' +
        prev.id +
        '">' +
        esc(prev.name) +
        ", " +
        fmt(prev.generated_on) +
        "</a></div>"
      : "") +
    (later.length
      ? '<div class="sm" style="margin-top:8px">Came back later: ' +
        later
          .map(
            (x) =>
              '<a href="#lead/' + x.id + '">' + fmt(x.generated_on) + "</a>",
          )
          .join(", ") +
        "</div>"
      : "") +
    "</div></div>" +
    '<div class="actions"><button class="pri" data-act="followup">' +
    ic("reply") +
    'Log follow-up</button><button data-act="note">' +
    ic("note") +
    'Add note</button><button data-act="call">' +
    ic("phone") +
    'Schedule call</button><button data-act="trial">' +
    ic("play") +
    'Start free trial</button><button data-act="paid">' +
    ic("check") +
    'Mark as paid</button><button data-act="lost">' +
    ic("x") +
    "Mark as lost</button></div></div>" +
    '<div class="cols"><div>' +
    cardBox(
      "Timeline",
      null,
      '<p class="mut sm" style="margin:0 0 16px">' +
        l.follow_up_count +
        " follow-ups" +
        (l.last_follow_up ? ", last on " + fmt(l.last_follow_up) : "") +
        (l.next_follow_up ? ". Next: " + fmt(l.next_follow_up) : "") +
        "</p>" +
        (acts.length
          ? '<ul class="tl">' +
            acts
              .map((a) => {
                const k = KIND[a.kind] || [a.kind, "note"];
                return (
                  '<li><span class="dot ' +
                  esc(a.kind) +
                  '">' +
                  ic(k[1]) +
                  '</span><span class="k">' +
                  esc(k[0]) +
                  '</span> <span class="mut sm">' +
                  fmt(a.happened_on) +
                  (a.created_by ? " · " + esc(a.created_by) : "") +
                  "</span>" +
                  (a.body ? "<p>" + esc(a.body) + "</p>" : "") +
                  "</li>"
                );
              })
              .join("") +
            "</ul>"
          : '<div class="empty" style="padding:8px 0">Nothing logged yet.</div>'),
    ) +
    cardBox(
      "Calls",
      calls.length,
      calls.length
        ? "<table><tr><th>Booked</th><th>Scheduled for</th><th>Status</th></tr>" +
            calls
              .map(
                (c) =>
                  "<tr><td>" +
                  fmt(c.booked_on) +
                  "</td><td>" +
                  fmt(c.scheduled_for) +
                  '</td><td><select data-call="' +
                  c.id +
                  '" aria-label="Call status">' +
                  uniq(DEF.call_status.concat([c.status]))
                    .map(
                      (o) =>
                        "<option" +
                        (o === c.status ? " selected" : "") +
                        ">" +
                        esc(o) +
                        "</option>",
                    )
                    .join("") +
                  "</select></td></tr>",
              )
              .join("") +
            "</table>"
        : '<div class="empty">No calls.</div>',
      true,
    ) +
    cardBox(
      "Free trial",
      null,
      trials.length
        ? "<table><tr><th>Started</th><th>Result</th><th>Ended</th></tr>" +
            trials
              .map(
                (x) =>
                  "<tr><td>" +
                  fmt(x.started_on) +
                  "</td><td>" +
                  badge(x.outcome) +
                  "</td><td>" +
                  fmt(x.ended_on) +
                  "</td></tr>",
              )
              .join("") +
            "</table>"
        : '<div class="empty">No trial.</div>',
      true,
    ) +
    cardBox(
      "Plan",
      null,
      plans.length
        ? '<table><tr><th>Plan</th><th class="n">Value</th><th>Started</th><th>Churn</th></tr>' +
            plans
              .map(
                (p) =>
                  "<tr><td>" +
                  esc(p.plan_name || "(not recorded)") +
                  '</td><td class="n">' +
                  money(p.plan_value) +
                  "</td><td>" +
                  fmt(p.started_on) +
                  '</td><td class="wrap">' +
                  (p.churned_on || p.churn_reason
                    ? esc(
                        [fmt(p.churned_on), p.churn_reason]
                          .filter(Boolean)
                          .join(": "),
                      )
                    : '<button data-act="churn" data-id="' +
                      p.id +
                      '">Record churn</button>') +
                  "</td></tr>",
              )
              .join("") +
            "</table>"
        : '<div class="empty">Not a paying customer.</div>',
      true,
    ) +
    "</div><div>" +
    cardBox(
      "Details",
      null,
      '<form id="fLead" class="form">' +
        FIELDS.map(field).join("") +
        '<div class="wide row" style="margin-top:6px"><button class="pri">Save changes</button><span class="grow"></span><button type="button" class="danger" data-act="del-lead">Delete lead</button></div></form>',
    ) +
    "</div></div>"
  );
}
const curLead = () => by.lead.get(location.hash.split("/")[1]);

const ACT = {
  signout: signOut,
  "show-nonext"() {
    Object.assign(view, {
      q: "",
      status: "",
      quality: "",
      source: "",
      outcome: "",
      open: "nonext",
      page: 0,
      mode: "list",
    });
    go("leads");
  },
  pg(el) {
    view.page += +el.dataset.d;
    render();
  },
  mode(el) {
    view.mode = el.dataset.m;
    LS.set("leads_mode", view.mode);
    render();
  },
  async "add-lead"() {
    const v = await formDialog(
      "Add lead",
      [
        { name: "name", label: "Name", required: true },
        { name: "email", label: "Email", type: "email" },
        {
          name: "source",
          label: "Source",
          type: "list",
          options: opts("source"),
        },
        {
          name: "quality",
          label: "Quality",
          type: "list",
          options: opts("quality"),
        },
        {
          name: "generated_on",
          label: "Lead date",
          type: "date",
          value: today(),
          required: true,
        },
        { name: "next_follow_up", label: "Next follow-up", type: "date" },
        { name: "notes", label: "Notes", type: "textarea" },
      ],
      "Add lead",
    );
    if (!v) return;
    const earlier =
      v.email &&
      D.leads
        .filter(
          (x) => x.email && x.email.toLowerCase() === v.email.toLowerCase(),
        )
        .sort((a, b) =>
          String(b.generated_on).localeCompare(String(a.generated_on)),
        )[0];
    const row = {
      id: uuid(),
      name: v.name,
      email: v.email || null,
      source: v.source || null,
      quality: v.quality || null,
      generated_on: v.generated_on,
      next_follow_up: v.next_follow_up || null,
      notes: v.notes || null,
      status: "Follow-up",
      status_date: today(),
      lead_type: earlier ? "Reactivated" : "New",
      previous_lead_id: earlier ? earlier.id : null,
      follow_up_count: 0,
      edited_in_tool: true,
      created_by: me,
      created_at: new Date().toISOString(),
    };
    await run(sb.from("leads").insert(row));
    D.leads.push(row);
    by.lead.set(row.id, row);
    if (earlier)
      toast(
        "This email was already a lead on " +
          fmt(earlier.generated_on) +
          ", so it was saved as Reactivated and linked.",
        6000,
      );
    go("lead/" + row.id);
  },
  async followup() {
    const l = curLead(),
      v = await formDialog("Log follow-up", [
        {
          name: "date",
          label: "Date",
          type: "date",
          value: today(),
          required: true,
        },
        { name: "body", label: "What happened", type: "textarea" },
        {
          name: "next",
          label: "Next follow-up on",
          type: "date",
          value: l.next_follow_up > today() ? l.next_follow_up : "",
        },
      ]);
    if (!v) return;
    await addActivity(l.id, "follow_up", v.body, v.date);
    await updateLead(l.id, {
      follow_up_count: l.follow_up_count + 1,
      last_follow_up:
        !l.last_follow_up || v.date > l.last_follow_up
          ? v.date
          : l.last_follow_up,
      next_follow_up: v.next || null,
    });
    render();
  },
  async note() {
    const l = curLead(),
      v = await formDialog("Add note", [
        { name: "body", label: "Note", type: "textarea", required: true },
      ]);
    if (!v) return;
    await addActivity(l.id, "note", v.body);
    await updateLead(l.id, {});
    render();
  },
  async call() {
    const l = curLead(),
      v = await formDialog("Schedule call", [
        { name: "booked_on", label: "Booked on", type: "date", value: today() },
        {
          name: "scheduled_for",
          label: "Scheduled for",
          type: "date",
          required: true,
        },
      ]);
    if (!v) return;
    await addRow("calls", {
      lead_id: l.id,
      booked_on: v.booked_on || null,
      scheduled_for: v.scheduled_for,
      status: "Scheduled",
    });
    await addActivity(
      l.id,
      "call",
      "Call scheduled for " + fmt(v.scheduled_for),
    );
    await updateLead(
      l.id,
      isOpen(l) ? { status: "Call Scheduled", status_date: today() } : {},
    );
    render();
  },
  async trial() {
    const l = curLead(),
      v = await formDialog("Start free trial", [
        {
          name: "started_on",
          label: "Trial start date",
          type: "date",
          value: today(),
          required: true,
        },
      ]);
    if (!v) return;
    await addRow("trials", {
      lead_id: l.id,
      started_on: v.started_on,
      outcome: "Active",
    });
    await addActivity(l.id, "trial", "Free trial started", v.started_on);
    await updateLead(l.id, { status: "Free Trial", status_date: v.started_on });
    render();
  },
  async paid() {
    const l = curLead(),
      v = await formDialog("Mark as paid", [
        {
          name: "plan_name",
          label: "Plan name",
          type: "list",
          options: uniq(D.plans.map((p) => p.plan_name)),
          required: true,
        },
        {
          name: "plan_value",
          label: "Plan value ($ per month)",
          type: "number",
        },
        {
          name: "started_on",
          label: "Paid on",
          type: "date",
          value: today(),
          required: true,
        },
      ]);
    if (!v) return;
    await addRow("plans", {
      lead_id: l.id,
      plan_name: v.plan_name,
      plan_value: v.plan_value ? +v.plan_value : null,
      started_on: v.started_on,
    });
    for (const t of kids("trials", l.id).filter((t) => t.outcome === "Active"))
      await patchRow("trials", t.id, {
        outcome: "Converted",
        ended_on: v.started_on,
      });
    await addActivity(
      l.id,
      "plan",
      "Became a paying customer: " +
        v.plan_name +
        (v.plan_value ? " (" + money(+v.plan_value) + ")" : ""),
      v.started_on,
    );
    await updateLead(l.id, {
      status: "Converted",
      status_date: v.started_on,
      outcome: "Converted",
      outcome_date: v.started_on,
      next_follow_up: null,
    });
    render();
  },
  async lost() {
    const l = curLead(),
      v = await formDialog("Mark as lost", [
        {
          name: "status",
          label: "What happened",
          type: "select",
          options: ["Not Interested", "Ghosted"],
          value: "Not Interested",
        },
        {
          name: "reason",
          label: "Reason",
          type: "list",
          options: opts("no_signup_reason"),
        },
        {
          name: "date",
          label: "Date",
          type: "date",
          value: today(),
          required: true,
        },
      ]);
    if (!v) return;
    for (const t of kids("trials", l.id).filter((t) => t.outcome === "Active"))
      await patchRow("trials", t.id, {
        outcome: "Not converted",
        ended_on: v.date,
      });
    await addActivity(
      l.id,
      "status",
      "Marked as lost: " + v.status + (v.reason ? " (" + v.reason + ")" : ""),
      v.date,
    );
    await updateLead(l.id, {
      status: v.status,
      status_date: v.date,
      outcome: "Not Converted",
      outcome_date: v.date,
      no_signup_reason: v.reason || l.no_signup_reason || null,
      next_follow_up: null,
    });
    render();
  },
  async churn(el) {
    const l = curLead(),
      v = await formDialog("Record churn", [
        {
          name: "churned_on",
          label: "Churned on",
          type: "date",
          value: today(),
          required: true,
        },
        { name: "churn_reason", label: "Reason", type: "textarea" },
      ]);
    if (!v) return;
    await patchRow("plans", el.dataset.id, {
      churned_on: v.churned_on,
      churn_reason: v.churn_reason || null,
    });
    await addActivity(
      l.id,
      "plan",
      "Churned" + (v.churn_reason ? ": " + v.churn_reason : ""),
      v.churned_on,
    );
    await updateLead(l.id, {});
    render();
  },
  async "del-lead"() {
    const l = curLead(),
      v = await formDialog(
        "Delete this lead?",
        [],
        "Delete",
        "This removes " +
          (l.name || "the lead") +
          " and its whole timeline from the tool. The Google Sheet is not touched.",
      );
    if (!v) return;
    await run(sb.from("leads").delete().eq("id", l.id));
    await loadAll();
    go("leads");
  },
  async "team-add"() {
    const v = await formDialog(
      "Add team member",
      [
        { name: "email", label: "Email", type: "email", required: true },
        { name: "name", label: "Name" },
        {
          name: "role",
          label: "Role",
          type: "select",
          options: ["member", "admin"],
          value: "member",
        },
      ],
      "Add",
      'They also need to open this tool and press "Create account" with the same email.',
    );
    if (!v) return;
    await run(
      sb.from("team_members").insert({
        email: v.email.toLowerCase(),
        name: v.name || null,
        role: v.role,
      }),
    );
    await loadAll();
    render();
  },
  async "team-del"(el) {
    const v = await formDialog(
      "Remove " + el.dataset.email + "?",
      [],
      "Remove",
      "They will lose access immediately.",
    );
    if (!v) return;
    await run(sb.from("team_members").delete().eq("email", el.dataset.email));
    await loadAll();
    render();
  },
  "imp-fetch": () => importFromLink(),
  "imp-apply": () => applyImport(),
};

document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-act]");
  if (a) {
    e.preventDefault();
    const f = ACT[a.dataset.act];
    if (f) Promise.resolve(f(a)).catch((err) => console.error(err));
    return;
  }
  const r = e.target.closest("[data-lead]");
  if (r) go("lead/" + r.dataset.lead);
});
document.addEventListener("input", (e) => {
  if (e.target.id === "q") {
    view.q = e.target.value;
    view.page = 0;
    render();
    const q = $("#q");
    q.focus();
    q.setSelectionRange(q.value.length, q.value.length);
  }
});
document.addEventListener("change", async (e) => {
  const t = e.target;
  if (t.dataset.f) {
    view[t.dataset.f] = t.value;
    view.page = 0;
    render();
  } else if (t.dataset.call) {
    const c = D.calls.find((x) => x.id === t.dataset.call);
    await patchRow("calls", c.id, { status: t.value });
    await addActivity(c.lead_id, "call", "Call marked " + t.value);
    await updateLead(c.lead_id, {});
    render();
  } else if (t.dataset.range) {
    view.range = t.value;
    render();
  } else if (t.dataset.rd) {
    view[t.dataset.rd] = t.value;
    view.range = "custom";
    render();
  } else if (t.id === "impFile" && t.files[0]) {
    previewImport(await t.files[0].text());
  }
});
document.addEventListener("submit", async (e) => {
  if (e.target.id !== "fLead") return;
  e.preventDefault();
  const l = curLead(),
    patch = {};
  let changed = [];
  new FormData(e.target).forEach((v, k) => {
    v = String(v).trim() || null;
    if ((l[k] == null ? null : String(l[k])) !== v) {
      patch[k] = v;
      changed.push(k);
    }
  });
  if (!changed.length) return toast("Nothing changed.");
  if ("name" in patch && !patch.name) patch.name = "";
  if ("lead_type" in patch && !patch.lead_type) patch.lead_type = "New";
  if ("status" in patch) {
    if (!("status_date" in patch)) patch.status_date = today();
    await addActivity(
      l.id,
      "status",
      "Status: " + (l.status || "none") + " → " + (patch.status || "none"),
    );
  }
  if (
    "outcome" in patch &&
    patch.outcome &&
    !("outcome_date" in patch) &&
    !l.outcome_date
  )
    patch.outcome_date = today();
  await updateLead(l.id, patch);
  toast("Saved.");
  render();
});

/* ------------------------------------------------------------------ Stats */
function rangeDates() {
  const now = new Date(),
    y = now.getFullYear();
  if (view.range === "year") return [y + "-01-01", y + "-12-31"];
  if (view.range === "lastyear") return [y - 1 + "-01-01", y - 1 + "-12-31"];
  if (view.range === "12m") {
    const d = new Date(y, now.getMonth() - 11, 1);
    return [iso(d), today()];
  }
  if (view.range === "30d") {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return [iso(d), today()];
  }
  if (view.range === "custom")
    return [view.from || "0000-01-01", view.to || "9999-12-31"];
  return ["0000-01-01", "9999-12-31"];
}
function computeStats(from, to) {
  const inR = (d) => !!d && d >= from && d <= to;
  const leads = D.leads.filter((l) => inR(l.generated_on));
  const trials = D.trials.filter((t) => inR(t.started_on));
  const plans = D.plans.filter((p) => inR(p.started_on));
  const ftPaid = D.trials.filter(
    (t) => t.outcome === "Converted" && inR(t.ended_on),
  );
  const calls = D.calls.filter((c) => inR(c.scheduled_for));
  const months = {};
  const M = (d) => {
    const k = d.slice(0, 7);
    return (
      months[k] ||
      (months[k] = {
        k,
        leads: 0,
        neu: 0,
        re: 0,
        ft: 0,
        paid: 0,
        ftPaid: 0,
        calls: 0,
        done: 0,
        noshow: 0,
        value: 0,
      })
    );
  };
  leads.forEach((l) => {
    const m = M(l.generated_on);
    m.leads++;
    if (l.lead_type === "Reactivated") m.re++;
    else m.neu++;
  });
  trials.forEach((t) => M(t.started_on).ft++);
  plans.forEach((p) => {
    const m = M(p.started_on);
    m.paid++;
    m.value += +p.plan_value || 0;
  });
  ftPaid.forEach((t) => M(t.ended_on).ftPaid++);
  calls.forEach((c) => {
    const m = M(c.scheduled_for);
    m.calls++;
    if (c.status === "Completed") m.done++;
    if (c.status === "No Show") m.noshow++;
  });
  const src = {};
  const S = (id) => {
    const l = by.lead.get(id) || {},
      k = l.source || "(none)";
    return src[k] || (src[k] = { k, leads: 0, ft: 0, paid: 0, value: 0 });
  };
  leads.forEach((l) => S(l.id).leads++);
  trials.forEach((t) => S(t.lead_id).ft++);
  plans.forEach((p) => {
    const s = S(p.lead_id);
    s.paid++;
    s.value += +p.plan_value || 0;
  });
  const tally = (list, f) => {
    const o = {};
    list.forEach((x) => {
      const k = x[f] || "(blank)";
      o[k] = (o[k] || 0) + 1;
    });
    return Object.entries(o).sort((a, b) => b[1] - a[1]);
  };
  return {
    leads: leads.length,
    neu: leads.filter((l) => l.lead_type !== "Reactivated").length,
    re: leads.filter((l) => l.lead_type === "Reactivated").length,
    ft: trials.length,
    paid: plans.length,
    ftPaid: ftPaid.length,
    value: plans.reduce((s, p) => s + (+p.plan_value || 0), 0),
    calls: calls.length,
    done: calls.filter((c) => c.status === "Completed").length,
    noshow: calls.filter((c) => c.status === "No Show").length,
    months: Object.values(months).sort((a, b) => a.k.localeCompare(b.k)),
    sources: Object.values(src).sort((a, b) => b.leads - a.leads),
    quality: tally(leads, "quality"),
    status: tally(leads, "status"),
    outcome: tally(leads, "outcome"),
    reasons: tally(
      leads.filter((l) => l.no_signup_reason),
      "no_signup_reason",
    ),
  };
}
function share(title, rows, total) {
  return cardBox(
    title,
    null,
    rows.length
      ? "<table>" +
          rows
            .slice(0, 12)
            .map(
              (r) =>
                "<tr><td>" +
                esc(r[0]) +
                '</td><td class="n">' +
                r[1] +
                '</td><td class="n mut">' +
                pct(r[1], total) +
                '</td><td style="width:38%"><div class="bar"><i style="width:' +
                (100 * r[1]) / Math.max(1, rows[0][1]) +
                '%"></i></div></td></tr>',
            )
            .join("") +
          "</table>"
      : '<div class="empty">No data in this period.</div>',
    true,
  );
}
function vStats() {
  const [from, to] = rangeDates(),
    s = computeStats(from, to);
  const R = [
    ["all", "All time"],
    ["year", "This year"],
    ["lastyear", "Last year"],
    ["12m", "Last 12 months"],
    ["30d", "Last 30 days"],
    ["custom", "Custom dates"],
  ];
  const mx = Math.max(
    1,
    ...s.months.map((m) => Math.max(m.leads, m.ft, m.paid)),
  );
  const ml = (k) => MON[+k.slice(5) - 1] + " '" + k.slice(2, 4);
  return (
    head(
      "Stats",
      "",
      '<select data-range="1" aria-label="Period">' +
        R.map(
          (r) =>
            '<option value="' +
            r[0] +
            '"' +
            (view.range === r[0] ? " selected" : "") +
            ">" +
            r[1] +
            "</option>",
        ).join("") +
        "</select>" +
        '<input type="date" data-rd="from" value="' +
        esc(view.range === "custom" ? view.from : "") +
        '" aria-label="From"><input type="date" data-rd="to" value="' +
        esc(view.range === "custom" ? view.to : "") +
        '" aria-label="To">',
    ) +
    '<div class="grid k4" style="margin-bottom:10px">' +
    kpi(s.leads, "Leads", "users", s.neu + " new, " + s.re + " reactivated") +
    kpi(s.ft, "Free trials started", "play", pct(s.ft, s.leads) + " of leads") +
    kpi(s.paid, "Paid customers", "check", pct(s.paid, s.leads) + " of leads") +
    kpi(money(s.value), "Plan value won", "dollar") +
    kpi(pct(s.ft, s.leads), "Lead to free trial") +
    kpi(pct(s.ftPaid, s.ft), "Free trial to paid") +
    kpi(pct(s.paid, s.leads), "Lead to paid") +
    kpi(
      s.done + " / " + s.calls,
      "Calls completed / scheduled",
      null,
      s.noshow + " no-shows",
    ) +
    "</div>" +
    '<p class="mut sm" style="margin:0 0 16px">Counted the same way as the sheet\'s Monthly tab: leads by lead date, trials by start date, paid by conversion date, calls by scheduled date.</p>' +
    '<div class="card"><div class="hd"><h2>Monthly volume</h2><span class="grow"></span><div class="legend"><span><i style="background:var(--c1)"></i>Leads</span><span><i style="background:var(--c2)"></i>Free trials</span><span><i style="background:var(--c3)"></i>Paid</span></div></div><div class="bd">' +
    (s.months.length
      ? '<div class="chart">' +
        s.months
          .map(
            (m) =>
              '<div class="m" title="' +
              ml(m.k) +
              ": " +
              m.leads +
              " leads, " +
              m.ft +
              " trials, " +
              m.paid +
              ' paid"><div class="bars"><i style="background:var(--c1);height:' +
              (100 * m.leads) / mx +
              '%"></i><i style="background:var(--c2);height:' +
              (100 * m.ft) / mx +
              '%"></i><i style="background:var(--c3);height:' +
              (100 * m.paid) / mx +
              '%"></i></div><div class="lab">' +
              ml(m.k) +
              "</div></div>",
          )
          .join("") +
        "</div>"
      : '<div class="empty">No data in this period.</div>') +
    "</div></div>" +
    cardBox(
      "Month by month",
      null,
      '<div class="scroll"><table><tr><th>Month</th><th class="n">Leads</th><th class="n">New</th><th class="n">Reactivated</th><th class="n">Free trials</th><th class="n">FT to paid</th><th class="n">Paid</th><th class="n">Lead to FT</th><th class="n">Lead to paid</th><th class="n">Calls</th><th class="n">Completed</th><th class="n">No show</th><th class="n">Plan value</th></tr>' +
        s.months
          .slice()
          .reverse()
          .map(
            (m) =>
              "<tr><td><b>" +
              ml(m.k) +
              '</b></td><td class="n">' +
              m.leads +
              '</td><td class="n">' +
              m.neu +
              '</td><td class="n">' +
              m.re +
              '</td><td class="n">' +
              m.ft +
              '</td><td class="n">' +
              m.ftPaid +
              '</td><td class="n">' +
              m.paid +
              '</td><td class="n">' +
              pct(m.ft, m.leads) +
              '</td><td class="n">' +
              pct(m.paid, m.leads) +
              '</td><td class="n">' +
              m.calls +
              '</td><td class="n">' +
              m.done +
              '</td><td class="n">' +
              m.noshow +
              '</td><td class="n">' +
              money(m.value) +
              "</td></tr>",
          )
          .join("") +
        "</table></div>",
      true,
    ) +
    cardBox(
      "Lead sources",
      null,
      '<div class="scroll"><table><tr><th>Source</th><th class="n">Leads</th><th class="n">Free trials</th><th class="n">Paid</th><th class="n">Lead to FT</th><th class="n">Lead to paid</th><th class="n">Plan value</th></tr>' +
        s.sources
          .map(
            (x) =>
              "<tr><td><b>" +
              esc(x.k) +
              '</b></td><td class="n">' +
              x.leads +
              '</td><td class="n">' +
              x.ft +
              '</td><td class="n">' +
              x.paid +
              '</td><td class="n">' +
              pct(x.ft, x.leads) +
              '</td><td class="n">' +
              pct(x.paid, x.leads) +
              '</td><td class="n">' +
              money(x.value) +
              "</td></tr>",
          )
          .join("") +
        "</table></div>",
      true,
    ) +
    '<div class="grid g2">' +
    share("Lead quality", s.quality, s.leads) +
    share("Current status", s.status, s.leads) +
    share("Outcome", s.outcome, s.leads) +
    share(
      "Reasons for no sign-up",
      s.reasons,
      s.reasons.reduce((a, r) => a + r[1], 0),
    ) +
    "</div>"
  );
}

/* =============================================================================
   Import workflow (reads the sheet, never writes to it)
   ============================================================================= */
function parseCSV(text) {
  const rows = [];
  let row = [],
    cur = "",
    q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = false;
      } else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(cur);
      cur = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cur);
      cur = "";
      rows.push(row);
      row = [];
    } else cur += c;
  }
  if (cur !== "" || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}
function parseDate(s) {
  s = String(s || "").trim();
  if (!s) return null;
  let m;
  const mon = (n) => {
    const i = MON.findIndex(
      (x) => x.toLowerCase() === n.slice(0, 3).toLowerCase(),
    );
    return i < 0 ? null : i + 1;
  };
  const mk = (y, mo, d) => {
    y = +y;
    if (y < 100) y += 2000;
    mo = +mo;
    d = +d;
    if (!mo || mo > 12 || !d || d > 31) return undefined;
    return y + "-" + pad(mo) + "-" + pad(d);
  };
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)))
    return mk(m[1], m[2], m[3]);
  if ((m = s.match(/^([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})$/)))
    return mk(m[3], mon(m[1]), m[2]);
  if ((m = s.match(/^(\d{1,2})[-\s]([A-Za-z]{3,9})[-\s,]+(\d{2,4})$/)))
    return mk(m[3], mon(m[2]), m[1]);
  if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)))
    return +m[1] > 12 ? mk(m[3], m[2], m[1]) : mk(m[3], m[1], m[2]);
  return undefined; /* text we could not read as a date */
}
const HEAD = {
  lead_type: "lead type",
  generated_on: "lead generated date",
  name: "lead name",
  email: "email address",
  phone: "possible contact",
  last_follow_up: "last follow up",
  follow_up_count: "total follow ups",
  quality: "lead quality",
  status: "lead status",
  status_date: "status date",
  outcome: "outcome",
  outcome_date: "outcome date",
  converted_on: "free trial converted",
  call_scheduled: "call scheduled",
  call_booked: "call booked on",
  call_for: "call scheduled for",
  call_status: "call status",
  trial_start: "free trial start date",
  ft_started: "ft started",
  plan_name: "plan name",
  plan_value: "plan value",
  no_signup_reason: "reasons-no sign ups",
  churn_reason: "churn reasons",
  notes: "notes",
  source: "lead source",
  campaign: "campaign",
  ad_group: "ad group",
  keyword: "keyword",
  alt_email: "alternate email",
  company_type: "company type",
  company_name: "company name",
  domain: "domain",
  linkedin_accepted: "linkedin",
  designation: "designation",
  company_size: "company size",
};
function hash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return String(h);
}
function buildRecords(text) {
  const rows = parseCSV(text.replace(/^﻿/, ""));
  if (!rows.length) throw new Error("The file is empty.");
  const head = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, " "));
  const col = {},
    missing = [];
  for (const k in HEAD) {
    const i = head.findIndex(
      (h) =>
        h === HEAD[k] ||
        (k === "linkedin_accepted" && h.startsWith("linkedin")),
    );
    col[k] = i;
    if (i < 0) missing.push(HEAD[k]);
  }
  if (col.name < 0 || col.generated_on < 0)
    throw new Error(
      'This does not look like the Leads Data tab: the "Lead Name" and "Lead Generated Date" columns were not found.',
    );
  const warn = [],
    seen = {},
    recs = [];
  rows.slice(1).forEach((r, idx) => {
    const g = (k) =>
      col[k] < 0 ? "" : String(r[col[k]] == null ? "" : r[col[k]]).trim();
    if (!g("name") && !g("email") && !g("generated_on")) return;
    const line = idx + 2;
    const dt = (k) => {
      const d = parseDate(g(k));
      if (d === undefined) {
        warn.push(
          "Row " +
            line +
            ': could not read "' +
            g(k) +
            '" as a date (' +
            HEAD[k] +
            ").",
        );
        return null;
      }
      return d;
    };
    const yes = (k) => /^y(es)?$/i.test(g(k));
    let key = [
      g("email").toLowerCase() || g("name").toLowerCase(),
      g("generated_on"),
      g("lead_type"),
    ].join("|");
    seen[key] = (seen[key] || 0) + 1;
    if (seen[key] > 1) key += "#" + seen[key];
    const id = uuid(),
      now = new Date().toISOString();
    const lead = {
      id,
      sheet_key: key,
      sheet_hash: hash(JSON.stringify(r)),
      edited_in_tool: false,
      created_by: "sheet import",
      created_at: now,
      updated_at: now,
      lead_type: g("lead_type") || "New",
      generated_on: dt("generated_on"),
      name: g("name"),
      email: g("email") || null,
      alt_email: g("alt_email") || null,
      phone: g("phone") || null,
      quality: g("quality") || null,
      status: g("status") || null,
      status_date: dt("status_date"),
      outcome: g("outcome") || null,
      outcome_date: dt("outcome_date"),
      source: g("source") || null,
      campaign: g("campaign") || null,
      ad_group: g("ad_group") || null,
      keyword: g("keyword") || null,
      company_type: g("company_type") || null,
      company_name: g("company_name") || null,
      domain: g("domain") || null,
      designation: g("designation") || null,
      company_size: g("company_size") || null,
      linkedin_accepted: g("linkedin_accepted") || null,
      no_signup_reason: g("no_signup_reason") || null,
      notes: g("notes") || null,
      follow_up_count: parseInt(g("follow_up_count"), 10) || 0,
      last_follow_up: dt("last_follow_up"),
      next_follow_up: null,
      previous_lead_id: null,
    };
    const rec = { lead, calls: [], trials: [], plans: [], activities: [] };
    const conv = dt("converted_on"),
      tStart = dt("trial_start"),
      cFor = dt("call_for"),
      cBooked = dt("call_booked");
    if (cFor || cBooked || yes("call_scheduled"))
      rec.calls.push({
        id: uuid(),
        lead_id: id,
        booked_on: cBooked,
        scheduled_for: cFor,
        status: g("call_status") || "Scheduled",
        created_at: now,
      });
    if (tStart || yes("ft_started"))
      rec.trials.push({
        id: uuid(),
        lead_id: id,
        started_on: tStart,
        created_at: now,
        outcome: conv
          ? "Converted"
          : lead.outcome === "Not Converted"
            ? "Not converted"
            : "Active",
        ended_on:
          conv || (lead.outcome === "Not Converted" ? lead.outcome_date : null),
      });
    const val = parseFloat(g("plan_value").replace(/[^0-9.]/g, ""));
    if (
      conv ||
      lead.outcome === "Converted" ||
      g("plan_name") ||
      g("churn_reason")
    )
      rec.plans.push({
        id: uuid(),
        lead_id: id,
        plan_name: g("plan_name") || null,
        plan_value: isNaN(val) ? null : val,
        started_on:
          conv || (lead.outcome === "Converted" ? lead.outcome_date : null),
        churn_reason: g("churn_reason") || null,
        created_at: now,
      });
    if (lead.follow_up_count || lead.last_follow_up)
      rec.activities.push({
        id: uuid(),
        lead_id: id,
        kind: "import",
        happened_on: lead.last_follow_up || lead.generated_on || today(),
        created_by: "sheet import",
        created_at: now,
        body:
          lead.follow_up_count +
          " follow-up" +
          (lead.follow_up_count === 1 ? "" : "s") +
          " recorded in the sheet" +
          (lead.last_follow_up
            ? ", the last on " + fmt(lead.last_follow_up)
            : "") +
          ". The sheet did not keep each one separately.",
      });
    recs.push(rec);
  });
  return { recs, warn, missing };
}
let pending = null;
function vImport() {
  const n = D.leads.filter((l) => l.sheet_key).length;
  return (
    head(
      "Import from the Google Sheet",
      "The import reads the sheet and never writes to it.",
    ) +
    '<div class="card"><div class="bd"><p style="margin-top:0">' +
    (n
      ? "<b>" +
        n +
        " leads</b> in this tool came from the sheet. Import again any time to pull in new rows. Leads you have not touched here are refreshed; leads you have edited here are left alone."
      : "Nothing imported yet.") +
    "</p>" +
    '<div class="grid g2"><div class="drop"><h2 style="margin-bottom:4px">Upload a CSV <span class="pill good plain">Most reliable</span></h2><p class="mut sm">In Google Sheets open the Leads Data tab, then File, Download, Comma-separated values (.csv).</p><input type="file" id="impFile" accept=".csv,text/csv"></div>' +
    '<div class="drop"><h2 style="margin-bottom:4px">Read it by link</h2><p class="mut sm">Works only while the sheet is shared as "Anyone with the link can view".</p>' +
    '<div class="row"><input id="impUrl" placeholder="Paste the Google Sheet link" style="flex:1;min-width:180px" value="' +
    esc(LS.get("sheet_url") || "") +
    '"><button data-act="imp-fetch">Read sheet</button></div></div></div></div></div>' +
    '<div id="impOut"></div>'
  );
}
async function importFromLink() {
  const url = $("#impUrl").value.trim(),
    m = url.match(/\/d\/([\w-]+)/);
  if (!m) return toast("That does not look like a Google Sheet link.");
  LS.set("sheet_url", url);
  const gid = (url.match(/[#?&]gid=(\d+)/) || [0, "0"])[1],
    base = "https://docs.google.com/spreadsheets/d/" + m[1];
  $("#impOut").innerHTML =
    '<div class="card"><div class="bd">Reading the sheet…</div></div>';
  for (const u of [
    base + "/export?format=csv&gid=" + gid,
    base + "/gviz/tq?tqx=out:csv&gid=" + gid,
  ]) {
    try {
      const r = await fetch(u);
      const t = await r.text();
      if (r.ok && !/^\s*<(!doctype|html)/i.test(t)) return previewImport(t);
    } catch (e) {}
  }
  $("#impOut").innerHTML =
    '<div class="card"><div class="bd"><b>Could not read the sheet by link.</b><p style="margin-bottom:0">It is probably not shared as "Anyone with the link can view". Use the CSV upload instead.</p></div></div>';
}
function previewImport(text) {
  let b;
  try {
    b = buildRecords(text);
  } catch (e) {
    $("#impOut").innerHTML =
      '<div class="card"><div class="bd"><b>' +
      esc(e.message) +
      "</b></div></div>";
    return;
  }
  const have = new Map(
    D.leads.filter((l) => l.sheet_key).map((l) => [l.sheet_key, l]),
  );
  const fresh = [],
    changed = [],
    kept = [];
  let same = 0;
  b.recs.forEach((r) => {
    const e = have.get(r.lead.sheet_key);
    if (!e) fresh.push(r);
    else if (e.sheet_hash === r.lead.sheet_hash) same++;
    else if (e.edited_in_tool) kept.push(r);
    else changed.push({ rec: r, old: e });
  });
  pending = { fresh, changed };
  $("#impOut").innerHTML =
    '<div class="card"><div class="hd"><h2>Ready to import</h2></div><div class="bd"><div class="grid g4">' +
    [
      [b.recs.length, "rows found in the sheet"],
      [fresh.length, "new leads to add"],
      [changed.length, "leads to refresh from the sheet"],
      [same, "already up to date"],
      [kept.length, "changed in the sheet but edited here, left alone"],
    ]
      .map(
        (k) =>
          '<div class="kpi" style="padding:0"><b style="margin:0">' +
          k[0] +
          "</b><span>" +
          k[1] +
          "</span></div>",
      )
      .join("") +
    "</div>" +
    (b.missing.length
      ? '<div class="note" style="margin:14px 0 0">Columns not found (left blank): ' +
        esc(b.missing.join(", ")) +
        "</div>"
      : "") +
    (b.warn.length
      ? '<details style="margin-top:14px"><summary>' +
        b.warn.length +
        ' cells could not be read and were left blank</summary><p class="pre sm mut">' +
        esc(b.warn.slice(0, 200).join("\n")) +
        "</p></details>"
      : "") +
    '<p style="margin:18px 0 0"><button class="pri" data-act="imp-apply"' +
    (fresh.length + changed.length ? "" : " disabled") +
    ">" +
    ic("download") +
    "Import " +
    (fresh.length + changed.length) +
    ' leads</button> <span id="impProg" class="mut" style="margin-left:8px"></span></p></div></div>';
}
async function applyImport() {
  if (!pending) return;
  const p = pending;
  pending = null;
  const prog = (t) => {
    const el = $("#impProg");
    if (el) el.textContent = t;
  };
  document.querySelector('[data-act="imp-apply"]').disabled = true;
  const recs = p.fresh.concat(p.changed.map((c) => c.rec)),
    oldIds = p.changed.map((c) => c.old.id);
  for (let i = 0; i < oldIds.length; i += 100) {
    prog("Refreshing…");
    await run(
      sb
        .from("leads")
        .delete()
        .in("id", oldIds.slice(i, i + 100)),
    );
  }
  let done = 0;
  const step = () =>
    prog(
      "Saving… " + Math.min(recs.length, (done += 200)) + " of " + recs.length,
    );
  await insertChunks(
    "leads",
    recs.map((r) => r.lead),
    step,
  );
  prog("Saving calls, trials and plans…");
  for (const t of ["calls", "trials", "plans", "activities"])
    await insertChunks(
      t,
      recs.flatMap((r) => r[t]),
    );
  await loadAll();
  /* link each "Reactivated" row to the same person's earlier record */
  prog("Linking reactivated leads…");
  const byEmail = {};
  D.leads.forEach((l) => {
    if (l.email) {
      const k = l.email.toLowerCase();
      (byEmail[k] = byEmail[k] || []).push(l);
    }
  });
  for (const l of D.leads.filter(
    (l) => l.lead_type === "Reactivated" && !l.previous_lead_id && l.email,
  )) {
    const prev = byEmail[l.email.toLowerCase()]
      .filter(
        (x) =>
          x.id !== l.id &&
          String(x.generated_on || "") <= String(l.generated_on || ""),
      )
      .sort((a, b) =>
        String(b.generated_on).localeCompare(String(a.generated_on)),
      )[0];
    if (prev) {
      await run(
        sb.from("leads").update({ previous_lead_id: prev.id }).eq("id", l.id),
      );
      l.previous_lead_id = prev.id;
    }
  }
  toast("Imported " + recs.length + " leads.");
  view.mode = "list";
  go("leads");
}

/* ------------------------------------------------------------------ Team */
function vTeam() {
  return (
    head(
      "Team",
      "Only the people listed here can see or change leads, even if someone else creates an account.",
      isAdmin
        ? '<button class="pri" data-act="team-add">' +
            ic("plus") +
            "Add team member</button>"
        : "",
    ) +
    '<div class="card"><table><tr><th>Member</th><th>Role</th><th></th></tr>' +
    D.team
      .map(
        (t) =>
          "<tr><td>" +
          person({
            name: t.name || t.email,
            company_name: t.name ? t.email : "",
          }) +
          "</td><td>" +
          badge(
            t.role === "admin" ? "Admin" : "Member",
            t.role === "admin" ? "vio" : "",
          ) +
          '</td><td class="n">' +
          (isAdmin && t.email.toLowerCase() !== me
            ? '<button class="danger" data-act="team-del" data-email="' +
              esc(t.email) +
              '">Remove</button>'
            : t.email.toLowerCase() === me
              ? '<span class="mut sm">You</span>'
              : "") +
          "</td></tr>",
      )
      .join("") +
    "</table></div>"
  );
}

boot();
