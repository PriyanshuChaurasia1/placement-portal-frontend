import { useEffect, useState } from "react";
import api from "../../api/axios";

const empty = { name: "", description: "", website: "", location: "" };

export default function Companies() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await api.get("/officer/companies");
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/officer/companies/${editId}`, form);
        setMsg("Company updated");
      } else {
        await api.post("/officer/companies", form);
        setMsg("Company added");
      }
      setForm(empty);
      setEditId(null);
      load();
    } catch {
      setMsg("Could not save company");
    }
  };

  const edit = (c) => {
    setEditId(c.id);
    setForm({
      name: c.name || "",
      description: c.description || "",
      website: c.website || "",
      location: c.location || "",
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    try {
      await api.delete(`/officer/companies/${id}`);
      load();
    } catch {
      setMsg("Cannot delete: company has jobs");
    }
  };

  return (
    <div className="page">
      <h2>Companies</h2>
      <form className="card form-grid" onSubmit={submit}>
        <label>Name<input name="name" value={form.name} onChange={change} required /></label>
        <label>Website<input name="website" value={form.website} onChange={change} /></label>
        <label>Location<input name="location" value={form.location} onChange={change} /></label>
        <label>Description<input name="description" value={form.description} onChange={change} /></label>
        <button type="submit">{editId ? "Update Company" : "Add Company"}</button>
      </form>
      {msg && <p className="success">{msg}</p>}
      <table>
        <thead>
          <tr><th>Name</th><th>Location</th><th>Website</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {list.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.location}</td>
              <td>{c.website}</td>
              <td>
                <button onClick={() => edit(c)}>Edit</button>{" "}
                <button style={{ background: "#c62828" }} onClick={() => remove(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}