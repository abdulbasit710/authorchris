import React, { useEffect, useMemo, useState } from "react";
import "./AdminPortalPage.css";

const labels = { contact: "Contact", book: "Book", "early-access": "Early access" };

async function readResponse(response) {
  const type = response.headers.get("content-type") || "";
  if (!type.includes("application/json")) {
    throw new Error("The admin API is not running. Use `vercel dev` locally, or redeploy the project on Vercel.");
  }
  return response.json();
}

async function apiFetch(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") throw new Error("The server took too long to respond. Check the Vercel Function logs and Firebase credentials.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function AdminPortalPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("Checking access…");

  const load = async () => {
    const response = await apiFetch("/api/submissions");
    if (response.status === 401) { setAuthenticated(false); setStatus(""); return; }
    const data = await readResponse(response);
    if (!response.ok) throw new Error(data.error);
    setItems(data);
    setAuthenticated(true);
    setStatus("");
  };

  useEffect(() => { load().catch((error) => setStatus(error.message)); }, []);

  const login = async (event) => {
    event.preventDefault(); setStatus("Signing in…");
    let response;
    try {
      response = await apiFetch("/api/admin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    } catch (error) { setStatus(error.message); return; }
    let data;
    try { data = await readResponse(response); } catch (error) { setStatus(error.message); return; }
    if (!response.ok) { setStatus(data.error); return; }
    setPassword("");
    try { await load(); } catch (error) { setStatus(error.message); }
  };

  const logout = async () => { await fetch("/api/admin-login", { method: "DELETE" }); setAuthenticated(false); setItems([]); };
  const toggleRead = async (item) => {
    const next = !item.is_read;
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, is_read: next } : entry));
    const response = await fetch("/api/submissions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, isRead: next }) });
    if (!response.ok) { setItems((current) => current.map((entry) => entry.id === item.id ? item : entry)); }
  };

  const visible = useMemo(() => items.filter((item) => {
    const matchesFilter = filter === "all" || item.form_type === filter || (filter === "unread" && !item.is_read);
    const haystack = `${item.name} ${item.email} ${item.interest} ${item.message} ${item.organization}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  }), [items, filter, query]);

  if (!authenticated) return (
    <main className="admin-login">
      <form onSubmit={login}>
        <span className="admin-kicker">Restricted area</span><h1>Admin portal</h1>
        <p>Enter your administrator password to view website inquiries.</p>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required autoFocus /></label>
        <button type="submit">Access messages</button><output aria-live="polite">{status}</output>
      </form>
    </main>
  );

  const unread = items.filter((item) => !item.is_read).length;
  return (
    <main className="admin-portal">
      <header className="admin-topbar"><div><span className="admin-kicker">Christopher DiCristo</span><h1>Message center</h1></div><button onClick={logout}>Sign out</button></header>
      <section className="admin-stats" aria-label="Submission overview">
        <article><span>Total messages</span><strong>{items.length}</strong></article><article><span>Unread</span><strong>{unread}</strong></article><article><span>Book inquiries</span><strong>{items.filter((item) => item.form_type === "book").length}</strong></article>
      </section>
      <section className="admin-controls">
        <input type="search" placeholder="Search name, email, message…" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All submissions</option><option value="unread">Unread only</option><option value="contact">Contact</option><option value="book">Book inquiries</option><option value="early-access">Early access</option></select>
        <button onClick={() => load().catch((error) => setStatus(error.message))}>Refresh</button>
      </section>
      {status && <p className="admin-notice">{status}</p>}
      <section className="admin-messages" aria-live="polite">
        {visible.length === 0 ? <div className="admin-empty"><h2>No messages found</h2><p>New form submissions will appear here.</p></div> : visible.map((item) => (
          <article className={`admin-message${item.is_read ? " is-read" : ""}`} key={item.id}>
            <div className="admin-message__meta"><span>{labels[item.form_type] || item.form_type}</span><time>{new Date(item.created_at).toLocaleString()}</time></div>
            <div className="admin-message__heading"><div><h2>{item.name}</h2><a href={`mailto:${item.email}`}>{item.email}</a></div><button onClick={() => toggleRead(item)}>{item.is_read ? "Mark unread" : "Mark read"}</button></div>
            <div className="admin-message__details">{item.phone && <p><b>Phone</b>{item.phone}</p>}{item.organization && <p><b>Organization</b>{item.organization}</p>}{item.interest && <p><b>Interest</b>{item.interest}</p>}{item.bookTitle && <p><b>Book</b>{item.bookTitle}</p>}</div>
            {item.message && <p className="admin-message__body">{item.message}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}

export default AdminPortalPage;
