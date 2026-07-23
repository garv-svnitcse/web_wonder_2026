import React, { useState, useEffect } from 'react';

/**
 * =========================================================================
 * BACKEND API DATA SCHEMAS & DOCUMENTATION
 * =========================================================================
 * 
 * 1. QUIZ DASHBOARD (GET http://127.0.0.1:5001/quiz/dashboard)
 *    Headers: Authorization: Bearer <token>
 *    Response JSON Schema:
 *    {
 *      "name": "Explorer",              // User's name or username
 *      "email": "user@example.com",     // User's email
 *      "level": "easy" | "medium" | "hard", // Current adaptive difficulty level
 *      "highest_score": 5,              // Best score achieved
 *      "average_score": 3.2,            // Average score of all attempts
 *      "average_accuracy": 64.0,        // Average accuracy percent
 *      "total_attempts": 10,            // Total number of quizzes completed
 *      "rank": 3,                       // User rank on high score leaderboard
 *      "history": [                     // Array of previous attempts
 *        {
 *          "_id": "attempt_id_string",
 *          "user_id": "user_id_string",
 *          "quiz_id": "quiz_id_string",
 *          "difficulty": "easy",
 *          "score": 4,
 *          "wrong_selectedAnswers": 1,
 *          "total_questions": 5,
 *          "accuracy": 80.0,
 *          "level": "medium"            // Level assigned after this attempt
 *        }
 *      ]
 *    }
 * 
 * 2. START QUIZ (POST http://127.0.0.1:5001/quiz/start)
 *    Headers: Authorization: Bearer <token>
 *    Response JSON Schema:
 *    {
 *      "quiz_id": "quiz_id_string",     // Use this ID to submit the quiz later
 *      "title": "Easy Mesozoic Basics", // Title of the quiz
 *      "difficulty": "easy",            // Quiz difficulty
 *      "questions": [                   // Array of questions (selectedAnswers are omitted for integrity)
 *        {
 *          "question_id": "q1",
 *          "question": "Which dinosaur period is the oldest?",
 *          "options": ["Triassic", "Jurassic", "Cretaceous", "Permian"]
 *        }
 *      ]
 *    }
 * 
 * 3. SUBMIT QUIZ (POST http://127.0.0.1:5001/quiz/submit)
 *    Headers: Authorization: Bearer <token>
 *    Request JSON Schema:
 *    {
 *      "quiz_id": "quiz_id_string",
 *      "answer": [
 *        {
 *          "question_id": "q1",
 *          "selected_option": "Triassic"
 *        }
 *      ]
 *    }
 *    Response JSON Schema:
 *    {
 *      "score": 4,                      // Number of correct selectedAnswers
 *      "wrong_selectedAnswers": 1,              // Number of wrong selectedAnswers
 *      "accuracy": 80.0,                // Submission accuracy percent
 *      "total_questions": 5,            // Total questions in the quiz
 *      "level": "medium"                // New adaptive progression level assigned to user
 *    }
 * 
 * 4. LEADERBOARD (GET http://127.0.0.1:5001/quiz/leaderboard)
 *    Headers: Authorization: Bearer <token>
 *    Response JSON Schema:
 *    [
 *      {
 *        "rank": 1,
 *        "name": "Jane Doe",
 *        "score": 10,
 *        "level": "hard"
 *      },
 *      {
 *        "rank": 2,
 *        "name": "John Smith",
 *        "score": 8,
 *        "level": "medium"
 *      }
 *    ]
 */

