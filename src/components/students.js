import React from "react";
import "../pages/styles.css";
const StudentsTable = ({ students }) => {
  return (
    <div className="table-wrapper">
      {" "}
      <h2 className="overall-rankings-heading">Overall Rankings</h2>{" "}
      <div className="table-scroll-container">
        <table className="overall-rankings-table">
          {" "}
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Name</th>

              <th>Muid</th>
              <th>Department</th>
              <th>Karma</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 60).map((student, index) => (
              <tr key={student.user_id}>
                <td data-label="Rank">{index + 1}</td>
                <td data-label="Name">{student.full_name}</td>
                <td data-label="Muid">{student.muid || "N/A"}</td>
                <td data-label="Department" d>
                  {student.department}
                </td>
                <td data-label="Karma">{student.karma}</td>

                <td data-label="Team">{student.team || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsTable;
