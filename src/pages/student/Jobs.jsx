import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await api.get("/student/jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const apply = async (id) => {
    try {
      await api.post(`/student/jobs/${id}/apply`);
      setMsg("Applied successfully");
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || "Could not apply");
    }
  };

  return (
    <div className="page">
      <h2>Available Jobs</h2>
      {msg && <p className="success">{msg}</p>}
      {jobs.length === 0 && <p>No jobs available.</p>}
      {jobs.map((j) => (
        <div className="card" key={j.id}>
          <h3>{j.title} <small>at {j.companyName}</small></h3>
          <p>{j.description}</p>
          <p>
            CTC: {j.ctc} LPA | Location: {j.location} | Deadline: {j.deadline}
          </p>
          <p>
            Min CGPA: {j.minCgpa} | Max backlogs: {j.maxBacklogs} | Branches: {j.allowedBranches}
          </p>
          <p>
            Skills: {j.requiredSkills.join(", ")} | Match: <b>{j.matchPercent}%</b>
          </p>
          {j.missingSkills.length > 0 && (
            <p>Missing skills: <span className="badge no">{j.missingSkills.join(", ")}</span></p>
          )}
          {j.eligible ? (
            <span className="badge ok">Eligible</span>
          ) : (
            <span className="badge no">Not eligible: {j.ineligibleReasons.join("; ")}</span>
          )}
          <div style={{ marginTop: 10 }}>
            {j.applied ? (
              <span className="badge">Already applied</span>
            ) : (
              <button disabled={!j.eligible} onClick={() => apply(j.id)}>Apply</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}