import supabase from "../supabaseClient";
import React, { useState, useEffect } from "react";
import StudentsTable from "../components/students";
import MonthlyKarma from "../components/monthlyKarma";
import TopTeam from "../components/topTeam";
import "./styles.css";

export default function Home() {
  const [campusDetails, setCampusDetails] = useState([]);
  const [monthlyStudents, setMonthlyStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date();
        const firstDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const startDate = firstDayOfMonth.toISOString().split("T")[0];

        const [monthlyResponse, studentsResponse, campusResponse] =
          await Promise.all([
            supabase.rpc("get_students_with_monthly_karma", {
              p_start_date: startDate,
            }),
            supabase
              .from("students")
              .select("*")
              .order("rank", { ascending: true }),
            supabase
              .from("campus_details")
              .select("*")
              .order("id", { ascending: false }),
          ]);

        if (monthlyResponse.error) throw monthlyResponse.error;
        if (studentsResponse.error) throw studentsResponse.error;
        if (campusResponse.error) throw campusResponse.error;

        setMonthlyStudents(monthlyResponse.data ?? []);
        setStudents(studentsResponse.data ?? []);
        setCampusDetails(campusResponse.data ?? []);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching home data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
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

  const latestCampusDetails = campusDetails[0];

  return (
    <div className="page">
      <nav className="navbar">
        <div className="title">Karmayodha</div>

        <img className="logo" src="/mutly.png" alt="Mulearn logo" />
      </nav>
      <div className="campus-details">
        <div className="detailbox">
          <p>Campus Rank</p>
          {latestCampusDetails?.rank ?? "-"}
        </div>
        <div className="detailbox">
          <p>Campus Karma</p>
          {latestCampusDetails?.karma
            ? kFormatter.format(latestCampusDetails.karma)
            : "-"}
        </div>
        <div className="detailbox">
          <p>Active members</p>
          {latestCampusDetails?.active_members ?? "-"}
        </div>
        <div className="detailbox">
          <p>Total members</p>
          {latestCampusDetails?.total_members ?? "-"}
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
