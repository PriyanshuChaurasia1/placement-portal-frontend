import { useEffect, useState } from "react";
import api from "../../api/axios";

function Stat({ label, value }) {
  return (
    <div className="card stat">
      <div className="stat-value">{value}</div>
      <div>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [a, setA] = useState(null);

  useEffect(() => {
    api.get("/officer/analytics").then((res) => setA(res.data));
  }, []);

  if (!a) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h2>Placement Analytics</h2>
      <div className="stats">
        <Stat label="Students" value={a.totalStudents} />
        <Stat label="Companies" value={a.totalCompanies} />
        <Stat label="Jobs" value={`${a.activeJobs}/${a.totalJobs}`} />
        <Stat label="Applications" value={a.totalApplications} />
        <Stat label="Selected" value={a.studentsSelected} />
        <Stat label="Placement %" value={`${a.placementPercent}%`} />
      </div>

      <div className="card">
        <h3>Applications by status</h3>
        {Object.entries(a.applicationsByStatus).map(([k, v]) => (
          <p key={k}>{k}: <b>{v}</b></p>
        ))}
      </div>
      <div className="card">
        <h3>Selected by branch</h3>
        {Object.keys(a.selectedByBranch).length === 0 && <p>None yet</p>}
        {Object.entries(a.selectedByBranch).map(([k, v]) => (
          <p key={k}>{k}: <b>{v}</b></p>
        ))}
      </div>
      <div className="card">
        <h3>Applications per company</h3>
        {Object.keys(a.applicationsPerCompany).length === 0 && <p>None yet</p>}
        {Object.entries(a.applicationsPerCompany).map(([k, v]) => (
          <p key={k}>{k}: <b>{v}</b></p>
        ))}
      </div>
    </div>
  );
}