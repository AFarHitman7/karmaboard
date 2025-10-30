import supabase from "../supabaseClient";
import React, { useState, useEffect } from "react";
import StudentsTable from "../components/students";
import MonthlyKarma from "../components/monthlyKarma";
import TopTeam from "../components/topTeam";
import "./styles.css";

export default function Home() {
  const [campusDetails, setCampusDetails] = useState({});
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

  useEffect(() => {
    const fetchCampusDetails = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("campus_details")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          throw error;
        }

        setCampusDetails(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching campus Details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampusDetails();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  const kFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 0,
  });

  return (
    <div className="page">
      <nav className="navbar">
        <div className="title">Karmayodha</div>

        <img className="logo" src="/mutly.png" alt="Mulearn logo" />
      </nav>
      <div className="campus-details">
        <div className="detailbox">
          <p>Campus Rank</p>
          {campusDetails[0].rank}
        </div>
        <div className="detailbox">
          <p>Campus Karma</p>
          {kFormatter.format(campusDetails[0].karma)}
        </div>
        <div className="detailbox">
          <p>Active members</p>
          {campusDetails[0].active_members}
        </div>
        <div className="detailbox">
          <p>Total members</p>
          {campusDetails[0].total_members}
        </div>
      </div>
      <div className="main-container">
        <div className="monthly">
          <h2 className="monthly-heading">Monthly Ranking</h2>
          <MonthlyKarma students={monthlyStudents} />
        </div>
        <div className="team-section-container">
          <TopTeam students={monthlyStudents} />
        </div>
      </div>
      <div className="overall">
        <StudentsTable students={students} />
      </div>
    </div>
  );
}
