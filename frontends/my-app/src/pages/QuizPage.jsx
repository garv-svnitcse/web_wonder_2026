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
 *      "score": 4,                      // Number of correct answers
 *      "wrong_answers": 1,              // Number of wrong answers
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
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { [question_id]: selected_option_string }
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
        setSelectedAnswers({});
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

    // Submit Answers for evaluation
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
                background: "#07100B",
                color: "#ECE4D8",
                padding: "120px 0 80px",
                position: "relative",
                overflow: "hidden",
                fontFamily: "'Poppins', sans-serif"
            }}
        >

            {/* subtle glow */}

            <div
                style={{
                    position: "absolute",
                    width: "600px",
                    height: "600px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(214,161,75,.08), transparent 70%)",
                    top: "-250px",
                    right: "-200px",
                    pointerEvents: "none"
                }}
            />

            <div
                style={{
                    width: "min(1300px,92%)",
                    margin: "auto"
                }}
            >

                {/* Heading */}

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "80px"
                    }}
                >

                    <span
                        style={{
                            display: "block",
                            color: "#D6A14B",
                            letterSpacing: "8px",
                            fontSize: "13px",
                            marginBottom: "18px",
                            textTransform: "uppercase"
                        }}
                    >
                        Jurassic Journey
                    </span>

                    <h1
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(52px,6vw,78px)",
                            color: "#ECE4D8",
                            marginBottom: "24px",
                            lineHeight: 1.2
                        }}
                    >
                        Mesozoic Quiz
                    </h1>

                    <p
                        style={{
                            maxWidth: "760px",
                            margin: "auto",
                            color: "#BDBDBD",
                            lineHeight: "2",
                            fontSize: "18px"
                        }}
                    >
                        Challenge yourself with adaptive dinosaur quizzes, monitor your
                        expedition history, climb the explorer rankings and prove your
                        knowledge of the prehistoric world.
                    </p>

                </div>

                {/* Token Card */}

                <div
                    style={{
                        maxWidth: "900px",
                        margin: "0 auto 40px",
                        padding: "45px",
                        borderRadius: "30px",
                        background: "rgba(13,23,17,.92)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(214,161,75,.08)",
                        boxShadow:
                            "0 25px 70px rgba(0,0,0,.45)"
                    }}
                >

                    <h2
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "34px",
                            color: "#ECE4D8",
                            marginBottom: "10px"
                        }}
                    >
                        Authentication
                    </h2>

                    <p
                        style={{
                            color: "#BDBDBD",
                            lineHeight: "1.8",
                            marginBottom: "30px"
                        }}
                    >
                        Enter your access token to connect with the prehistoric archive.
                    </p>

                    <form
                        onSubmit={handleSaveToken}
                        style={{
                            display: "flex",
                            gap: "18px",
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
                                minWidth: "250px",
                                height: "62px",
                                padding: "0 24px",
                                borderRadius: "18px",
                                border: "1px solid rgba(255,255,255,.08)",
                                background: "rgba(255,255,255,.03)",
                                color: "#ECE4D8",
                                outline: "none",
                                fontSize: "15px"
                            }}
                        />

                        <button
                            type="submit"
                            style={{
                                height: "62px",
                                padding: "0 34px",
                                border: "none",
                                borderRadius: "50px",
                                cursor: "pointer",
                                background:
                                    "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                color: "#111",
                                fontWeight: 700,
                                letterSpacing: "2px",
                                transition: ".35s",
                                boxShadow:
                                    "0 15px 35px rgba(214,161,75,.22)"
                            }}
                        >
                            SAVE TOKEN
                        </button>

                    </form>

                    <div
                        style={{
                            marginTop: "22px",
                            color: token ? "#7FD98B" : "#D66A6A",
                            letterSpacing: "1px"
                        }}
                    >
                        {token
                            ? "✓ Authentication token configured."
                            : "No authentication token configured."}
                    </div>

                </div>
                {/* ============================================================
    DASHBOARD
============================================================ */}

                {activeTab === "dashboard" && (

                    <div>

                        {dashboardData ? (

                            <>

                                {/* ================= Stats ================= */}

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                                        gap: "26px",
                                        marginBottom: "55px"
                                    }}
                                >

                                    {[
                                        {
                                            title: "Highest Score",
                                            value: dashboardData.highest_score
                                        },
                                        {
                                            title: "Accuracy",
                                            value: dashboardData.average_accuracy + "%"
                                        },
                                        {
                                            title: "Current Level",
                                            value: dashboardData.level
                                        },
                                        {
                                            title: "Explorer Rank",
                                            value: "#" + dashboardData.rank
                                        }

                                    ].map((item, index) => (

                                        <div
                                            key={index}
                                            style={{
                                                padding: "34px",
                                                borderRadius: "28px",
                                                background: "rgba(13,23,17,.92)",
                                                border: "1px solid rgba(214,161,75,.08)",
                                                backdropFilter: "blur(20px)",
                                                boxShadow: "0 20px 60px rgba(0,0,0,.35)"
                                            }}
                                        >

                                            <p
                                                style={{
                                                    color: "#8C8C8C",
                                                    letterSpacing: "4px",
                                                    textTransform: "uppercase",
                                                    fontSize: "12px",
                                                    marginBottom: "18px"
                                                }}
                                            >
                                                {item.title}
                                            </p>

                                            <h2
                                                style={{
                                                    fontFamily: "Cinzel",
                                                    color: "#ECE4D8",
                                                    fontSize: "42px",
                                                    fontWeight: 500
                                                }}
                                            >
                                                {item.value}
                                            </h2>

                                        </div>

                                    ))}

                                </div>

                                {/* ================= Explorer ================= */}

                                <div
                                    style={{
                                        padding: "45px",
                                        marginBottom: "55px",
                                        borderRadius: "30px",
                                        background: "rgba(13,23,17,.92)",
                                        border: "1px solid rgba(214,161,75,.08)",
                                        backdropFilter: "blur(20px)"
                                    }}
                                >

                                    <span
                                        style={{
                                            color: "#D6A14B",
                                            letterSpacing: "6px",
                                            fontSize: "12px",
                                            display: "block",
                                            marginBottom: "18px"
                                        }}
                                    >
                                        EXPLORER PROFILE
                                    </span>

                                    <h2
                                        style={{
                                            fontFamily: "Cinzel",
                                            color: "#ECE4D8",
                                            fontSize: "42px",
                                            marginBottom: "35px"
                                        }}
                                    >
                                        {dashboardData.name}
                                    </h2>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                                            gap: "30px"
                                        }}
                                    >

                                        <div>

                                            <p
                                                style={{
                                                    color: "#777",
                                                    letterSpacing: "3px",
                                                    marginBottom: "8px"
                                                }}
                                            >
                                                EMAIL
                                            </p>

                                            <h4
                                                style={{
                                                    color: "#ECE4D8",
                                                    fontWeight: 400
                                                }}
                                            >
                                                {dashboardData.email}
                                            </h4>

                                        </div>

                                        <div>

                                            <p
                                                style={{
                                                    color: "#777",
                                                    letterSpacing: "3px",
                                                    marginBottom: "8px"
                                                }}
                                            >
                                                ATTEMPTS
                                            </p>

                                            <h4
                                                style={{
                                                    color: "#ECE4D8",
                                                    fontWeight: 400
                                                }}
                                            >
                                                {dashboardData.total_attempts}
                                            </h4>

                                        </div>

                                        <div>

                                            <p
                                                style={{
                                                    color: "#777",
                                                    letterSpacing: "3px",
                                                    marginBottom: "8px"
                                                }}
                                            >
                                                AVERAGE SCORE
                                            </p>

                                            <h4
                                                style={{
                                                    color: "#ECE4D8",
                                                    fontWeight: 400
                                                }}
                                            >
                                                {dashboardData.average_score}
                                            </h4>

                                        </div>

                                    </div>

                                </div>

                                {/* ================= History ================= */}

                                <div
                                    style={{
                                        padding: "45px",
                                        borderRadius: "30px",
                                        background: "rgba(13,23,17,.92)",
                                        border: "1px solid rgba(214,161,75,.08)",
                                        backdropFilter: "blur(20px)"
                                    }}
                                >

                                    <span
                                        style={{
                                            color: "#D6A14B",
                                            letterSpacing: "6px",
                                            fontSize: "12px",
                                            display: "block",
                                            marginBottom: "18px"
                                        }}
                                    >
                                        EXPEDITION HISTORY
                                    </span>

                                    <h2
                                        style={{
                                            fontFamily: "Cinzel",
                                            color: "#ECE4D8",
                                            marginBottom: "40px",
                                            fontSize: "40px"
                                        }}
                                    >
                                        Previous Attempts
                                    </h2>

                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse"
                                        }}
                                    >

                                        <thead>

                                            <tr>

                                                {["Difficulty", "Score", "Accuracy", "Level"].map((item) => (

                                                    <th
                                                        key={item}
                                                        style={{
                                                            textAlign: "left",
                                                            padding: "20px",
                                                            color: "#D6A14B",
                                                            fontWeight: 500,
                                                            letterSpacing: "3px",
                                                            borderBottom: "1px solid rgba(214,161,75,.15)"
                                                        }}
                                                    >
                                                        {item}
                                                    </th>

                                                ))}

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {dashboardData.history?.map((attempt, i) => (

                                                <tr
                                                    key={i}
                                                >

                                                    <td
                                                        style={{
                                                            padding: "24px 20px",
                                                            color: "#ECE4D8",
                                                            borderBottom: "1px solid rgba(255,255,255,.05)"
                                                        }}
                                                    >
                                                        {attempt.difficulty}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "24px 20px",
                                                            color: "#ECE4D8",
                                                            borderBottom: "1px solid rgba(255,255,255,.05)"
                                                        }}
                                                    >
                                                        {attempt.score} / {attempt.total_questions}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "24px 20px",
                                                            color: "#ECE4D8",
                                                            borderBottom: "1px solid rgba(255,255,255,.05)"
                                                        }}
                                                    >
                                                        {attempt.accuracy}%
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding: "24px 20px",
                                                            color: "#D6A14B",
                                                            borderBottom: "1px solid rgba(255,255,255,.05)"
                                                        }}
                                                    >
                                                        {attempt.level}
                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            </>

                        ) : (

                            <div
                                style={{
                                    padding: "80px",
                                    textAlign: "center",
                                    borderRadius: "30px",
                                    background: "rgba(13,23,17,.92)",
                                    border: "1px solid rgba(214,161,75,.08)",
                                    color: "#A9A9A9"
                                }}
                            >
                                No dashboard statistics retrieved.
                            </div>

                        )}

                    </div>

                )}
                {/* ============================================================
    ACTIVE QUIZ
============================================================ */}

                {activeTab === "active-quiz" && (

                    <div>

                        {currentQuiz ? (

                            <div
                                style={{
                                    width: "min(900px,100%)",
                                    margin: "auto",
                                    padding: "50px",
                                    borderRadius: "30px",
                                    background: "rgba(13,23,17,.92)",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(214,161,75,.08)",
                                    boxShadow: "0 25px 70px rgba(0,0,0,.45)"
                                }}
                            >

                                {/* Top */}

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "20px",
                                        marginBottom: "40px"
                                    }}
                                >

                                    <div>

                                        <span
                                            style={{
                                                color: "#D6A14B",
                                                letterSpacing: "6px",
                                                fontSize: "12px",
                                                display: "block",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            {currentQuiz.difficulty.toUpperCase()} DIFFICULTY
                                        </span>

                                        <h2
                                            style={{
                                                color: "#ECE4D8",
                                                fontFamily: "Cinzel",
                                                fontSize: "40px"
                                            }}
                                        >
                                            {currentQuiz.title}
                                        </h2>

                                    </div>

                                    <div
                                        style={{
                                            color: "#888",
                                            fontSize: "13px",
                                            letterSpacing: "2px"
                                        }}
                                    >
                                        QUIZ ID : {currentQuiz.quiz_id}
                                    </div>

                                </div>

                                {/* Questions */}

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "40px"
                                    }}
                                >

                                    {currentQuiz.questions?.map((q, qIndex) => (

                                        <div key={q.question_id}>

                                            <div
                                                style={{
                                                    marginBottom: "25px"
                                                }}
                                            >

                                                <span
                                                    style={{
                                                        color: "#D6A14B",
                                                        letterSpacing: "5px",
                                                        fontSize: "12px"
                                                    }}
                                                >
                                                    QUESTION {qIndex + 1}
                                                </span>

                                                <h3
                                                    style={{
                                                        color: "#ECE4D8",
                                                        marginTop: "15px",
                                                        fontFamily: "Cinzel",
                                                        fontSize: "34px",
                                                        lineHeight: "1.6"
                                                    }}
                                                >
                                                    {q.question}
                                                </h3>

                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "18px"
                                                }}
                                            >

                                                {q.options?.map((opt, oIndex) => {

                                                    const isSelected =
                                                        selectedAnswers[q.question_id] === opt;

                                                    return (

                                                        <button
                                                            key={oIndex}
                                                            onClick={() =>
                                                                setSelectedAnswers(prev => ({
                                                                    ...prev,
                                                                    [q.question_id]: opt
                                                                }))
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                minHeight: "72px",
                                                                padding: "0 28px",
                                                                borderRadius: "18px",
                                                                cursor: "pointer",
                                                                textAlign: "left",
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                transition: ".35s",
                                                                fontSize: "16px",

                                                                background: isSelected
                                                                    ? "rgba(214,161,75,.12)"
                                                                    : "rgba(255,255,255,.04)",

                                                                border: isSelected
                                                                    ? "1px solid rgba(214,161,75,.45)"
                                                                    : "1px solid rgba(255,255,255,.08)",

                                                                color: "#ECE4D8"
                                                            }}
                                                        >

                                                            <span>{opt}</span>

                                                            <div
                                                                style={{
                                                                    width: "18px",
                                                                    height: "18px",
                                                                    borderRadius: "50%",
                                                                    border: isSelected
                                                                        ? "6px solid #D6A14B"
                                                                        : "2px solid rgba(255,255,255,.35)",
                                                                    transition: ".3s"
                                                                }}
                                                            />

                                                        </button>

                                                    );

                                                })}

                                            </div>

                                        </div>

                                    ))}

                                </div>

                                <button
                                    onClick={submitQuizAnswers}
                                    style={{
                                        marginTop: "55px",
                                        width: "100%",
                                        height: "68px",
                                        border: "none",
                                        borderRadius: "50px",
                                        cursor: "pointer",
                                        background:
                                            "linear-gradient(135deg,#D6A14B,#AF7B28)",
                                        color: "#111",
                                        fontWeight: 700,
                                        letterSpacing: "2px",
                                        fontSize: "15px",
                                        boxShadow:
                                            "0 20px 40px rgba(214,161,75,.22)"
                                    }}
                                >
                                    SUBMIT EXPEDITION
                                </button>

                            </div>

                        ) : (

                            <div>

                                {submitResult ? (

                                    <div
                                        style={{
                                            width: "min(850px,100%)",
                                            margin: "auto",
                                            padding: "70px 50px",
                                            borderRadius: "30px",
                                            textAlign: "center",
                                            background: "rgba(13,23,17,.92)",
                                            border: "1px solid rgba(214,161,75,.08)",
                                            backdropFilter: "blur(20px)"
                                        }}
                                    >

                                        <p
                                            style={{
                                                color: "#D6A14B",
                                                letterSpacing: "6px",
                                                marginBottom: "18px"
                                            }}
                                        >
                                            EXPEDITION COMPLETE
                                        </p>

                                        <h2
                                            style={{
                                                color: "#ECE4D8",
                                                fontFamily: "Cinzel",
                                                fontSize: "52px",
                                                marginBottom: "18px"
                                            }}
                                        >
                                            Congratulations
                                        </h2>

                                        <h1
                                            style={{
                                                fontSize: "90px",
                                                color: "#D6A14B",
                                                fontFamily: "Cinzel",
                                                marginBottom: "30px"
                                            }}
                                        >
                                            {submitResult.score}/{submitResult.total_questions}
                                        </h1>

                                        <p
                                            style={{
                                                color: "#BDBDBD",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            Accuracy : {submitResult.accuracy}%
                                        </p>

                                        <p
                                            style={{
                                                color: "#BDBDBD",
                                                marginBottom: "40px"
                                            }}
                                        >
                                            New Level : {submitResult.level}
                                        </p>

                                        <button
                                            onClick={startNewQuiz}
                                            style={{
                                                padding: "18px 36px",
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
                                            START ANOTHER EXPEDITION
                                        </button>

                                    </div>

                                ) : (

                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "90px",
                                            background: "rgba(13,23,17,.92)",
                                            borderRadius: "30px",
                                            border: "1px solid rgba(214,161,75,.08)",
                                            color: "#BDBDBD"
                                        }}
                                    >
                                        No active expedition.
                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                )}
                {/* ============================================================
    LEADERBOARD
============================================================ */}

                {activeTab === "leaderboard" && (

                    <div>

                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: "70px"
                            }}
                        >

                            <span
                                style={{
                                    display: "block",
                                    color: "#D6A14B",
                                    letterSpacing: "8px",
                                    fontSize: "13px",
                                    marginBottom: "18px"
                                }}
                            >
                                GLOBAL RANKINGS
                            </span>

                            <h2
                                style={{
                                    fontFamily: "Cinzel",
                                    color: "#ECE4D8",
                                    fontSize: "clamp(46px,6vw,70px)",
                                    marginBottom: "18px"
                                }}
                            >
                                Explorer Leaderboard
                            </h2>

                            <p
                                style={{
                                    maxWidth: "700px",
                                    margin: "auto",
                                    color: "#BDBDBD",
                                    lineHeight: "2"
                                }}
                            >
                                The finest paleontologists and explorers who have mastered the
                                prehistoric world.
                            </p>

                        </div>

                        {leaderboardData && leaderboardData.length > 0 ? (

                            <div
                                style={{
                                    width: "min(950px,100%)",
                                    margin: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "22px"
                                }}
                            >

                                {leaderboardData.map((user, idx) => (

                                    <div
                                        key={idx}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: "25px",

                                            padding: "28px 34px",

                                            background: "rgba(13,23,17,.92)",

                                            border: idx === 0
                                                ? "1px solid rgba(214,161,75,.35)"
                                                : "1px solid rgba(214,161,75,.08)",

                                            borderRadius: "26px",

                                            backdropFilter: "blur(20px)",

                                            boxShadow:
                                                idx === 0
                                                    ? "0 20px 60px rgba(214,161,75,.08)"
                                                    : "0 18px 45px rgba(0,0,0,.35)"
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "25px"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width: "74px",
                                                    height: "74px",

                                                    borderRadius: "50%",

                                                    background:
                                                        idx === 0
                                                            ? "linear-gradient(135deg,#D6A14B,#AF7B28)"
                                                            : "rgba(255,255,255,.04)",

                                                    border:
                                                        idx === 0
                                                            ? "none"
                                                            : "1px solid rgba(214,161,75,.10)",

                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",

                                                    fontSize: "28px",

                                                    fontFamily: "Cinzel",

                                                    color:
                                                        idx === 0
                                                            ? "#111"
                                                            : "#ECE4D8"
                                                }}
                                            >

                                                {user.rank}

                                            </div>

                                            <div>

                                                <h3
                                                    style={{
                                                        fontFamily: "Cinzel",
                                                        fontSize: "30px",
                                                        color: "#ECE4D8",
                                                        marginBottom: "8px"
                                                    }}
                                                >
                                                    {user.name}
                                                </h3>

                                                <span
                                                    style={{
                                                        color: "#D6A14B",
                                                        letterSpacing: "4px",
                                                        fontSize: "12px"
                                                    }}
                                                >
                                                    {user.level.toUpperCase()} EXPLORER
                                                </span>

                                            </div>

                                        </div>

                                        <div
                                            style={{
                                                textAlign: "right"
                                            }}
                                        >

                                            <p
                                                style={{
                                                    color: "#777",
                                                    letterSpacing: "4px",
                                                    marginBottom: "8px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                SCORE
                                            </p>

                                            <h2
                                                style={{
                                                    color: "#ECE4D8",
                                                    fontFamily: "Cinzel",
                                                    fontSize: "40px"
                                                }}
                                            >
                                                {user.score}
                                            </h2>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div
                                style={{
                                    width: "min(850px,100%)",
                                    margin: "auto",
                                    padding: "70px",
                                    textAlign: "center",

                                    borderRadius: "30px",

                                    background: "rgba(13,23,17,.92)",

                                    border: "1px solid rgba(214,161,75,.08)"
                                }}
                            >

                                <h3
                                    style={{
                                        color: "#ECE4D8",
                                        fontFamily: "Cinzel",
                                        fontSize: "36px",
                                        marginBottom: "18px"
                                    }}
                                >
                                    No Rankings Available
                                </h3>

                                <p
                                    style={{
                                        color: "#BDBDBD",
                                        lineHeight: "2"
                                    }}
                                >
                                    Complete your first expedition to appear on the global
                                    leaderboard.
                                </p>

                            </div>

                        )}

                        </div>

                )}
            </div>
        </div>
    )
}

