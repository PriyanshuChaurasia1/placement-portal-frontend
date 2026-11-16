import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Students() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get("/officer/students").then((res) => setList(res.data));
  }, []);

  const filtered = list.filter((s) =>
    `${s.name} ${s.email} ${s.rollNo || ""} ${s.branch || ""}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  return (
    <div className="page">
      <h2>Students ({filtered.length})</h2>
      <input
        style={{ marginBottom: 12, width: "100%" }}
        placeholder="Search by name, email, roll no or branch"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Roll No</th><th>Branch</th>
            <th>CGPA</th><th>Backlogs</th><th>Skills</th><th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.rollNo}</td>
              <td>{s.branch}</td>
              <td>{s.cgpa}</td>
              <td>{s.backlogs}</td>
              <td>{s.skills.join(", ")}</td>
              <td>{s.resumePath ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}