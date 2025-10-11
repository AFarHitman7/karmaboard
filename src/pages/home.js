import supabase from "../supabaseClient";
import React, { useState, useEffect } from "react";
import StudentsTable from "../components/students";
import MonthlyKarma from "../components/monthlyKarma";
import TopTeam from "../components/topTeam";
import "./styles.css";

export default function Home() {
  const [monthlyStudents, setMonthlyStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyStudents = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const firstDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const startDate = firstDayOfMonth.toISOString().split("T")[0]; // A simpler way to format YYYY-MM-DD

        const { data, error } = await supabase.rpc(
          "get_students_with_monthly_karma",
          { p_start_date: startDate }
        );

        if (error) {
          throw error;
        }

        setMonthlyStudents(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching students:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyStudents();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("students")
          .select("*")
          .order("rank", { ascending: true });

        if (error) {
          throw error;
        }

        setStudents(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching students:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <div className="page">
      <nav className="navbar">
        <img className="logo" src="/mutly.png" alt="Mulearn logo" />

        <div className="title">Karmayodha</div>
      </nav>
      <div className="main-container">
        <div className="monthly">
          <h2 className="monthly-heading">Monthly Ranking</h2>
          <MonthlyKarma students={monthlyStudents} />
        </div>
        <div className="teams">
          <TopTeam students={monthlyStudents} />
        </div>
      </div>
      <div className="overall">
        <StudentsTable students={students} />
      </div>
    </div>
  );
}
