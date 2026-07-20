import React, { useState, useEffect } from 'react';

/**
 * =========================================================================
 * BACKEND API DATA SCHEMAS & DOCUMENTATION
 * =========================================================================
 * 
 * 1. QUIZ DASHBOARD (GET http://127.0.0.1:5000/quiz/dashboard)
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
 * 2. START QUIZ (POST http://127.0.0.1:5000/quiz/start)
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
 * 3. SUBMIT QUIZ (POST http://127.0.0.1:5000/quiz/submit)
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
 * 4. LEADERBOARD (GET http://127.0.0.1:5000/quiz/leaderboard)
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
    const [selectedselectedAnswers, setSelectedselectedAnswers] = useState({}); // { [question_id]: selected_option_string }
    const [submitResult, setSubmitResult] = useState(null);

    // Fetch Dashboard Stats
    const fetchDashboard = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://127.0.0.1:5000/quiz/dashboard', {
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
            const res = await fetch('http://127.0.0.1:5000/quiz/leaderboard', {
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
        setSelectedselectedAnswers({});
        try {
            const res = await fetch('http://127.0.0.1:5000/quiz/start', {
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
    const submitQuizselectedAnswers = async () => {
        if (!token || !currentQuiz) return;
        setLoading(true);
        setError(null);

        // Format body schema: { quiz_id, answer: [{ question_id, selected_option }] }
        const formattedselectedAnswers = Object.entries(selectedselectedAnswers).map(([qId, option]) => ({
            question_id: qId,
            selected_option: option
        }));

        const body = {
            quiz_id: currentQuiz.quiz_id,
            answer: formattedselectedAnswers
        };

        try {
            const res = await fetch('http://127.0.0.1:5000/quiz/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
            const data = await res.json();
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

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at top right,#18361E 0%,#08110B 42%,#040806 100%)",
                color: "#ECE4D8",
                fontFamily: "'Poppins', sans-serif",
                overflowX: "hidden",
                position: "relative",
                paddingBottom: "120px"
            }}
        >
            {/* Golden Glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-250px",
                    right: "-220px",
                    width: "720px",
                    height: "720px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(214,161,75,.15), transparent 70%)",
                    filter: "blur(45px)",
                    pointerEvents: "none"
                }}
            />

            {/* Forest Glow */}
            <div
                style={{
                    position: "absolute",
                    bottom: "-180px",
                    left: "-180px",
                    width: "520px",
                    height: "520px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(58,135,72,.14), transparent 70%)",
                    filter: "blur(45px)",
                    pointerEvents: "none"
                }}
            />

            {/* Main Wrapper */}
            <div
                style={{
                    width: "min(1380px,92%)",
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 2
                }}
            >

                {/* ==========================================================
                                HERO
            ========================================================== */}

                <section
                    style={{
                        textAlign: "center",
                        paddingTop: "110px",
                        paddingBottom: "90px"
                    }}
                >

                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 24px",
                            borderRadius: "999px",
                            border: "1px solid rgba(214,161,75,.25)",
                            background: "rgba(214,161,75,.08)",
                            color: "#D6A14B",
                            letterSpacing: "5px",
                            fontSize: "12px",
                            fontWeight: 600
                        }}
                    >
                        <span
                            style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#D6A14B"
                            }}
                        />

                        JURASSIC JOURNEY
                    </div>

                    <h1
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(62px,7vw,96px)",
                            marginTop: "40px",
                            marginBottom: "28px",
                            lineHeight: "1.05",
                            color: "#ECE4D8"
                        }}
                    >
                        Mesozoic Quiz
                    </h1>

                    <p
                        style={{
                            width: "min(780px,90%)",
                            margin: "0 auto",
                            color: "#BEBEBE",
                            lineHeight: "2",
                            fontSize: "18px"
                        }}
                    >
                        Step into the prehistoric world and prove your knowledge
                        across the Triassic, Jurassic and Cretaceous eras.
                        Complete adaptive expeditions, improve your explorer
                        level and compete with dinosaur enthusiasts worldwide.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "22px",
                            flexWrap: "wrap",
                            marginTop: "55px"
                        }}
                    >

                        <div
                            style={{
                                padding: "22px 34px",
                                borderRadius: "22px",
                                background: "rgba(13,23,17,.82)",
                                border: "1px solid rgba(214,161,75,.08)",
                                minWidth: "220px"
                            }}
                        >
                            <div
                                style={{
                                    color: "#777",
                                    letterSpacing: "3px",
                                    fontSize: "12px",
                                    marginBottom: "10px"
                                }}
                            >
                                EXPEDITIONS
                            </div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontFamily: "Cinzel",
                                    fontSize: "42px"
                                }}
                            >
                                {dashboardData?.total_attempts ?? "--"}
                            </h2>

                        </div>

                        <div
                            style={{
                                padding: "22px 34px",
                                borderRadius: "22px",
                                background: "rgba(13,23,17,.82)",
                                border: "1px solid rgba(214,161,75,.08)",
                                minWidth: "220px"
                            }}
                        >
                            <div
                                style={{
                                    color: "#777",
                                    letterSpacing: "3px",
                                    fontSize: "12px",
                                    marginBottom: "10px"
                                }}
                            >
                                HIGHEST SCORE
                            </div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontFamily: "Cinzel",
                                    fontSize: "42px"
                                }}
                            >
                                {dashboardData?.highest_score ?? "--"}
                            </h2>

                        </div>

                        <div
                            style={{
                                padding: "22px 34px",
                                borderRadius: "22px",
                                background: "rgba(13,23,17,.82)",
                                border: "1px solid rgba(214,161,75,.08)",
                                minWidth: "220px"
                            }}
                        >
                            <div
                                style={{
                                    color: "#777",
                                    letterSpacing: "3px",
                                    fontSize: "12px",
                                    marginBottom: "10px"
                                }}
                            >
                                CURRENT LEVEL
                            </div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontFamily: "Cinzel",
                                    fontSize: "42px",
                                    textTransform: "uppercase"
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
                        width: "min(960px,100%)",
                        margin: "0 auto",
                        background: "rgba(13,23,17,.88)",
                        border: "1px solid rgba(214,161,75,.08)",
                        borderRadius: "34px",
                        backdropFilter: "blur(24px)",
                        overflow: "hidden",
                        boxShadow: "0 30px 80px rgba(0,0,0,.45)"
                    }}
                >

                    {/* Top Bar */}

                    <div
                        style={{
                            padding: "18px 34px",
                            background:
                                "linear-gradient(90deg,rgba(214,161,75,.12),transparent)",
                            borderBottom: "1px solid rgba(214,161,75,.08)"
                        }}
                    >

                        <span
                            style={{
                                color: "#D6A14B",
                                letterSpacing: "5px",
                                fontSize: "12px",
                                fontWeight: 600
                            }}
                        >
                            EXPLORER AUTHENTICATION
                        </span>

                    </div>

                    <div
                        style={{
                            padding: "45px"
                        }}
                    >

                        <h2
                            style={{
                                margin: 0,
                                fontFamily: "'Cinzel', serif",
                                fontSize: "40px",
                                color: "#ECE4D8"
                            }}
                        >
                            Access the Archive
                        </h2>

                        <p
                            style={{
                                marginTop: "18px",
                                marginBottom: "35px",
                                color: "#B9B9B9",
                                lineHeight: "2",
                                maxWidth: "720px"
                            }}
                        >
                            Authenticate using your explorer token to retrieve
                            your expedition history, continue adaptive quizzes,
                            and compete in the Hall of Explorers.
                        </p>

                        <form
                            onSubmit={handleSaveToken}
                            style={{
                                display: "flex",
                                gap: "20px",
                                flexWrap: "wrap"
                            }}
                        >

                            <input
                                type="text"
                                name="tokenInput"
                                defaultValue={token}
                                placeholder="Bearer Token..."
                                style={{
                                    flex: 1,
                                    minWidth: "300px",
                                    height: "68px",
                                    padding: "0 24px",
                                    borderRadius: "18px",
                                    border:
                                        "1px solid rgba(255,255,255,.08)",
                                    background:
                                        "rgba(255,255,255,.03)",
                                    color: "#ECE4D8",
                                    outline: "none",
                                    fontSize: "15px"
                                }}
                            />

                            <button
                                type="submit"
                                style={{
                                    height: "68px",
                                    padding: "0 42px",
                                    border: "none",
                                    cursor: "pointer",
                                    borderRadius: "60px",
                                    fontWeight: 700,
                                    letterSpacing: "2px",
                                    background:
                                        "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                    color: "#111",
                                    fontSize: "14px",
                                    boxShadow:
                                        "0 15px 35px rgba(214,161,75,.25)"
                                }}
                            >
                                CONNECT
                            </button>

                        </form>

                        <div
                            style={{
                                marginTop: "28px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "15px"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                }}
                            >

                                <div
                                    style={{
                                        width: "14px",
                                        height: "14px",
                                        borderRadius: "50%",
                                        background: token
                                            ? "#4ADE80"
                                            : "#EF4444"
                                    }}
                                />

                                <span
                                    style={{
                                        color: token
                                            ? "#84E6A2"
                                            : "#D97A7A",
                                        fontWeight: 500
                                    }}
                                >
                                    {token
                                        ? "Authentication Successful"
                                        : "Authentication Required"}
                                </span>

                            </div>

                            <div
                                style={{
                                    color: "#777",
                                    letterSpacing: "2px",
                                    fontSize: "12px"
                                }}
                            >
                                PREHISTORIC DATABASE SECURED
                            </div>

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
                        margin: "70px 0 80px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "18px",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            padding: "12px",
                            borderRadius: "70px",
                            background: "rgba(13,23,17,.90)",
                            border: "1px solid rgba(214,161,75,.08)",
                            backdropFilter: "blur(22px)",
                            boxShadow:
                                "0 25px 60px rgba(0,0,0,.35)"
                        }}
                    >
                        {[
                            {
                                id: "dashboard",
                                title: "Dashboard",
                                subtitle: "Explorer Profile"
                            },
                            {
                                id: "active-quiz",
                                title: "Expedition",
                                subtitle: "Begin Journey"
                            },
                            {
                                id: "leaderboard",
                                title: "Leaderboard",
                                subtitle: "Global Rankings"
                            }
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

                                        padding: "18px 28px",

                                        borderRadius: "55px",

                                        transition: ".35s",

                                        minWidth: "220px",

                                        textAlign: "left",

                                        background: active
                                            ? "linear-gradient(135deg,#D6A14B,#AF7B28)"
                                            : "transparent",

                                        color: active
                                            ? "#111"
                                            : "#ECE4D8"
                                    }}
                                >

                                    <div
                                        style={{
                                            fontWeight: 700,
                                            fontSize: "16px",
                                            marginBottom: "6px"
                                        }}
                                    >
                                        {tab.title}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "12px",
                                            letterSpacing: "2px",
                                            opacity: active ? .75 : .55
                                        }}
                                    >
                                        {tab.subtitle}
                                    </div>

                                </button>

                            );

                        })}

                    </div>
                </div>

                {loading && (

                    <div
                        style={{
                            width: "min(900px,100%)",
                            margin: "0 auto 45px",
                            padding: "22px",
                            borderRadius: "18px",
                            textAlign: "center",
                            background: "rgba(214,161,75,.08)",
                            border: "1px solid rgba(214,161,75,.12)",
                            color: "#D6A14B",
                            letterSpacing: "3px"
                        }}
                    >
                        Loading prehistoric archive...
                    </div>

                )}

                {error && (

                    <div
                        style={{
                            width: "min(900px,100%)",
                            margin: "0 auto 45px",
                            padding: "22px",
                            borderRadius: "18px",
                            textAlign: "center",
                            background: "rgba(255,80,80,.08)",
                            border: "1px solid rgba(255,80,80,.18)",
                            color: "#ff8b8b"
                        }}
                    >
                        {error}
                    </div>

                )}

                {/* ==========================================================
                            DASHBOARD STARTS HERE
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
                                marginBottom: "45px"
                            }}
                        >

                            {[
                                {
                                    title: "Highest Score",
                                    value: dashboardData?.highest_score ?? "--"
                                },
                                {
                                    title: "Average Accuracy",
                                    value: dashboardData
                                        ? dashboardData.average_accuracy + "%"
                                        : "--"
                                },
                                {
                                    title: "Current Level",
                                    value: dashboardData?.level ?? "--"
                                },
                                {
                                    title: "Explorer Rank",
                                    value: dashboardData
                                        ? "#" + dashboardData.rank
                                        : "--"
                                }

                            ].map((item, index) => (

                                <div
                                    key={index}
                                    style={{
                                        background: "rgba(13,23,17,.9)",
                                        border: "1px solid rgba(214,161,75,.08)",
                                        borderRadius: "28px",
                                        padding: "35px",
                                        backdropFilter: "blur(20px)",
                                        transition: ".35s"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#777",
                                            letterSpacing: "3px",
                                            fontSize: "12px",
                                            marginBottom: "18px"
                                        }}
                                    >
                                        {item.title}
                                    </div>

                                    <div
                                        style={{
                                            fontFamily: "Cinzel",
                                            fontSize: "46px",
                                            color: "#ECE4D8"
                                        }}
                                    >
                                        {item.value}
                                    </div>

                                </div>

                            ))}

                        </div>

                        {/* ============================
                PROFILE + CTA
        ============================ */}

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1.2fr .8fr",
                                gap: "30px",
                                marginBottom: "45px"
                            }}
                        >

                            <div
                                style={{
                                    background: "rgba(13,23,17,.9)",
                                    border: "1px solid rgba(214,161,75,.08)",
                                    borderRadius: "32px",
                                    padding: "45px"
                                }}
                            >

                                <span
                                    style={{
                                        color: "#D6A14B",
                                        letterSpacing: "5px",
                                        fontSize: "12px"
                                    }}
                                >
                                    EXPLORER PROFILE
                                </span>

                                <h2
                                    style={{
                                        fontFamily: "Cinzel",
                                        fontSize: "48px",
                                        marginTop: "18px",
                                        marginBottom: "35px"
                                    }}
                                >
                                    {dashboardData?.name || "Unknown Explorer"}
                                </h2>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                                        gap: "25px"
                                    }}
                                >

                                    <div>

                                        <div
                                            style={{
                                                color: "#777",
                                                letterSpacing: "3px",
                                                fontSize: "12px",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            EMAIL
                                        </div>

                                        <div
                                            style={{
                                                color: "#ECE4D8"
                                            }}
                                        >
                                            {dashboardData?.email || "--"}
                                        </div>

                                    </div>

                                    <div>

                                        <div
                                            style={{
                                                color: "#777",
                                                letterSpacing: "3px",
                                                fontSize: "12px",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            TOTAL EXPEDITIONS
                                        </div>

                                        <div
                                            style={{
                                                color: "#ECE4D8"
                                            }}
                                        >
                                            {dashboardData?.total_attempts ?? "--"}
                                        </div>

                                    </div>

                                    <div>

                                        <div
                                            style={{
                                                color: "#777",
                                                letterSpacing: "3px",
                                                fontSize: "12px",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            AVERAGE SCORE
                                        </div>

                                        <div
                                            style={{
                                                color: "#ECE4D8"
                                            }}
                                        >
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
                                    justifyContent: "space-between"
                                }}
                            >

                                <div>

                                    <span
                                        style={{
                                            color: "#D6A14B",
                                            letterSpacing: "5px",
                                            fontSize: "12px"
                                        }}
                                    >
                                        NEW EXPEDITION
                                    </span>

                                    <h2
                                        style={{
                                            fontFamily: "Cinzel",
                                            fontSize: "40px",
                                            marginTop: "18px",
                                            marginBottom: "22px"
                                        }}
                                    >
                                        Ready to Explore?
                                    </h2>

                                    <p
                                        style={{
                                            color: "#BDBDBD",
                                            lineHeight: "2"
                                        }}
                                    >
                                        Begin a new adaptive dinosaur expedition,
                                        answer challenging questions and improve your
                                        global ranking.
                                    </p>

                                </div>

                                <button
                                    onClick={startNewQuiz}
                                    style={{
                                        marginTop: "35px",
                                        height: "68px",
                                        border: "none",
                                        cursor: "pointer",
                                        borderRadius: "50px",
                                        fontWeight: 700,
                                        letterSpacing: "2px",
                                        background:
                                            "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                        color: "#111",
                                        fontSize: "15px"
                                    }}
                                >
                                    BEGIN EXPEDITION
                                </button>

                            </div>

                        </div>
                        {/* ============================
            EXPEDITION HISTORY
        ============================ */}

                        <div
                            style={{
                                background: "rgba(13,23,17,.90)",
                                border: "1px solid rgba(214,161,75,.08)",
                                borderRadius: "32px",
                                overflow: "hidden",
                                backdropFilter: "blur(20px)"
                            }}
                        >

                            <div
                                style={{
                                    padding: "30px 40px",
                                    borderBottom: "1px solid rgba(214,161,75,.08)",
                                    background:
                                        "linear-gradient(90deg,rgba(214,161,75,.10),transparent)"
                                }}
                            >

                                <div
                                    style={{
                                        color: "#D6A14B",
                                        letterSpacing: "5px",
                                        fontSize: "12px",
                                        marginBottom: "12px"
                                    }}
                                >
                                    EXPEDITION HISTORY
                                </div>

                                <h2
                                    style={{
                                        fontFamily: "Cinzel",
                                        fontSize: "40px",
                                        margin: 0
                                    }}
                                >
                                    Previous Explorations
                                </h2>

                            </div>

                            {dashboardData?.recent_attempts?.length ? (

                                <div
                                    style={{
                                        overflowX: "auto"
                                    }}
                                >

                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            minWidth: "950px"
                                        }}
                                    >

                                        <thead>

                                            <tr>

                                                {[
                                                    "Quiz",
                                                    "Difficulty",
                                                    "Score",
                                                    "Accuracy",
                                                    "Questions",
                                                    "Date"
                                                ].map((heading) => (

                                                    <th
                                                        key={heading}
                                                        style={{
                                                            padding: "22px",
                                                            textAlign: "left",
                                                            color: "#D6A14B",
                                                            fontWeight: 600,
                                                            letterSpacing: "2px",
                                                            fontSize: "13px",
                                                            borderBottom:
                                                                "1px solid rgba(214,161,75,.08)"
                                                        }}
                                                    >
                                                        {heading}
                                                    </th>

                                                ))}

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {dashboardData.recent_attempts.map((attempt, index) => (

                                                <tr
                                                    key={attempt.id || index}
                                                    style={{
                                                        transition: ".25s"
                                                    }}
                                                >

                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom:
                                                                "1px solid rgba(255,255,255,.04)",
                                                            color: "#ECE4D8",
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {attempt.quiz_title ||
                                                            attempt.quiz_name ||
                                                            `Expedition ${index + 1}`}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom:
                                                                "1px solid rgba(255,255,255,.04)"
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                padding: "8px 18px",
                                                                borderRadius: "30px",
                                                                background:
                                                                    "rgba(214,161,75,.12)",
                                                                color: "#D6A14B",
                                                                fontSize: "13px"
                                                            }}
                                                        >
                                                            {attempt.difficulty || "--"}
                                                        </span>
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom:
                                                                "1px solid rgba(255,255,255,.04)",
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {attempt.score}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom:
                                                                "1px solid rgba(255,255,255,.04)"
                                                        }}
                                                    >
                                                        {attempt.accuracy}%
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom:
                                                                "1px solid rgba(255,255,255,.04)"
                                                        }}
                                                    >
                                                        {attempt.total_questions}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "22px",
                                                            borderBottom:
                                                                "1px solid rgba(255,255,255,.04)",
                                                            color: "#AFAFAF"
                                                        }}
                                                    >
                                                        {attempt.completed_at
                                                            ? new Date(
                                                                attempt.completed_at
                                                            ).toLocaleDateString()
                                                            : "--"}
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
                                        textAlign: "center"
                                    }}
                                >

                                    <div
                                        style={{
                                            fontFamily: "Cinzel",
                                            fontSize: "42px",
                                            marginBottom: "18px"
                                        }}
                                    >
                                        No Expeditions Yet
                                    </div>

                                    <p
                                        style={{
                                            color: "#AFAFAF",
                                            maxWidth: "650px",
                                            margin: "0 auto",
                                            lineHeight: "2"
                                        }}
                                    >
                                        Your prehistoric adventure hasn't started yet.
                                        Complete your first expedition to unlock statistics,
                                        achievements and appear on the global leaderboard.
                                    </p>

                                    <button
                                        onClick={startNewQuiz}
                                        style={{
                                            marginTop: "40px",
                                            height: "65px",
                                            padding: "0 40px",
                                            border: "none",
                                            borderRadius: "50px",
                                            cursor: "pointer",
                                            background:
                                                "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                            color: "#111",
                                            fontWeight: 700,
                                            letterSpacing: "2px"
                                        }}
                                    >
                                        START FIRST EXPEDITION
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>
                )}
                {activeTab === "active-quiz" && (
                    <div
                        style={{
                            maxWidth: "1100px",
                            margin: "0 auto"
                        }}
                    >

                        {/* ======================================
                    EXPEDITION HEADER
        ====================================== */}

                        <div
                            style={{
                                background: "rgba(13,23,17,.92)",
                                border: "1px solid rgba(214,161,75,.08)",
                                borderRadius: "32px",
                                padding: "45px",
                                marginBottom: "35px",
                                backdropFilter: "blur(20px)"
                            }}
                        >

                            <span
                                style={{
                                    color: "#D6A14B",
                                    letterSpacing: "5px",
                                    fontSize: "12px"
                                }}
                            >
                                ACTIVE EXPEDITION
                            </span>

                            <h1
                                style={{
                                    fontFamily: "Cinzel",
                                    fontSize: "52px",
                                    marginTop: "18px",
                                    marginBottom: "20px"
                                }}
                            >
                                {currentQuiz?.title || "Dinosaur Knowledge Expedition"}
                            </h1>

                            <p
                                style={{
                                    color: "#BDBDBD",
                                    lineHeight: "2",
                                    maxWidth: "700px"
                                }}
                            >
                                Carefully study each question before choosing your answer.
                                Every correct response increases your expedition score and
                                improves your position on the global leaderboard.
                            </p>

                        </div>

                        {/* ======================================
                    PROGRESS
        ====================================== */}

                        <div
                            style={{
                                background: "rgba(13,23,17,.90)",
                                border: "1px solid rgba(214,161,75,.08)",
                                borderRadius: "26px",
                                padding: "30px",
                                marginBottom: "35px"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "18px",
                                    flexWrap: "wrap",
                                    gap: "12px"
                                }}
                            >

                                <span
                                    style={{
                                        color: "#ECE4D8",
                                        fontWeight: 600
                                    }}
                                >
                                    Progress
                                </span>

                                <span
                                    style={{
                                        color: "#D6A14B",
                                        fontWeight: 700
                                    }}
                                >
                                    {selectedselectedAnswers.filter(Boolean).length} / {currentQuiz?.questions?.length || 0}
                                </span>

                            </div>

                            <div
                                style={{
                                    height: "14px",
                                    borderRadius: "50px",
                                    overflow: "hidden",
                                    background: "rgba(255,255,255,.06)"
                                }}
                            >

                                <div
                                    style={{
                                        width: `${currentQuiz?.questions?.length
                                            ? (selectedAnswers.filter(Boolean).length /
                                                currentQuiz.questions.length) *
                                            100
                                            : 0
                                            }%`,
                                        height: "100%",
                                        transition: ".4s",
                                        background:
                                            "linear-gradient(90deg,#D6A14B,#E8C777)"
                                    }}
                                />

                            </div>

                        </div>

                        {/* ======================================
                    QUESTION CARD
        ====================================== */}

                        {currentQuiz?.questions?.map((question, questionIndex) => (

                            <div
                                key={question.id || questionIndex}
                                style={{
                                    background: "rgba(13,23,17,.92)",
                                    border: "1px solid rgba(214,161,75,.08)",
                                    borderRadius: "32px",
                                    padding: "45px",
                                    marginBottom: "35px"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                        marginBottom: "25px"
                                    }}
                                >

                                    <div
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                            borderRadius: "50%",
                                            background:
                                                "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                            color: "#111",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontWeight: 700,
                                            fontSize: "20px"
                                        }}
                                    >
                                        {questionIndex + 1}
                                    </div>

                                    <div>

                                        <div
                                            style={{
                                                color: "#777",
                                                letterSpacing: "3px",
                                                fontSize: "12px"
                                            }}
                                        >
                                            QUESTION
                                        </div>

                                        <h2
                                            style={{
                                                marginTop: "10px",
                                                fontFamily: "Cinzel",
                                                fontSize: "34px"
                                            }}
                                        >
                                            {question.question}
                                        </h2>

                                    </div>

                                </div>

                                {/* OPTIONS START BELOW */}
                                <div
                                    style={{
                                        display: "grid",
                                        gap: "18px"
                                    }}
                                >

                                    {question.options.map((option, optionIndex) => {

                                        const selected =
                                            selectedAnswers[questionIndex] === option;

                                        return (

                                            <label
                                                key={optionIndex}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "22px",
                                                    padding: "22px 24px",
                                                    borderRadius: "22px",
                                                    cursor: "pointer",
                                                    transition: ".3s",

                                                    background: selected
                                                        ? "linear-gradient(135deg,rgba(214,161,75,.22),rgba(214,161,75,.08))"
                                                        : "rgba(255,255,255,.03)",

                                                    border: selected
                                                        ? "1px solid rgba(214,161,75,.45)"
                                                        : "1px solid rgba(255,255,255,.06)"
                                                }}
                                            >

                                                <input
                                                    type="radio"
                                                    name={`question-${questionIndex}`}
                                                    checked={selected}
                                                    onChange={() =>
                                                        handleAnswerChange(
                                                            questionIndex,
                                                            option
                                                        )
                                                    }
                                                    style={{
                                                        display: "none"
                                                    }}
                                                />

                                                <div
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontWeight: 700,
                                                        fontSize: "18px",

                                                        background: selected
                                                            ? "#D6A14B"
                                                            : "rgba(255,255,255,.06)",

                                                        color: selected
                                                            ? "#111"
                                                            : "#ECE4D8"
                                                    }}
                                                >
                                                    {String.fromCharCode(
                                                        65 + optionIndex
                                                    )}
                                                </div>

                                                <div
                                                    style={{
                                                        flex: 1,
                                                        color: "#ECE4D8",
                                                        fontSize: "17px",
                                                        lineHeight: "1.8"
                                                    }}
                                                >
                                                    {option}
                                                </div>

                                                {selected && (

                                                    <div
                                                        style={{
                                                            color: "#D6A14B",
                                                            fontWeight: 700,
                                                            letterSpacing: "2px"
                                                        }}
                                                    >
                                                        SELECTED
                                                    </div>

                                                )}

                                            </label>

                                        );

                                    })}

                                </div>

                            </div>

                        ))}

                        {/* ======================================
                SUBMIT SECTION
        ====================================== */}

                        <div
                            style={{
                                marginTop: "55px",
                                textAlign: "center"
                            }}
                        >

                            <button
                                onClick={submitQuizselectedAnswers}
                                disabled={
                                    selectedAnswers.filter(Boolean).length !==
                                    (currentQuiz?.questions?.length || 0)
                                }
                                style={{
                                    height: "74px",
                                    padding: "0 65px",
                                    border: "none",
                                    cursor:
                                        selectedAnswers.filter(Boolean).length ===
                                            (currentQuiz?.questions?.length || 0)
                                            ? "pointer"
                                            : "not-allowed",
                                    borderRadius: "60px",
                                    fontWeight: 700,
                                    letterSpacing: "3px",
                                    fontSize: "15px",

                                    background:
                                        selectedAnswers.filter(Boolean).length ===
                                            (currentQuiz?.questions?.length || 0)
                                            ? "linear-gradient(135deg,#D6A14B,#AF7B28)"
                                            : "#555",

                                    color:
                                        selectedAnswers.filter(Boolean).length ===
                                            (currentQuiz?.questions?.length || 0)
                                            ? "#111"
                                            : "#DDD",

                                    transition: ".3s"
                                }}
                            >
                                SUBMIT EXPEDITION
                            </button>

                            <p
                                style={{
                                    marginTop: "22px",
                                    color: "#9A9A9A",
                                    lineHeight: "1.8"
                                }}
                            >
                                Answer every question before submitting your expedition.
                            </p>

                        </div>

                    </div>
                )}
                {activeTab === "results" && quizResults && (
                    <div
                        style={{
                            maxWidth: "1100px",
                            margin: "0 auto"
                        }}
                    >

                        {/* ======================================
                RESULTS HERO
        ====================================== */}

                        <div
                            style={{
                                background:
                                    "linear-gradient(135deg,#182317,#0D1711)",
                                border: "1px solid rgba(214,161,75,.12)",
                                borderRadius: "36px",
                                padding: "60px",
                                textAlign: "center",
                                marginBottom: "40px"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "70px",
                                    marginBottom: "20px"
                                }}
                            >
                                🦖
                            </div>

                            <div
                                style={{
                                    color: "#D6A14B",
                                    letterSpacing: "5px",
                                    fontSize: "12px"
                                }}
                            >
                                EXPEDITION COMPLETE
                            </div>

                            <h1
                                style={{
                                    fontFamily: "Cinzel",
                                    fontSize: "60px",
                                    marginTop: "20px",
                                    marginBottom: "18px"
                                }}
                            >
                                Congratulations Explorer
                            </h1>

                            <p
                                style={{
                                    color: "#BDBDBD",
                                    lineHeight: "2",
                                    maxWidth: "700px",
                                    margin: "0 auto"
                                }}
                            >
                                You successfully completed another prehistoric
                                expedition. Your performance has been recorded in
                                the Jurassic Journey archives.
                            </p>

                        </div>

                        {/* ======================================
                    SCORE CARDS
        ====================================== */}

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(230px,1fr))",
                                gap: "25px",
                                marginBottom: "40px"
                            }}
                        >

                            {[
                                {
                                    title: "Final Score",
                                    value: quizResults.score
                                },
                                {
                                    title: "Accuracy",
                                    value: quizResults.accuracy + "%"
                                },
                                {
                                    title: "Correct",
                                    value: quizResults.correct_selectedAnswers
                                },
                                {
                                    title: "Rank",
                                    value:
                                        quizResults.rank
                                            ? "#" + quizResults.rank
                                            : "--"
                                }

                            ].map((card, index) => (

                                <div
                                    key={index}
                                    style={{
                                        background: "rgba(13,23,17,.92)",
                                        border: "1px solid rgba(214,161,75,.08)",
                                        borderRadius: "28px",
                                        padding: "35px"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#777",
                                            letterSpacing: "3px",
                                            fontSize: "12px",
                                            marginBottom: "15px"
                                        }}
                                    >
                                        {card.title}
                                    </div>

                                    <div
                                        style={{
                                            fontFamily: "Cinzel",
                                            fontSize: "48px"
                                        }}
                                    >
                                        {card.value}
                                    </div>

                                </div>

                            ))}

                        </div>

                        {/* ======================================
                PERFORMANCE SUMMARY
        ====================================== */}

                        <div
                            style={{
                                background: "rgba(13,23,17,.92)",
                                border: "1px solid rgba(214,161,75,.08)",
                                borderRadius: "30px",
                                padding: "45px",
                                marginBottom: "40px"
                            }}
                        >

                            <span
                                style={{
                                    color: "#D6A14B",
                                    letterSpacing: "5px",
                                    fontSize: "12px"
                                }}
                            >
                                PERFORMANCE REPORT
                            </span>

                            <h2
                                style={{
                                    fontFamily: "Cinzel",
                                    fontSize: "42px",
                                    marginTop: "18px"
                                }}
                            >
                                Expedition Summary
                            </h2>

                            <p
                                style={{
                                    color: "#BDBDBD",
                                    lineHeight: "2",
                                    marginTop: "20px"
                                }}
                            >
                                Score achieved:
                                <strong> {quizResults.score}</strong>
                                <br />

                                Correct selectedAnswers:
                                <strong> {quizResults.correct_selectedAnswers}</strong>

                                <br />

                                Accuracy:
                                <strong> {quizResults.accuracy}%</strong>

                                <br />

                                Difficulty:
                                <strong> {quizResults.difficulty}</strong>

                                <br />

                                Experience Earned:
                                <strong>
                                    {" "}
                                    {quizResults.experience_points}
                                </strong>
                            </p>

                        </div>

                        <div
                            style={{
                                textAlign: "center"
                            }}
                        >

                            <button
                                onClick={fetchDashboard}
                                style={{
                                    height: "68px",
                                    padding: "0 55px",
                                    border: "none",
                                    cursor: "pointer",
                                    borderRadius: "50px",
                                    fontWeight: 700,
                                    letterSpacing: "2px",
                                    background:
                                        "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                    color: "#111",
                                    fontSize: "15px"
                                }}
                            >
                                RETURN TO DASHBOARD
                            </button>

                        </div>

                    </div>
                )}
                {activeTab === "leaderboard" && (
                    <div
                        style={{
                            maxWidth: "1200px",
                            margin: "0 auto"
                        }}
                    >

                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: "45px"
                            }}
                        >

                            <div
                                style={{
                                    color: "#D6A14B",
                                    letterSpacing: "5px",
                                    fontSize: "12px"
                                }}
                            >
                                HALL OF EXPLORERS
                            </div>

                            <h1
                                style={{
                                    fontFamily: "Cinzel",
                                    fontSize: "60px",
                                    marginTop: "20px"
                                }}
                            >
                                Global Leaderboard
                            </h1>

                        </div>

                        <div
                            style={{
                                background: "rgba(13,23,17,.92)",
                                borderRadius: "30px",
                                overflow: "hidden",
                                border: "1px solid rgba(214,161,75,.08)"
                            }}
                        >

                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse"
                                }}
                            >

                                <thead>

                                    <tr>

                                        {[
                                            "Rank",
                                            "Explorer",
                                            "Level",
                                            "Highest Score",
                                            "Accuracy"
                                        ].map(h => (
                                            <th
                                                key={h}
                                                style={{
                                                    padding: "24px",
                                                    textAlign: "left",
                                                    color: "#D6A14B",
                                                    borderBottom: "1px solid rgba(214,161,75,.08)"
                                                }}
                                            >
                                                {h}
                                            </th>
                                        ))}

                                    </tr>

                                </thead>

                                <tbody>

                                    {leaderboard.map((player, index) => (

                                        <tr key={index}>

                                            <td style={{ padding: "24px" }}>
                                                {index === 0
                                                    ? "🥇"
                                                    : index === 1
                                                        ? "🥈"
                                                        : index === 2
                                                            ? "🥉"
                                                            : "#" + (index + 1)}
                                            </td>

                                            <td style={{ padding: "24px" }}>
                                                {player.name}
                                            </td>

                                            <td style={{ padding: "24px" }}>
                                                {player.level}
                                            </td>

                                            <td style={{ padding: "24px" }}>
                                                {player.highest_score}
                                            </td>

                                            <td style={{ padding: "24px" }}>
                                                {player.average_accuracy}%
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

