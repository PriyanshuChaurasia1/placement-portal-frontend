import { useEffect, useState } from "react";
import api from "../../api/axios";

const empty = {
  companyId: "",
  title: "",
  description: "",
  ctc: "",
  location: "",
  minCgpa: "",
  maxBacklogs: "",
  allowedBranches: "",
  deadline: "",
  skills: "",
  active: true,
};

const STATUSES = ["APPLIED", "SHORTLISTED", "SELECTED", "REJECTED"];

export default function OfficerJobs() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [openJob, setOpenJob] = useState(null);
  const [apps, setApps] = useState([]);

  const load = async () => {
    const [j, c] = await Promise.all([
      api.get("/officer/jobs"),
      api.get("/officer/companies"),
    ]);
    setJobs(j.data);
    setCompanies(c.data);
  };

  useEffect(() => {
    load();
  }, []);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const num = (v) => (v === "" || v == null ? null : Number(v));

  const submit = async (e) => {
    e.preventDefault();
    const body = {
      companyId: Number(form.companyId),
      title: form.title,
      description: form.description,
      ctc: num(form.ctc),
      location: form.location,
      minCgpa: num(form.minCgpa),
      maxBacklogs: num(form.maxBacklogs),
      allowedBranches: form.allowedBranches,
      deadline: form.deadline || null,
      active: form.active,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (editId) {
        await api.put(`/officer/jobs/${editId}`, body);
        setMsg("Job updated");
      } else {
        await api.post("/officer/jobs", body);
        setMsg("Job created");
      }
      setForm(empty);
      setEditId(null);
      load();
    } catch {
      setMsg("Could not save job (select a company)");
    }
  };

  const edit = (j) => {
    setEditId(j.id);
    setForm({
      companyId: j.companyId,
      title: j.title || "",
      description: j.description || "",
      ctc: j.ctc ?? "",
      location: j.location || "",
      minCgpa: j.minCgpa ?? "",
      maxBacklogs: j.maxBacklogs ?? "",
      allowedBranches: j.allowedBranches || "",
      deadline: j.deadline || "",
      skills: (j.skills || []).join(", "),
      active: j.active ?? true,
    });
    window.scrollTo(0, 0);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api.delete(`/officer/jobs/${id}`);
      load();
    } catch {
      setMsg("Cannot delete: job has applications");
    }
  };

  const viewApps = async (id) => {
    if (openJob === id) {
      setOpenJob(null);
      return;
    }
    const res = await api.get(`/officer/jobs/${id}/applications`);
    setApps(res.data);
    setOpenJob(id);
  };

  const setStatus = async (appId, status) => {
    await api.put(`/officer/applications/${appId}/status`, { status });
    const res = await api.get(`/officer/jobs/${openJob}/applications`);
    setApps(res.data);
  };

  return (
    <div className="page">
      <h2>Jobs</h2>
      <form className="card form-grid" onSubmit={submit}>
        <label>Company
          <select name="companyId" value={form.companyId} onChange={change} required>
            <option value="">Select company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label>Title<input name="title" value={form.title} onChange={change} required /></label>
        <label>CTC (LPA)<input name="ctc" type="number" step="0.1" value={form.ctc} onChange={change} /></label>
        <label>Location<input name="location" value={form.location} onChange={change} /></label>
        <label>Min CGPA<input name="minCgpa" type="number" step="0.01" value={form.minCgpa} onChange={change} /></label>
        <label>Max backlogs<input name="maxBacklogs" type="number" value={form.maxBacklogs} onChange={change} /></label>
        <label>Allowed branches (CSE,IT)<input name="allowedBranches" value={form.allowedBranches} onChange={change} /></label>
        <label>Deadline<input name="deadline" type="date" value={form.deadline} onChange={change} /></label>
        <label>Skills (comma separated)<input name="skills" value={form.skills} onChange={change} /></label>
        <label>Description<input name="description" value={form.description} onChange={change} /></label>
        <label style={{ flexDirection: "row", alignItems: "center" }}>
          <input name="active" type="checkbox" checked={form.active} onChange={change} /> Active
        </label>
        <button type="submit">{editId ? "Update Job" : "Create Job"}</button>
      </form>
      {msg && <p className="success">{msg}</p>}

      {jobs.map((j) => (
        <div className="card" key={j.id}>
          <h3>{j.title} <small>at {j.companyName}</small> {!j.active && <span className="badge no">Inactive</span>}</h3>
          <p>CTC {j.ctc} | {j.location} | Deadline {j.deadline}</p>
          <p>Min CGPA {j.minCgpa} | Backlogs ≤ {j.maxBacklogs} | {j.allowedBranches}</p>
          <p>Skills: {j.skills.join(", ")}</p>
          <button onClick={() => edit(j)}>Edit</button>{" "}
          <button onClick={() => viewApps(j.id)}>{openJob === j.id ? "Hide" : "Applications"}</button>{" "}
          <button style={{ background: "#c62828" }} onClick={() => remove(j.id)}>Delete</button>

          {openJob === j.id && (
            <table style={{ marginTop: 12 }}>
              <thead>
                <tr><th>Application</th><th>Applied</th><th>Status</th></tr>
              </thead>
              <tbody>
                {apps.length === 0 && <tr><td colSpan="3">No applications</td></tr>}
                {apps.map((a) => (
                  <tr key={a.id}>
                    <td>#{a.id}</td>
                    <td>{new Date(a.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <select value={a.status} onChange={(e) => setStatus(a.id, e.target.value)}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}