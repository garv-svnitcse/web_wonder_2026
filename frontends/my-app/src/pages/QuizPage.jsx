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
 *          "wrong_answers": 1,
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
 *      "questions": [                   // Array of questions (answers are omitted for integrity)
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
        <div style={{ padding: '24px', fontFamily: 'monospace', color: '#e2e8f0', backgroundColor: '#0f172a', minHeight: '100vh' }}>
            <h1 style={{ color: '#38bdf8' }}>MESOZOIC QUIZ CONTROLLER (BACKEND INTEGRATION BASE)</h1>
            <p style={{ color: '#94a3b8' }}>Teammate: Replace this basic template with UI components and styling. LocalStorage access key: <strong>access_token</strong>.</p>
            
            {/* Token config helper (Temporary testing harness) */}
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '4px', margin: '20px 0', border: '1px solid #334155' }}>
                <h3>🔑 Auth Token Configuration</h3>
                <p style={{ fontSize: '12px' }}>Enter token returned from login endpoint to test authenticated requests.</p>
                <form onSubmit={handleSaveToken} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                        type="text" 
                        name="tokenInput"
                        placeholder="Bearer token string..."
                        defaultValue={token}
                        style={{ flexGrow: 1, padding: '8px', background: '#0f172a', border: '1px solid #475569', color: '#fff' }}
                    />
                    <button type="submit" style={{ padding: '8px 16px', background: '#38bdf8', color: '#000', border: 'none', cursor: 'pointer' }}>
                        Save Token
                    </button>
                </form>
                {token ? (
                    <p style={{ color: '#4ade80', fontSize: '11px', marginTop: '8px' }}>Active token is configured.</p>
                ) : (
                    <p style={{ color: '#f87171', fontSize: '11px', marginTop: '8px' }}>No active token set! Request headers will fail.</p>
                )}
            </div>

            {/* Error alerts */}
            {error && (
                <div style={{ padding: '12px', background: '#7f1d1d', border: '1px solid #b91c1c', borderRadius: '4px', margin: '16px 0', color: '#fca5a5' }}>
                    ❌ {error}
                </div>
            )}

            {/* Loading Indicator */}
            {loading && <p style={{ color: '#fbbf24', animatePulse: 'true' }}>⚡ Contacting Prehistoric Archives database...</p>}

            {/* Tab navigation links */}
            <div style={{ display: 'flex', gap: '12px', margin: '24px 0', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
                <button 
                    onClick={() => { setActiveTab('dashboard'); fetchDashboard(); }}
                    style={{ background: activeTab === 'dashboard' ? '#38bdf8' : '#1e293b', color: activeTab === 'dashboard' ? '#000' : '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer' }}
                >
                    Dashboard Stats
                </button>
                <button 
                    onClick={() => { setActiveTab('leaderboard'); fetchLeaderboard(); }}
                    style={{ background: activeTab === 'leaderboard' ? '#38bdf8' : '#1e293b', color: activeTab === 'leaderboard' ? '#000' : '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer' }}
                >
                    Leaderboard
                </button>
                <button 
                    onClick={startNewQuiz}
                    style={{ background: '#e2e8f0', color: '#000', padding: '8px 16px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Start Adaptive Quiz 🚀
                </button>
            </div>

            {/* ================================================================= */}
            {/* VIEW TAB 1: DASHBOARD STATS */}
            {/* ================================================================= */}
            {activeTab === 'dashboard' && (
                <div>
                    <h2>👤 Explorer Dashboard</h2>
                    {dashboardData ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <pre style={{ background: '#1e293b', padding: '16px', borderRadius: '4px', overflowX: 'auto', border: '1px solid #334155' }}>
                                {JSON.stringify(dashboardData, null, 2)}
                            </pre>
                            <h3>Recent Attempts History:</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #475569' }}>
                                        <th>Difficulty</th>
                                        <th>Score</th>
                                        <th>Accuracy</th>
                                        <th>Resulting Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.history?.map((attempt, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #334155' }}>
                                            <td>{attempt.difficulty}</td>
                                            <td>{attempt.score} / {attempt.total_questions}</td>
                                            <td>{attempt.accuracy}%</td>
                                            <td>{attempt.level}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No dashboard statistics retrieved. Verify auth token and attempt history.</p>
                    )}
                </div>
            )}

            {/* ================================================================= */}
            {/* VIEW TAB 2: ACTIVE QUIZ QUESTIONS */}
            {/* ================================================================= */}
            {activeTab === 'active-quiz' && (
                <div>
                    {currentQuiz ? (
                        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '4px', border: '1px solid #334155' }}>
                            <h2>📝 Quiz: {currentQuiz.title}</h2>
                            <p style={{ color: '#38bdf8' }}>Difficulty: {currentQuiz.difficulty}</p>
                            <p style={{ fontSize: '11px', color: '#94a3b8' }}>Quiz ID: {currentQuiz.quiz_id}</p>

                            <div style={{ marginTop: '20px' }}>
                                {currentQuiz.questions?.map((q, qIndex) => (
                                    <div key={q.question_id} style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #334155' }}>
                                        <h4 style={{ color: '#f1f5f9' }}>{qIndex + 1}. {q.question}</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', margin: '12px 0' }}>
                                            {q.options?.map((opt, oIndex) => {
                                                const isSelected = selectedAnswers[q.question_id] === opt;
                                                return (
                                                    <button
                                                        key={oIndex}
                                                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.question_id]: opt }))}
                                                        style={{
                                                            padding: '10px',
                                                            textAlign: 'left',
                                                            background: isSelected ? '#38bdf8' : '#0f172a',
                                                            color: isSelected ? '#000' : '#fff',
                                                            border: '1px solid #475569',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={submitQuizAnswers}
                                style={{ padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '16px' }}
                            >
                                Submit Answers (POST /quiz/submit)
                            </button>
                        </div>
                    ) : (
                        <div>
                            {submitResult ? (
                                <div style={{ background: '#064e3b', border: '1px solid #059669', padding: '24px', borderRadius: '4px', color: '#a7f3d0' }}>
                                    <h2>🎉 Quiz Submitted Successfully!</h2>
                                    <pre style={{ background: '#022c22', padding: '16px', border: '1px solid #047857', color: '#a7f3d0' }}>
                                        {JSON.stringify(submitResult, null, 2)}
                                    </pre>
                                    <button onClick={startNewQuiz} style={{ padding: '8px 16px', background: '#38bdf8', color: '#000', border: 'none', cursor: 'pointer', marginTop: '12px' }}>
                                        Attempt Another Quiz
                                    </button>
                                </div>
                            ) : (
                                <p>No active quiz loaded. Click "Start Adaptive Quiz" above to initiate a session.</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ================================================================= */}
            {/* VIEW TAB 3: LEADERBOARD LIST */}
            {/* ================================================================= */}
            {activeTab === 'leaderboard' && (
                <div>
                    <h2>🏆 Leaderboard (Top Explorers)</h2>
                    {leaderboardData && leaderboardData.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '16px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #475569' }}>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Highest Score</th>
                                    <th>Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map((user, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                                        <td>{user.rank}</td>
                                        <td>{user.name}</td>
                                        <td>{user.score}</td>
                                        <td style={{ color: '#38bdf8' }}>{user.level}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No leaderboard records found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
