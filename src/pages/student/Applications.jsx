import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Applications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get("/student/applications").then((res) => setApps(res.data));
  }, []);

  return (
    <div className="page">
      <h2>My Applications</h2>
      {apps.length === 0 ? (
        <p>You have not applied to any job yet.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Job</th><th>Company</th><th>Applied on</th><th>Status</th></tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id}>
                <td>{a.jobTitle}</td>
                <td>{a.companyName}</td>
                <td>{new Date(a.appliedAt).toLocaleDateString()}</td>
                <td><span className="badge">{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}