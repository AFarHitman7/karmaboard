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
            {students.map((student, index) => (
              <tr key={student.user_id}>
                <td>{index + 1}</td>
                <td>{student.full_name}</td>
                <td>{student.muid || "N/A"}</td>
                <td>{student.department}</td>
                <td>{student.karma}</td>

                <td>{student.team || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsTable;
