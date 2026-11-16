import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [skill, setSkill] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await api.get("/student/profile");
    setProfile(res.data);
    setForm(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    const body = {
      name: form.name,
      rollNo: form.rollNo,
      branch: form.branch,
      cgpa: form.cgpa === "" || form.cgpa == null ? null : Number(form.cgpa),
      tenthPercent: form.tenthPercent === "" || form.tenthPercent == null ? null : Number(form.tenthPercent),
      twelfthPercent: form.twelfthPercent === "" || form.twelfthPercent == null ? null : Number(form.twelfthPercent),
      backlogs: form.backlogs === "" || form.backlogs == null ? null : Number(form.backlogs),
      phone: form.phone,
    };
    const res = await api.put("/student/profile", body);
    setProfile(res.data);
    setForm(res.data);
    setMsg("Profile saved");
  };

  const addSkill = async () => {
    if (!skill.trim()) return;
    const res = await api.post("/student/skills", { name: skill });
    setProfile(res.data);
    setSkill("");
  };

  const removeSkill = async (name) => {
    const res = await api.delete(`/student/skills/${encodeURIComponent(name)}`);
    setProfile(res.data);
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await api.post("/student/resume", data);
      setProfile(res.data);
      setMsg("Resume uploaded");
    } catch {
      setMsg("Upload failed (only PDF allowed)");
    }
  };

  if (!profile) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h2>My Profile</h2>
      <form className="card form-grid" onSubmit={save}>
        <label>Name<input name="name" value={form.name || ""} onChange={change} /></label>
        <label>Roll No<input name="rollNo" value={form.rollNo || ""} onChange={change} /></label>
        <label>Branch<input name="branch" value={form.branch || ""} onChange={change} /></label>
        <label>CGPA<input name="cgpa" type="number" step="0.01" value={form.cgpa ?? ""} onChange={change} /></label>
        <label>10th %<input name="tenthPercent" type="number" step="0.01" value={form.tenthPercent ?? ""} onChange={change} /></label>
        <label>12th %<input name="twelfthPercent" type="number" step="0.01" value={form.twelfthPercent ?? ""} onChange={change} /></label>
        <label>Backlogs<input name="backlogs" type="number" value={form.backlogs ?? ""} onChange={change} /></label>
        <label>Phone<input name="phone" value={form.phone || ""} onChange={change} /></label>
        <button type="submit">Save Profile</button>
      </form>

      <div className="card">
        <h3>Skills</h3>
        <div className="chips">
          {profile.skills.map((s) => (
            <span className="chip" key={s}>
              {s} <b onClick={() => removeSkill(s)}>×</b>
            </span>
          ))}
        </div>
        <div className="row">
          <input placeholder="Add skill (e.g. Java)" value={skill} onChange={(e) => setSkill(e.target.value)} />
          <button type="button" onClick={addSkill}>Add</button>
        </div>
      </div>

      <div className="card">
        <h3>Resume (PDF)</h3>
        <p>{profile.resumePath ? `Uploaded: ${profile.resumePath}` : "Not uploaded"}</p>
        <input type="file" accept="application/pdf" onChange={uploadResume} />
      </div>

      {msg && <p className="success">{msg}</p>}
    </div>
  );
}