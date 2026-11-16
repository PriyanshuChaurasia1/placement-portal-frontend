import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [recs, setRecs] = useState([]);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get("/student/profile").then((r) => setProfile(r.data));
    api.get("/student/jobs/recommended").then((r) => setRecs(r.data));
    api.get("/student/applications").then((r) => setApps(r.data));
  }, []);

  if (!profile) return <div className="page">Loading...</div>;

  const count = (s) => apps.filter((a) => a.status === s).length;

  return (
    <div className="page">
      <h2>Welcome, {profile.name}</h2>

      <div className="stats">
        <div className="card stat"><div className="stat-value">{apps.length}</div>Applications</div>
        <div className="card stat"><div className="stat-value">{count("SHORTLISTED")}</div>Shortlisted</div>
        <div className="card stat"><div className="stat-value">{count("SELECTED")}</div>Selected</div>
      </div>

      <div className="card">
        <h3>Recommended jobs for you</h3>
        {recs.length === 0 && <p>No new recommendations right now.</p>}
        {recs.map((j) => (
          <p key={j.id}>
            <b>{j.title}</b> at {j.companyName} | Match <b>{j.matchPercent}%</b>
            {j.missingSkills.length > 0 && <> | Learn: {j.missingSkills.join(", ")}</>}
          </p>
        ))}
        <Link to="/student/jobs">View all jobs</Link>
      </div>
    </div>
  );
}