export default function QuizPage() {
    // Teammate note: Set/get auth token from localStorage after authentication is implemented
    const [token, setToken] = useState(localStorage.getItem('access_token') || '');

    // UI state management
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'active-quiz' | 'leaderboard'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Backend data states
    const [dashboardData, setDashboardData] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { [question_id]: selected_option_string }
    const [submitResult, setSubmitResult] = useState(null);
    const [difficulty, setDifficulty] = useState("easy");
    const questions = currentQuiz?.questions || [];

    // Fetch Dashboard Stats
    const fetchDashboard = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://127.0.0.1:5001/quiz/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
            const data = await res.json();
            setDashboardData(data);
        } catch (err) {
            setError('Failed to fetch quiz dashboard data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Leaderboard Stats
    const fetchLeaderboard = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://127.0.0.1:5001/quiz/leaderboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
            const data = await res.json();
            setLeaderboardData(data);
        } catch (err) {
            setError('Failed to fetch leaderboard: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Start a new Quiz attempt
    const startNewQuiz = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        setSubmitResult(null);
        setSelectedAnswers({});
        try {
            const res = await fetch('http://127.0.0.1:5001/quiz/start', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
            const data = await res.json();
            setCurrentQuiz(data);
            setActiveTab('active-quiz');
        } catch (err) {
            setError('Failed to start quiz: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Submit selectedAnswers for evaluation
    const submitQuizAnswers = async () => {
        if (!token || !currentQuiz) return;
        setLoading(true);
        setError(null);

        // Format body schema: { quiz_id, answer: [{ question_id, selected_option }] }
        const formattedAnswers = Object.entries(selectedAnswers).map(([qId, option]) => ({
            question_id: qId,
            selected_option: option
        }));

        const body = {
            quiz_id: currentQuiz.quiz_id,
            answer: formattedAnswers
        };

        try {
            const res = await fetch('http://127.0.0.1:5001/quiz/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
            const data = await res.json();
            console.log("Submit Response:", data);
            setSubmitResult(data);
            setCurrentQuiz(null); // Clear quiz active state after submit
        } catch (err) {
            setError('Failed to submit quiz: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load initial dashboard stats
    useEffect(() => {
        if (token) {
            fetchDashboard();
        }
    }, [token]);

    // Handle token input manually for testing before login UI is built
    const handleSaveToken = (e) => {
        e.preventDefault();
        const inputToken = e.target.tokenInput.value.trim();
        if (inputToken) {
            localStorage.setItem('access_token', inputToken);
            setToken(inputToken);
        }
    };

    const handleAnswerChange = (questionId, selectedOption) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: selectedOption,
        }));
    };
    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at top,#1b3522 0%,#0a120d 55%,#050705 100%)",
                color: "#ECE4D8",
                fontFamily: "Poppins, sans-serif",
                overflowX: "hidden",
                position: "relative",
                paddingBottom: "100px",
            }}
        >
            {/* Background Glow */}
            <div
                style={{
                    position: "absolute",
                    top: -250,
                    right: -220,
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle,rgba(214,161,75,.18),transparent 70%)",
                    filter: "blur(55px)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    left: -200,
                    bottom: -200,
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle,rgba(40,120,60,.18),transparent 70%)",
                    filter: "blur(45px)",
                }}
            />

            <div
                style={{
                    width: "min(1400px,92%)",
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 5,
                }}
            >
                {/* HERO */}

                <section
                    style={{
                        textAlign: "center",
                        padding: "110px 0 90px",
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            padding: "10px 28px",
                            borderRadius: "999px",
                            border: "1px solid rgba(214,161,75,.25)",
                            background: "rgba(214,161,75,.08)",
                            color: "#D6A14B",
                            fontWeight: 700,
                            letterSpacing: "5px",
                            fontSize: 12,
                        }}
                    >
                        JURASSIC JOURNEY
                    </span>

                    <h1
                        style={{
                            marginTop: 35,
                            marginBottom: 25,
                            fontFamily: "Cinzel, serif",
                            fontSize: "clamp(60px,7vw,100px)",
                            lineHeight: 1,
                        }}
                    >
                        Mesozoic Quiz
                    </h1>

                    <p
                        style={{
                            width: "min(760px,90%)",
                            margin: "auto",
                            color: "#BBBBBB",
                            lineHeight: 2,
                            fontSize: 18,
                        }}
                    >
                        Challenge your prehistoric knowledge through adaptive dinosaur
                        expeditions. Rise through the explorer ranks, unlock new
                        difficulties, and compete against adventurers from around the globe.
                    </p>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(220px,1fr))",
                            gap: 25,
                            marginTop: 55,
                        }}
                    >
                        <div
                            style={{
                                background: "rgba(15,25,18,.9)",
                                padding: 30,
                                borderRadius: 22,
                                border: "1px solid rgba(214,161,75,.08)",
                            }}
                        >
                            <small
                                style={{
                                    color: "#888",
                                    letterSpacing: 3,
                                }}
                            >
                                EXPEDITIONS
                            </small>

                            <h2
                                style={{
                                    fontFamily: "Cinzel",
                                    fontSize: 46,
                                    marginTop: 15,
                                }}
                            >
                                {dashboardData?.total_attempts ?? "--"}
                            </h2>
                        </div>

                        <div
                            style={{
                                background: "rgba(15,25,18,.9)",
                                padding: 30,
                                borderRadius: 22,
                                border: "1px solid rgba(214,161,75,.08)",
                            }}
                        >
                            <small
                                style={{
                                    color: "#888",
                                    letterSpacing: 3,
                                }}
                            >
                                BEST SCORE
                            </small>

                            <h2
                                style={{
                                    fontFamily: "Cinzel",
                                    fontSize: 46,
                                    marginTop: 15,
                                }}
                            >
                                {dashboardData?.highest_score ?? "--"}
                            </h2>
                        </div>

                        <div
                            style={{
                                background: "rgba(15,25,18,.9)",
                                padding: 30,
                                borderRadius: 22,
                                border: "1px solid rgba(214,161,75,.08)",
                            }}
                        >
                            <small
                                style={{
                                    color: "#888",
                                    letterSpacing: 3,
                                }}
                            >
                                CURRENT LEVEL
                            </small>

                            <h2
                                style={{
                                    fontFamily: "Cinzel",
                                    fontSize: 46,
                                    marginTop: 15,
                                    textTransform: "uppercase",
                                }}
                            >
                                {dashboardData?.level ?? "--"}
                            </h2>
                        </div>
                    </div>
                </section>
                {/* ==========================================================
                AUTHENTICATION
========================================================== */}

                <div
                    style={{
                        width: "min(1000px,100%)",
                        margin: "0 auto 70px",
                        background: "rgba(13,23,17,.92)",
                        border: "1px solid rgba(214,161,75,.08)",
                        borderRadius: "32px",
                        overflow: "hidden",
                        backdropFilter: "blur(24px)",
                        boxShadow: "0 25px 70px rgba(0,0,0,.45)",
                    }}
                >
                    {/* Header */}

                    <div
                        style={{
                            padding: "22px 35px",
                            borderBottom: "1px solid rgba(214,161,75,.08)",
                            background:
                                "linear-gradient(90deg,rgba(214,161,75,.10),transparent)",
                        }}
                    >
                        <span
                            style={{
                                color: "#D6A14B",
                                letterSpacing: "4px",
                                fontSize: 12,
                                fontWeight: 700,
                            }}
                        >
                            EXPLORER AUTHENTICATION
                        </span>
                    </div>

                    <div
                        style={{
                            padding: "45px",
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                fontFamily: "Cinzel",
                                fontSize: 42,
                            }}
                        >
                            Access The Archive
                        </h2>

                        <p
                            style={{
                                marginTop: 18,
                                color: "#BBBBBB",
                                lineHeight: 2,
                                maxWidth: 700,
                            }}
                        >
                            Enter your explorer token to access adaptive quizzes,
                            expedition history, statistics and the worldwide
                            Jurassic Journey leaderboard.
                        </p>

                        <form
                            onSubmit={handleSaveToken}
                            style={{
                                display: "flex",
                                gap: 20,
                                marginTop: 35,
                                flexWrap: "wrap",
                            }}
                        >
                            <input
                                type="text"
                                name="tokenInput"
                                defaultValue={token}
                                placeholder="Bearer Token..."
                                style={{
                                    flex: 1,
                                    minWidth: 320,
                                    height: 68,
                                    padding: "0 25px",
                                    borderRadius: 18,
                                    border: "1px solid rgba(255,255,255,.08)",
                                    background: "rgba(255,255,255,.03)",
                                    color: "#ECE4D8",
                                    fontSize: 15,
                                    outline: "none",
                                }}
                            />

                            <button
                                type="submit"
                                style={{
                                    height: 68,
                                    padding: "0 42px",
                                    borderRadius: 50,
                                    border: "none",
                                    cursor: "pointer",
                                    background:
                                        "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                    color: "#111",
                                    fontWeight: 700,
                                    letterSpacing: 2,
                                    fontSize: 14,
                                }}
                            >
                                CONNECT
                            </button>
                        </form>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                marginTop: 28,
                                gap: 20,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <div
                                    style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: "50%",
                                        background: token ? "#42d67b" : "#ef4444",
                                    }}
                                />

                                <span
                                    style={{
                                        color: token ? "#8df0ae" : "#ff8b8b",
                                        fontWeight: 600,
                                    }}
                                >
                                    {token
                                        ? "Authentication Successful"
                                        : "Authentication Required"}
                                </span>
                            </div>

                            <span
                                style={{
                                    color: "#777",
                                    letterSpacing: 2,
                                    fontSize: 12,
                                }}
                            >
                                PREHISTORIC DATABASE SECURED
                            </span>
                        </div>
                    </div>
                </div>
                {/* ==========================================================
                        NAVIGATION
========================================================== */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "70px 0 80px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "18px",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            padding: "12px",
                            borderRadius: "60px",
                            background: "rgba(13,23,17,.90)",
                            border: "1px solid rgba(214,161,75,.08)",
                            backdropFilter: "blur(18px)",
                            boxShadow: "0 20px 60px rgba(0,0,0,.35)",
                        }}
                    >
                        {[
                            {
                                id: "dashboard",
                                title: "Dashboard",
                                subtitle: "Explorer Profile",
                            },
                            {
                                id: "active-quiz",
                                title: "Expedition",
                                subtitle: "Begin Journey",
                            },
                            {
                                id: "leaderboard",
                                title: "Leaderboard",
                                subtitle: "Hall of Fame",
                            },
                        ].map((tab) => {

                            const active = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {

                                        if (tab.id === "leaderboard") {
                                            fetchLeaderboard();
                                        }

                                        setActiveTab(tab.id);
                                    }}
                                    style={{
                                        border: "none",
                                        cursor: "pointer",
                                        minWidth: "220px",
                                        padding: "18px 30px",
                                        borderRadius: "55px",
                                        transition: ".35s",
                                        textAlign: "left",

                                        background: active
                                            ? "linear-gradient(135deg,#D6A14B,#AF7B28)"
                                            : "transparent",

                                        color: active
                                            ? "#111"
                                            : "#ECE4D8",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "17px",
                                            fontWeight: 700,
                                            marginBottom: "6px",
                                        }}
                                    >
                                        {tab.title}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "12px",
                                            letterSpacing: "2px",
                                            opacity: active ? .75 : .55,
                                        }}
                                    >
                                        {tab.subtitle}
                                    </div>
                                </button>
                            );

                        })}
                    </div>
                </div>

                {/* =======================
        Loading
======================= */}

                {loading && (

                    <div
                        style={{
                            width: "min(900px,100%)",
                            margin: "0 auto 40px",
                            padding: "22px",
                            borderRadius: "18px",
                            textAlign: "center",
                            background: "rgba(214,161,75,.08)",
                            border: "1px solid rgba(214,161,75,.15)",
                            color: "#D6A14B",
                            letterSpacing: "3px",
                            fontWeight: 600,
                        }}
                    >
                        Loading prehistoric archive...
                    </div>

                )}

                {/* =======================
        Error
======================= */}

                {error && (

                    <div
                        style={{
                            width: "min(900px,100%)",
                            margin: "0 auto 45px",
                            padding: "22px",
                            borderRadius: "18px",
                            background: "rgba(255,70,70,.08)",
                            border: "1px solid rgba(255,70,70,.18)",
                            color: "#FF8B8B",
                            textAlign: "center",
                            fontWeight: 500,
                        }}
                    >
                        {error}
                    </div>

                )}

                {/* ==========================================================
                    DASHBOARD
========================================================== */}

                {activeTab === "dashboard" && (

                    <div>
                        {/* ============================
        TOP STATS
============================ */}

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                                gap: "26px",
                                marginBottom: "45px",
                            }}
                        >

                            {[
                                {
                                    title: "Highest Score",
                                    value: dashboardData?.highest_score ?? "--",
                                    color: "#D6A14B",
                                },
                                {
                                    title: "Average Accuracy",
                                    value: dashboardData
                                        ? `${dashboardData.average_accuracy}%`
                                        : "--",
                                    color: "#58D68D",
                                },
                                {
                                    title: "Current Level",
                                    value: dashboardData?.level ?? "--",
                                    color: "#74B9FF",
                                },
                                {
                                    title: "Explorer Rank",
                                    value: dashboardData
                                        ? `#${dashboardData.rank}`
                                        : "--",
                                    color: "#F4D03F",
                                },
                            ].map((card, index) => (

                                <div
                                    key={index}
                                    style={{
                                        background: "rgba(13,23,17,.92)",
                                        border: "1px solid rgba(214,161,75,.08)",
                                        borderRadius: "28px",
                                        padding: "35px",
                                        backdropFilter: "blur(18px)",
                                        transition: ".3s",
                                        boxShadow: "0 18px 40px rgba(0,0,0,.25)",
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#777",
                                            letterSpacing: "3px",
                                            fontSize: "12px",
                                            marginBottom: "18px",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {card.title}
                                    </div>

                                    <div
                                        style={{
                                            fontFamily: "Cinzel",
                                            fontSize: "48px",
                                            color: card.color,
                                        }}
                                    >
                                        {card.value}
                                    </div>

                                </div>

                            ))}

                        </div>

                        {/* ============================
        PROFILE SECTION
============================ */}

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1.3fr .7fr",
                                gap: "30px",
                                marginBottom: "45px",
                            }}
                        >

                            <div
                                style={{
                                    background: "rgba(13,23,17,.92)",
                                    border: "1px solid rgba(214,161,75,.08)",
                                    borderRadius: "32px",
                                    padding: "45px",
                                }}
                            >

                                <span
                                    style={{
                                        color: "#D6A14B",
                                        letterSpacing: "4px",
                                        fontSize: "12px",
                                    }}
                                >
                                    EXPLORER PROFILE
                                </span>

                                <h2
                                    style={{
                                        marginTop: "18px",
                                        marginBottom: "30px",
                                        fontFamily: "Cinzel",
                                        fontSize: "48px",
                                    }}
                                >
                                    {dashboardData?.name || "Unknown Explorer"}
                                </h2>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fit,minmax(220px,1fr))",
                                        gap: "25px",
                                    }}
                                >

                                    <div>

                                        <div
                                            style={{
                                                color: "#777",
                                                fontSize: "12px",
                                                letterSpacing: "3px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            EMAIL
                                        </div>

                                        <div>{dashboardData?.email || "--"}</div>

                                    </div>

                                    <div>

                                        <div
                                            style={{
                                                color: "#777",
                                                fontSize: "12px",
                                                letterSpacing: "3px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            EXPEDITIONS
                                        </div>

                                        <div>
                                            {dashboardData?.total_attempts ?? "--"}
                                        </div>

                                    </div>

                                    <div>

                                        <div
                                            style={{
                                                color: "#777",
                                                fontSize: "12px",
                                                letterSpacing: "3px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            AVERAGE SCORE
                                        </div>

                                        <div>
                                            {dashboardData?.average_score ?? "--"}
                                        </div>

                                    </div>

                                </div>

                            </div>
                            <div
                                style={{
                                    background: "linear-gradient(180deg,#1A2416,#101712)",
                                    border: "1px solid rgba(214,161,75,.15)",
                                    borderRadius: "32px",
                                    padding: "40px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >

                                <div>

                                    <span
                                        style={{
                                            color: "#D6A14B",
                                            letterSpacing: "4px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        NEW EXPEDITION
                                    </span>

                                    <h2
                                        style={{
                                            marginTop: "18px",
                                            marginBottom: "22px",
                                            fontFamily: "Cinzel",
                                            fontSize: "40px",
                                        }}
                                    >
                                        Ready to Explore?
                                    </h2>

                                    <p
                                        style={{
                                            color: "#BBBBBB",
                                            lineHeight: 2,
                                        }}
                                    >
                                        Begin another adaptive dinosaur expedition and improve your
                                        explorer rank while discovering fascinating prehistoric facts.
                                    </p>

                                </div>

                                <button
                                    onClick={startNewQuiz}
                                    style={{
                                        marginTop: "35px",
                                        height: "68px",
                                        border: "none",
                                        cursor: "pointer",
                                        borderRadius: "55px",
                                        background:
                                            "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                        color: "#111",
                                        fontWeight: 700,
                                        letterSpacing: "2px",
                                        fontSize: "15px",
                                    }}
                                >
                                    BEGIN EXPEDITION
                                </button>

                            </div>

                        </div>

                        {/* ===========================================
            EXPEDITION HISTORY
=========================================== */}

                        <div
                            style={{
                                background: "rgba(13,23,17,.92)",
                                border: "1px solid rgba(214,161,75,.08)",
                                borderRadius: "32px",
                                overflow: "hidden",
                                backdropFilter: "blur(20px)",
                            }}
                        >

                            <div
                                style={{
                                    padding: "30px 40px",
                                    borderBottom:
                                        "1px solid rgba(214,161,75,.08)",
                                    background:
                                        "linear-gradient(90deg,rgba(214,161,75,.10),transparent)",
                                }}
                            >

                                <div
                                    style={{
                                        color: "#D6A14B",
                                        letterSpacing: "4px",
                                        fontSize: "12px",
                                        marginBottom: "12px",
                                    }}
                                >
                                    EXPEDITION HISTORY
                                </div>

                                <h2
                                    style={{
                                        margin: 0,
                                        fontFamily: "Cinzel",
                                        fontSize: "40px",
                                    }}
                                >
                                    Previous Explorations
                                </h2>

                            </div>

                            {dashboardData?.history?.length ? (

                                <div
                                    style={{
                                        overflowX: "auto",
                                    }}
                                >

                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            minWidth: "900px",
                                        }}
                                    >

                                        <thead>

                                            <tr>

                                                {[
                                                    "Difficulty",
                                                    "Score",
                                                    "Wrong",
                                                    "Accuracy",
                                                    "Questions",
                                                    "Level",
                                                ].map((heading) => (

                                                    <th
                                                        key={heading}
                                                        style={{
                                                            padding: "22px",
                                                            textAlign: "left",
                                                            color: "#D6A14B",
                                                            letterSpacing: "2px",
                                                            fontSize: "13px",
                                                            borderBottom:
                                                                "1px solid rgba(214,161,75,.08)",
                                                        }}
                                                    >
                                                        {heading}
                                                    </th>

                                                ))}

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {dashboardData.history.map((attempt, index) => (

                                                <tr
                                                    key={attempt._id || index}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom: "1px solid rgba(255,255,255,.05)",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                padding: "8px 16px",
                                                                borderRadius: "999px",
                                                                background: "rgba(214,161,75,.12)",
                                                                color: "#D6A14B",
                                                                fontSize: "13px",
                                                                fontWeight: 600,
                                                                textTransform: "capitalize",
                                                            }}
                                                        >
                                                            {attempt.difficulty}
                                                        </span>
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom: "1px solid rgba(255,255,255,.05)",
                                                            fontWeight: 700,
                                                            color: "#58D68D",
                                                        }}
                                                    >
                                                        {attempt.score}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom: "1px solid rgba(255,255,255,.05)",
                                                            color: "#FF7675",
                                                        }}
                                                    >
                                                        {attempt.wrong_answers}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom: "1px solid rgba(255,255,255,.05)",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "14px",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    flex: 1,
                                                                    height: "10px",
                                                                    borderRadius: "999px",
                                                                    background: "rgba(255,255,255,.08)",
                                                                    overflow: "hidden",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: `${attempt.accuracy}%`,
                                                                        height: "100%",
                                                                        borderRadius: "999px",
                                                                        background:
                                                                            "linear-gradient(90deg,#58D68D,#2ECC71)",
                                                                    }}
                                                                />
                                                            </div>

                                                            <span
                                                                style={{
                                                                    minWidth: "55px",
                                                                    textAlign: "right",
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {attempt.accuracy}%
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom: "1px solid rgba(255,255,255,.05)",
                                                        }}
                                                    >
                                                        {attempt.total_questions}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom: "1px solid rgba(255,255,255,.05)",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: "#74B9FF",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {attempt.level}
                                                        </span>
                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            ) : (

                                <div
                                    style={{
                                        padding: "80px 40px",
                                        textAlign: "center",
                                    }}
                                >

                                    <h3
                                        style={{
                                            fontFamily: "Cinzel",
                                            fontSize: "34px",
                                            marginBottom: "18px",
                                        }}
                                    >
                                        No Expeditions Yet
                                    </h3>

                                    <p
                                        style={{
                                            color: "#AAAAAA",
                                            maxWidth: "650px",
                                            margin: "0 auto",
                                            lineHeight: 2,
                                        }}
                                    >
                                        Your expedition log is currently empty.
                                        Begin your first dinosaur quiz to start building your
                                        prehistoric exploration history.
                                    </p>

                                    <button
                                        onClick={startNewQuiz}
                                        style={{
                                            marginTop: "35px",
                                            padding: "18px 40px",
                                            borderRadius: "999px",
                                            border: "none",
                                            cursor: "pointer",
                                            background:
                                                "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                            color: "#111",
                                            fontWeight: 700,
                                            letterSpacing: "2px",
                                        }}
                                    >
                                        START FIRST EXPEDITION
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                )}
                {/* ==========================================================
                    ACTIVE QUIZ
========================================================== */}

                {activeTab === "active-quiz" && (

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "35px",
                        }}
                    >

                        {/* ======================
    QUIZ HEADER
====================== */}

                        <div
                            style={{
                                background: "rgba(13,23,17,.92)",
                                border: "1px solid rgba(214,161,75,.08)",
                                borderRadius: "32px",
                                padding: "40px",
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "25px",
                                }}
                            >

                                <div>

                                    <span
                                        style={{
                                            color: "#D6A14B",
                                            letterSpacing: "4px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        EXPEDITION CONTROL
                                    </span>

                                    <h2
                                        style={{
                                            marginTop: "18px",
                                            marginBottom: "15px",
                                            fontFamily: "Cinzel",
                                            fontSize: "46px",
                                        }}
                                    >
                                        Dinosaur Knowledge Expedition
                                    </h2>

                                    <p
                                        style={{
                                            color: "#BBBBBB",
                                            maxWidth: "650px",
                                            lineHeight: 2,
                                        }}
                                    >
                                        Select a difficulty level and begin your adaptive
                                        prehistoric adventure.
                                    </p>

                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "15px",
                                        flexWrap: "wrap",
                                    }}
                                >

                                    {["easy", "medium", "hard"].map((level) => (

                                        <button
                                            key={level}
                                            onClick={() => setDifficulty(level)}
                                            style={{
                                                padding: "16px 28px",
                                                borderRadius: "999px",
                                                cursor: "pointer",
                                                border: "none",

                                                background:
                                                    difficulty === level
                                                        ? "linear-gradient(135deg,#D6A14B,#AF7B28)"
                                                        : "rgba(255,255,255,.05)",

                                                color:
                                                    difficulty === level
                                                        ? "#111"
                                                        : "#ECE4D8",

                                                fontWeight: 700,
                                                textTransform: "uppercase",
                                                letterSpacing: "2px",
                                            }}
                                        >
                                            {level}
                                        </button>

                                    ))}

                                </div>

                            </div>

                        </div>

                        {/* ======================
        START CARD
====================== */}

                        {questions.length === 0 && (

                            <div
                                style={{
                                    background: "rgba(13,23,17,.92)",
                                    border: "1px solid rgba(214,161,75,.08)",
                                    borderRadius: "32px",
                                    padding: "70px",
                                    textAlign: "center",
                                }}
                            >

                                <h2
                                    style={{
                                        fontFamily: "Cinzel",
                                        fontSize: "52px",
                                        marginBottom: "20px",
                                    }}
                                >
                                    Ready For Discovery?
                                </h2>

                                <p
                                    style={{
                                        color: "#BBBBBB",
                                        maxWidth: "700px",
                                        margin: "0 auto",
                                        lineHeight: 2,
                                    }}
                                >
                                    Your expedition hasn't begun yet.
                                    Press the button below to generate a new adaptive dinosaur quiz.
                                </p>

                                <button
                                    onClick={startNewQuiz}
                                    style={{
                                        marginTop: "40px",
                                        padding: "20px 48px",
                                        border: "none",
                                        borderRadius: "999px",
                                        cursor: "pointer",
                                        background:
                                            "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                        color: "#111",
                                        fontWeight: 700,
                                        letterSpacing: "2px",
                                        fontSize: "15px",
                                    }}
                                >
                                    START EXPEDITION
                                </button>

                            </div>

                        )}
                        {/* ======================
        ACTIVE QUIZ
====================== */}

                        {questions.length > 0 && (

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "30px",
                                }}
                            >

                                {/* Progress */}

                                <div
                                    style={{
                                        background: "rgba(13,23,17,.92)",
                                        border: "1px solid rgba(214,161,75,.08)",
                                        borderRadius: "28px",
                                        padding: "28px 35px",
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "18px",
                                            flexWrap: "wrap",
                                            gap: "12px",
                                        }}
                                    >

                                        <div>

                                            <div
                                                style={{
                                                    color: "#D6A14B",
                                                    fontSize: "12px",
                                                    letterSpacing: "3px",
                                                }}
                                            >
                                                QUESTION
                                            </div>

                                            <h2
                                                style={{
                                                    marginTop: "8px",
                                                    fontFamily: "Cinzel",
                                                }}
                                            >
                                                {currentQuestion + 1} / {questions.length}
                                            </h2>

                                        </div>

                                        <div
                                            style={{
                                                textAlign: "right",
                                            }}
                                        >

                                            <div
                                                style={{
                                                    color: "#888",
                                                    fontSize: "12px",
                                                    letterSpacing: "3px",
                                                }}
                                            >
                                                COMPLETION
                                            </div>

                                            <h2
                                                style={{
                                                    marginTop: "8px",
                                                    color: "#58D68D",
                                                    fontFamily: "Cinzel",
                                                }}
                                            >
                                                {Math.round(
                                                    ((currentQuestion + 1) /
                                                        questions.length) *
                                                    100
                                                )}
                                                %
                                            </h2>

                                        </div>

                                    </div>

                                    <div
                                        style={{
                                            height: "12px",
                                            borderRadius: "999px",
                                            overflow: "hidden",
                                            background: "rgba(255,255,255,.08)",
                                        }}
                                    >

                                        <div
                                            style={{
                                                height: "100%",
                                                width: `${((currentQuestion + 1) /
                                                    questions.length) *
                                                    100}%`,
                                                background:
                                                    "linear-gradient(90deg,#D6A14B,#58D68D)",
                                                transition: ".4s",
                                            }}
                                        />

                                    </div>

                                </div>

                                {/* Question */}

                                <div
                                    style={{
                                        background: "rgba(13,23,17,.92)",
                                        borderRadius: "32px",
                                        border: "1px solid rgba(214,161,75,.08)",
                                        padding: "45px",
                                    }}
                                >

                                    <span
                                        style={{
                                            color: "#D6A14B",
                                            letterSpacing: "3px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        QUESTION {currentQuestion + 1}
                                    </span>

                                    <h2
                                        style={{
                                            marginTop: "18px",
                                            marginBottom: "40px",
                                            lineHeight: 1.5,
                                            fontSize: "34px",
                                            fontFamily: "Cinzel",
                                        }}
                                    >
                                        {questions[currentQuestion].question}
                                    </h2>

                                    <div
                                        style={{
                                            display: "grid",
                                            gap: "20px",
                                        }}
                                    >

                                        {questions[currentQuestion].options.map((option) => (

                                            <button
                                                key={option}
                                                onClick={() =>
                                                    handleAnswerChange(
                                                        questions[currentQuestion].question_id,
                                                        option
                                                    )
                                                }
                                                style={{
                                                    width: "100%",
                                                    textAlign: "left",
                                                    padding: "24px 28px",
                                                    borderRadius: "18px",
                                                    cursor: "pointer",
                                                    transition: ".25s",
                                                    fontSize: "16px",

                                                    border:
                                                        selectedAnswers[
                                                            questions[currentQuestion]
                                                                .question_id
                                                        ] === option
                                                            ? "2px solid #D6A14B"
                                                            : "1px solid rgba(255,255,255,.08)",

                                                    background:
                                                        selectedAnswers[
                                                            questions[currentQuestion]
                                                                .question_id
                                                        ] === option
                                                            ? "rgba(214,161,75,.15)"
                                                            : "rgba(255,255,255,.03)",

                                                    color: "#ECE4D8",
                                                }}
                                            >
                                                {option}
                                            </button>

                                        ))}

                                    </div>

                                </div>
                                {/* ======================
            ACTIONS
    ====================== */}

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "20px",
                                    }}
                                >

                                    <button
                                        onClick={() =>
                                            setCurrentQuestion((prev) =>
                                                Math.max(prev - 1, 0)
                                            )
                                        }
                                        disabled={currentQuestion === 0}
                                        style={{
                                            padding: "18px 38px",
                                            borderRadius: "999px",
                                            border: "none",
                                            cursor:
                                                currentQuestion === 0
                                                    ? "not-allowed"
                                                    : "pointer",
                                            opacity: currentQuestion === 0 ? 0.45 : 1,
                                            background: "rgba(255,255,255,.08)",
                                            color: "#ECE4D8",
                                            fontWeight: 600,
                                            letterSpacing: "2px",
                                        }}
                                    >
                                        ← PREVIOUS
                                    </button>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "16px",
                                            flexWrap: "wrap",
                                        }}
                                    >

                                        {currentQuestion < questions.length - 1 ? (

                                            <button
                                                onClick={() =>
                                                    setCurrentQuestion((prev) => prev + 1)
                                                }
                                                style={{
                                                    padding: "18px 38px",
                                                    borderRadius: "999px",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    background:
                                                        "linear-gradient(135deg,#2F7D4A,#58D68D)",
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    letterSpacing: "2px",
                                                }}
                                            >
                                                NEXT →
                                            </button>

                                        ) : (

                                            <button
                                                onClick={submitQuizAnswers}
                                                disabled={
                                                    Object.keys(selectedAnswers).length !==
                                                    questions.length
                                                }
                                                style={{
                                                    padding: "18px 42px",
                                                    borderRadius: "999px",
                                                    border: "none",
                                                    cursor:
                                                        Object.keys(selectedAnswers).length !==
                                                            questions.length
                                                            ? "not-allowed"
                                                            : "pointer",

                                                    opacity:
                                                        Object.keys(selectedAnswers).length !==
                                                            questions.length
                                                            ? .45
                                                            : 1,

                                                    background:
                                                        "linear-gradient(135deg,#D6A14B,#AF7B28)",

                                                    color: "#111",
                                                    fontWeight: 700,
                                                    letterSpacing: "2px",
                                                }}
                                            >
                                                SUBMIT EXPEDITION
                                            </button>

                                        )}

                                    </div>

                                </div>

                                {/* Answer Counter */}

                                <div
                                    style={{
                                        textAlign: "center",
                                        color: "#888",
                                        letterSpacing: "2px",
                                        fontSize: "13px",
                                    }}
                                >
                                    Answered{" "}
                                    <span
                                        style={{
                                            color: "#D6A14B",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {Object.keys(selectedAnswers).length}
                                    </span>{" "}
                                    of{" "}
                                    <span
                                        style={{
                                            color: "#D6A14B",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {questions.length}
                                    </span>{" "}
                                    questions
                                </div>

                            </div>

                        )}

                    </div>

                )}
                {/* ==========================================================
                    QUIZ RESULTS
========================================================== */}

                {submitResult && (

                    <div
                        style={{
                            marginTop: "50px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "35px",
                        }}
                    >

                        {/* ======================
        RESULT HERO
====================== */}

                        <div
                            style={{
                                background:
                                    "linear-gradient(135deg,#18261B,#101712)",
                                borderRadius: "36px",
                                border: "1px solid rgba(214,161,75,.10)",
                                padding: "60px",
                                textAlign: "center",
                            }}
                        >

                            <span
                                style={{
                                    color: "#D6A14B",
                                    letterSpacing: "4px",
                                    fontSize: "12px",
                                }}
                            >
                                EXPEDITION COMPLETE
                            </span>

                            <h1
                                style={{
                                    marginTop: "20px",
                                    marginBottom: "20px",
                                    fontFamily: "Cinzel",
                                    fontSize: "60px",
                                }}
                            >
                                Mission Accomplished
                            </h1>

                            <p
                                style={{
                                    color: "#BBBBBB",
                                    maxWidth: "700px",
                                    margin: "0 auto",
                                    lineHeight: 2,
                                }}
                            >
                                Your dinosaur expedition has been evaluated.
                                Explore your statistics below and prepare for
                                another prehistoric adventure.
                            </p>

                        </div>

                        {/* ======================
        STATS
====================== */}

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(240px,1fr))",
                                gap: "25px",
                            }}
                        >

                            {[
                                {
                                    title: "Score",
                                    value: submitResult.score,
                                    color: "#58D68D"
                                },
                                {
                                    title: "Wrong Answers",
                                    value: submitResult.wrong_answers,
                                    color: "#FF7675"
                                },
                                {
                                    title: "Accuracy",
                                    value: `${submitResult.accuracy}%`,
                                    color: "#74B9FF"
                                },
                                {
                                    title: "Difficulty",
                                    value: submitResult.difficulty,
                                    color: "#D6A14B"
                                }
                            ].map((item, index) => (

                                <div
                                    key={index}
                                    style={{
                                        background: "rgba(13,23,17,.92)",
                                        padding: "35px",
                                        borderRadius: "30px",
                                        border: "1px solid rgba(214,161,75,.08)",
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize: "12px",
                                            letterSpacing: "3px",
                                            color: "#888",
                                            marginBottom: "18px",
                                        }}
                                    >
                                        {item.title}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "46px",
                                            fontFamily: "Cinzel",
                                            color: item.color,
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {item.value}
                                    </div>

                                </div>

                            ))}

                        </div>

                        {/* ======================
        SUMMARY
====================== */}

                        <div
                            style={{
                                background: "rgba(13,23,17,.92)",
                                borderRadius: "32px",
                                padding: "45px",
                                border: "1px solid rgba(214,161,75,.08)",
                            }}
                        >

                            <h2
                                style={{
                                    fontFamily: "Cinzel",
                                    marginBottom: "25px",
                                }}
                            >
                                Performance Summary
                            </h2>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit,minmax(250px,1fr))",
                                    gap: "25px",
                                }}
                            >

                                <div>

                                    <div
                                        style={{
                                            color: "#888",
                                            letterSpacing: "3px",
                                            fontSize: "12px",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        TOTAL QUESTIONS
                                    </div>

                                    <h3>{submitResult.total_questions}</h3>

                                </div>

                                <div>

                                    <div
                                        style={{
                                            color: "#888",
                                            letterSpacing: "3px",
                                            fontSize: "12px",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        CORRECT ANSWERS
                                    </div>

                                    <h3>{submitResult.score}</h3>

                                </div>

                                <div>

                                    <div
                                        style={{
                                            color: "#888",
                                            letterSpacing: "3px",
                                            fontSize: "12px",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        INCORRECT ANSWERS
                                    </div>

                                    <h3>{submitResult.wrong_answers}</h3>

                                </div>

                                <div>

                                    <div
                                        style={{
                                            color: "#888",
                                            letterSpacing: "3px",
                                            fontSize: "12px",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        EXPLORER LEVEL
                                    </div>

                                    <h3
                                        style={{
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {submitResult.level}
                                    </h3>

                                </div>

                            </div>

                        </div>
                        {/* ======================
        ANSWER REVIEW
====================== */}

                        {submitResult.answer_review &&
                            submitResult.answer_review.length > 0 && (

                                <div
                                    style={{
                                        background: "rgba(13,23,17,.92)",
                                        borderRadius: "32px",
                                        border: "1px solid rgba(214,161,75,.08)",
                                        overflow: "hidden",
                                    }}
                                >

                                    <div
                                        style={{
                                            padding: "30px 40px",
                                            borderBottom: "1px solid rgba(214,161,75,.08)",
                                            background:
                                                "linear-gradient(90deg,rgba(214,161,75,.10),transparent)",
                                        }}
                                    >

                                        <div
                                            style={{
                                                color: "#D6A14B",
                                                fontSize: "12px",
                                                letterSpacing: "4px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            ANSWER REVIEW
                                        </div>

                                        <h2
                                            style={{
                                                margin: 0,
                                                fontFamily: "Cinzel",
                                                fontSize: "40px",
                                            }}
                                        >
                                            Review Your Expedition
                                        </h2>

                                    </div>

                                    <div
                                        style={{
                                            padding: "35px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "25px",
                                        }}
                                    >

                                        {submitResult.answer_review.map((answer, index) => (

                                            <div
                                                key={index}
                                                style={{
                                                    padding: "28px",
                                                    borderRadius: "22px",
                                                    background:
                                                        answer.is_correct
                                                            ? "rgba(46,204,113,.08)"
                                                            : "rgba(231,76,60,.08)",

                                                    border:
                                                        answer.is_correct
                                                            ? "1px solid rgba(46,204,113,.20)"
                                                            : "1px solid rgba(231,76,60,.20)",
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        flexWrap: "wrap",
                                                        gap: "15px",
                                                    }}
                                                >

                                                    <h3
                                                        style={{
                                                            margin: 0,
                                                            fontFamily: "Cinzel",
                                                            fontSize: "28px",
                                                            flex: 1,
                                                        }}
                                                    >
                                                        Question {index + 1}
                                                    </h3>

                                                    <span
                                                        style={{
                                                            padding: "8px 18px",
                                                            borderRadius: "999px",
                                                            background:
                                                                answer.is_correct
                                                                    ? "#2ECC71"
                                                                    : "#E74C3C",
                                                            color: "#fff",
                                                            fontWeight: 700,
                                                            fontSize: "13px",
                                                            letterSpacing: "2px",
                                                        }}
                                                    >
                                                        {answer.is_correct
                                                            ? "CORRECT"
                                                            : "INCORRECT"}
                                                    </span>

                                                </div>

                                                <p
                                                    style={{
                                                        marginTop: "22px",
                                                        lineHeight: 1.8,
                                                        color: "#ECE4D8",
                                                    }}
                                                >
                                                    {answer.question}
                                                </p>

                                                <div
                                                    style={{
                                                        marginTop: "22px",
                                                        display: "grid",
                                                        gap: "14px",
                                                    }}
                                                >

                                                    <div>

                                                        <strong
                                                            style={{
                                                                color: "#74B9FF",
                                                            }}
                                                        >
                                                            Your Answer:
                                                        </strong>

                                                        <div
                                                            style={{
                                                                marginTop: "6px",
                                                            }}
                                                        >
                                                            {answer.selected_answer || "-"}
                                                        </div>

                                                    </div>

                                                    <div>

                                                        <strong
                                                            style={{
                                                                color: "#58D68D",
                                                            }}
                                                        >
                                                            Correct Answer:
                                                        </strong>

                                                        <div
                                                            style={{
                                                                marginTop: "6px",
                                                            }}
                                                        >
                                                            {answer.correct_answer}
                                                        </div>

                                                    </div>

                                                    {answer.explanation && (

                                                        <div>

                                                            <strong
                                                                style={{
                                                                    color: "#D6A14B",
                                                                }}
                                                            >
                                                                Explanation:
                                                            </strong>

                                                            <p
                                                                style={{
                                                                    marginTop: "8px",
                                                                    color: "#BBBBBB",
                                                                    lineHeight: 1.8,
                                                                }}
                                                            >
                                                                {answer.explanation}
                                                            </p>

                                                        </div>

                                                    )}

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            )}

                        {/* ======================
        ACTION BUTTONS
====================== */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "20px",
                                flexWrap: "wrap",
                                marginTop: "10px",
                            }}
                        >

                            <button
                                onClick={startNewQuiz}
                                style={{
                                    padding: "18px 42px",
                                    borderRadius: "999px",
                                    border: "none",
                                    cursor: "pointer",
                                    background:
                                        "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                    color: "#111",
                                    fontWeight: 700,
                                    letterSpacing: "2px",
                                }}
                            >
                                NEW EXPEDITION
                            </button>

                            <button
                                onClick={() => {
                                    setSubmitResult(null);
                                    setActiveTab("dashboard");
                                }}
                                style={{
                                    padding: "18px 42px",
                                    borderRadius: "999px",
                                    border: "1px solid rgba(255,255,255,.12)",
                                    cursor: "pointer",
                                    background: "rgba(255,255,255,.05)",
                                    color: "#ECE4D8",
                                    fontWeight: 700,
                                    letterSpacing: "2px",
                                }}
                            >
                                BACK TO DASHBOARD
                            </button>

                        </div>

                    </div>

                )}
                {/* ==========================================================
                    LEADERBOARD
========================================================== */}

                {activeTab === "leaderboard" && (

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "35px",
                        }}
                    >

                        <div
                            style={{
                                background:
                                    "linear-gradient(135deg,#1B2517,#101712)",
                                borderRadius: "36px",
                                padding: "60px",
                                textAlign: "center",
                                border: "1px solid rgba(214,161,75,.10)",
                            }}
                        >

                            <span
                                style={{
                                    color: "#D6A14B",
                                    letterSpacing: "4px",
                                    fontSize: "12px",
                                }}
                            >
                                WORLD RANKINGS
                            </span>

                            <h1
                                style={{
                                    fontFamily: "Cinzel",
                                    fontSize: "62px",
                                    marginTop: "20px",
                                    marginBottom: "18px",
                                }}
                            >
                                Explorer Leaderboard
                            </h1>

                            <p
                                style={{
                                    maxWidth: "700px",
                                    margin: "0 auto",
                                    color: "#BBBBBB",
                                    lineHeight: 2,
                                }}
                            >
                                Discover the greatest dinosaur explorers and compare your expedition
                                performance against adventurers from around the world.
                            </p>

                        </div>

                        {/* ==========================
        TOP 3
========================== */}

                        {leaderboardData?.length > 0 && (

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                                    gap: "25px",
                                }}
                            >

                                {leaderboardData.slice(0, 3).map((user, index) => {

                                    const medals = [
                                        "🥇",
                                        "🥈",
                                        "🥉"
                                    ];

                                    return (

                                        <div
                                            key={index}
                                            style={{
                                                background: "rgba(13,23,17,.92)",
                                                border: "1px solid rgba(214,161,75,.08)",
                                                borderRadius: "30px",
                                                padding: "40px",
                                                textAlign: "center",
                                            }}
                                        >

                                            <div
                                                style={{
                                                    fontSize: "55px",
                                                }}
                                            >
                                                {medals[index]}
                                            </div>

                                            <h2
                                                style={{
                                                    fontFamily: "Cinzel",
                                                    marginTop: "15px",
                                                    marginBottom: "12px",
                                                }}
                                            >
                                                {user.name}
                                            </h2>

                                            <div
                                                style={{
                                                    fontSize: "38px",
                                                    color: "#D6A14B",
                                                    fontFamily: "Cinzel",
                                                }}
                                            >
                                                #{index + 1}
                                            </div>

                                            <p
                                                style={{
                                                    marginTop: "15px",
                                                    color: "#BBBBBB",
                                                }}
                                            >
                                                Highest Score : {user.highest_score}
                                            </p>

                                            <p
                                                style={{
                                                    color: "#BBBBBB",
                                                }}
                                            >
                                                Accuracy : {user.average_accuracy}%
                                            </p>

                                            <p
                                                style={{
                                                    color: "#BBBBBB",
                                                }}
                                            >
                                                Level : {user.level}
                                            </p>

                                        </div>

                                    );

                                })}

                            </div>

                        )}

                        {/* ==========================
        FULL TABLE
========================== */}

                        <div
                            style={{
                                background: "rgba(13,23,17,.92)",
                                borderRadius: "32px",
                                overflow: "hidden",
                                border: "1px solid rgba(214,161,75,.08)",
                            }}
                        >

                            <div
                                style={{
                                    padding: "28px 40px",
                                    borderBottom: "1px solid rgba(214,161,75,.08)",
                                }}
                            >

                                <h2
                                    style={{
                                        margin: 0,
                                        fontFamily: "Cinzel",
                                    }}
                                >
                                    Global Rankings
                                </h2>

                            </div>

                            <div
                                style={{
                                    overflowX: "auto",
                                }}
                            >

                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        minWidth: "900px",
                                    }}
                                >

                                    <thead>

                                        <tr>

                                            {[
                                                "Rank",
                                                "Explorer",
                                                "Highest Score",
                                                "Accuracy",
                                                "Attempts",
                                                "Level"
                                            ].map(head => (

                                                <th
                                                    key={head}
                                                    style={{
                                                        padding: "22px",
                                                        textAlign: "left",
                                                        color: "#D6A14B",
                                                        letterSpacing: "2px",
                                                        borderBottom: "1px solid rgba(214,161,75,.08)",
                                                    }}
                                                >
                                                    {head}
                                                </th>

                                            ))}

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {leaderboardData?.map((user, index) => (

                                            <tr key={user._id || index}>

                                                <td
                                                    style={{
                                                        padding: "22px",
                                                        borderBottom: "1px solid rgba(255,255,255,.05)",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    #{index + 1}
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "22px",
                                                        borderBottom: "1px solid rgba(255,255,255,.05)",
                                                    }}
                                                >
                                                    {user.name}
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "22px",
                                                        borderBottom: "1px solid rgba(255,255,255,.05)",
                                                        color: "#58D68D",
                                                    }}
                                                >
                                                    {user.highest_score}
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "22px",
                                                        borderBottom: "1px solid rgba(255,255,255,.05)",
                                                    }}
                                                >
                                                    {user.average_accuracy}%
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "22px",
                                                        borderBottom: "1px solid rgba(255,255,255,.05)",
                                                    }}
                                                >
                                                    {user.total_attempts}
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "22px",
                                                        borderBottom: "1px solid rgba(255,255,255,.05)",
                                                        textTransform: "capitalize",
                                                        color: "#74B9FF",
                                                    }}
                                                >
                                                    {user.level}
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                )}

            </div>
        </div>
    );
}



