
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { resultStyles } from "../assets/dummyStyles";

// --------------------- Badge ---------------------
const Badge = ({ percent }) => {
  if (percent >= 85)
    return <span className={resultStyles.badgeExcellent}>Excellent</span>;
  if (percent >= 65) return <span className={resultStyles.badgeGood}>Good</span>;
  if (percent >= 45) return <span className={resultStyles.badgeAverage}>Average</span>;
  return <span className={resultStyles.badgeNeedsWork}>Needs Work</span>;
};

// --------------------- StripCard ---------------------
const StripCard = ({ item }) => {
  const percent = item.totalQuestions
    ? Math.round((Number(item.correct) / Number(item.totalQuestions)) * 100)
    : 0;

  const getLevel = (it) => {
    const id = (it.id || "").toString().toLowerCase();
    const title = (it.title || "").toString().toLowerCase();
    if (id.includes("basic") || title.includes(" basic"))
      return { letter: "B", style: resultStyles.levelBasic };
    if (id.includes("intermediate") || title.includes(" intermediate"))
      return { letter: "I", style: resultStyles.levelIntermediate };
    return { letter: "A", style: resultStyles.levelAdvanced };
  };

  const level = getLevel(item);

  return (
    <div className={resultStyles.card}>
      <div className={resultStyles.cardAccent}></div>
      <div className={resultStyles.cardContent}>
        <div className={resultStyles.cardHeader}>
          <div className={resultStyles.cardInfo}>
            <div className={`${resultStyles.levelAvatar} ${level.style}`}>
              {level.letter}
            </div>
            <div className={resultStyles.cardText}>
              <div className={resultStyles.cardTitle}>{item.title}</div>
              <div className={resultStyles.cardMeta}>
                {item.technology} • {item.level}{" "}
                {item.timeSpent ? `• ${item.timeSpent}` : ""}
              </div>
            </div>
          </div>
          <div className={resultStyles.cardPerformance}>
            <div className={resultStyles.performanceLabel}>{percent}%</div>
            <div className={resultStyles.badgeContainer}>
              <Badge percent={percent} />
            </div>
          </div>
        </div>
        <div className={resultStyles.cardStats}>
          <div className={resultStyles.statItem}>
            Correct: <span className={resultStyles.statNumber}>{item.correct}</span>
          </div>
          <div className={resultStyles.statItem}>
            Wrong: <span className={resultStyles.statNumber}>{item.wrong}</span>
          </div>
          <div className={resultStyles.statItem}>
            Total: <span className={resultStyles.statNumber}>{item.totalQuestions}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------- Main MyResultPage ---------------------
export default function MyResultPage({ apiBase = "https://bytequiz-lc95.onrender.com" }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState("all");
  const [technologies, setTechnologies] = useState([]);

  // Fetch token from localStorage
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Fetch results when component mounts or selectedTechnology changes
  useEffect(() => {
    let mounted = true;
    const fetchResults = async (tech = "all") => {
      setLoading(true);
      setError(null);
      try {
        const q = tech && tech.toLowerCase() !== "all" ? `?technology=${tech}` : "";
        const res = await axios.get(`${apiBase}/api/result${q}`, {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
          timeout: 10000,
        });
        if (!mounted) return;
        if (res.data.success) {
          setResults(Array.isArray(res.data.results) ? res.data.results : []);
        } else {
          setResults([]);
          toast.error("Failed to fetch results.");
        }
      } catch (err) {
        console.error("Failed to fetch results:", err?.response?.data || err.message || err);
        if (!mounted) return;
        if (err?.response?.status === 401) {
          setError("Not authenticated. Please login.");
          toast.error("Not authenticated. Please login.");
        } else {
          setError("Could not load results.");
          toast.error("Could not load results from server.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchResults(selectedTechnology);
    return () => {
      mounted = false;
    };
  }, [apiBase, selectedTechnology, getAuthHeader]);

  // Fetch all technologies for filter buttons
  useEffect(() => {
    let mounted = true;
    const fetchTechnologies = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/result`, {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
        });
        if (!mounted) return;
        if (res.data.success) {
          const techSet = new Set();
          res.data.results.forEach((r) => r.technology && techSet.add(r.technology));
          setTechnologies(Array.from(techSet).sort());
        }
      } catch (err) {
        console.error("Failed to fetch technologies:", err);
      }
    };
    fetchTechnologies();
    return () => (mounted = false);
  }, [apiBase, getAuthHeader]);

  // Handle technology filter click
  const handleSelectTech = (tech) => setSelectedTechnology(tech || "all");

  return (
    <div className={resultStyles.pageContainer}>
      <div className={resultStyles.container}>
        <header className={resultStyles.header}>
          <h1 className={resultStyles.title}>My Quiz Results</h1>
          <div className={resultStyles.filterButtons}>
            <span className={resultStyles.filterLabel}>Filter by tech:</span>
            <button
              onClick={() => handleSelectTech("all")}
              className={`${resultStyles.filterButton} ${
                selectedTechnology === "all"
                  ? resultStyles.filterButtonActive
                  : resultStyles.filterButtonInactive
              }`}
            >
              All
            </button>
            {technologies.map((tech) => (
              <button
                key={tech}
                onClick={() => handleSelectTech(tech)}
                className={`${resultStyles.filterButton} ${
                  selectedTechnology === tech
                    ? resultStyles.filterButtonActive
                    : resultStyles.filterButtonInactive
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </header>

        {loading && (
          <div className={resultStyles.loadingContainer}>
            <div className={resultStyles.loadingSpinner}></div>
            <div className={resultStyles.loadingText}>Loading results...</div>
          </div>
        )}

        {!loading && error && <div className={resultStyles.emptyState}>{error}</div>}

        {!loading && !error && results.length === 0 && (
          <div className={resultStyles.emptyState}>No results to display.</div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className={resultStyles.resultsGrid}>
            {results.map((item) => (
              <StripCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


