import React, { useState, useEffect } from 'react';
import { quizAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Award, CheckCircle, HelpCircle, Trophy, RefreshCw, Star, Compass } from 'lucide-react';

const FALLBACK_QUIZZES = [
  {
    id: 1,
    title: 'Mesozoic Epochs & Geology',
    description: 'Test your understanding of the Triassic, Jurassic, and Cretaceous timelines and environments.',
    questionCount: 4,
    questions: [
      {
        question: 'Which geologic period ended with the Chicxulub asteroid impact?',
        options: ['Triassic', 'Permian', 'Cretaceous', 'Jurassic'],
        answerIndex: 2
      },
      {
        question: 'What supercontinent began to break apart during the early Jurassic Period?',
        options: ['Rodinia', 'Pangaea', 'Gondwana', 'Laurasia'],
        answerIndex: 1
      },
      {
        question: 'Roughly when did the Triassic period begin?',
        options: ['252 Million Years Ago', '66 Million Years Ago', '145 Million Years Ago', '541 Million Years Ago'],
        answerIndex: 0
      },
      {
        question: 'Which period was characterized by the first appearance of flowering plants?',
        options: ['Cretaceous', 'Jurassic', 'Triassic', 'Carboniferous'],
        answerIndex: 0
      }
    ]
  },
  {
    id: 2,
    title: 'Dinosaur Diets & Structural Anatomy',
    description: 'Can you classify feeding adaptations and skeletal configurations of famous dinosaur groups?',
    questionCount: 3,
    questions: [
      {
        question: 'Which of these dinosaurs was an obligate carnivore?',
        options: ['Triceratops', 'Brachiosaurus', 'Tyrannosaurus Rex', 'Stegosaurus'],
        answerIndex: 2
      },
      {
        question: 'What was the primary function of the tail spikes (thagomizer) on a Stegosaurus?',
        options: ['Thermoregulation', 'Defense against predators', 'Mating displays', 'Digging for water'],
        answerIndex: 1
      },
      {
        question: 'What distinctive cranial feature characterized Triceratops?',
        options: ['A hollow crest', 'A bony dome', 'Three facial horns and a neck frill', 'A duck-like bill'],
        answerIndex: 2
      }
    ]
  }
];

const FALLBACK_LEADERBOARD = [
  { rank: 1, username: 'DrGrant_Dino', score: 3200, streak: 8 },
  { rank: 2, username: 'FossilHunter99', score: 2850, streak: 5 },
  { rank: 3, username: 'Sattler_Bio', score: 2700, streak: 6 },
  { rank: 4, username: 'PangaeaExplorer', score: 2100, streak: 3 },
  { rank: 5, username: 'RexLoverX', score: 1850, streak: 2 }
];

const Quiz = () => {
  const { isAuthenticated } = useAuth();
  
  // Quizzes list state
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Active quiz session state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  
  useEffect(() => {
    const fetchQuizDetails = async () => {
      setLoading(true);
      try {
        const quizzesData = await quizAPI.list();
        const leaderboardData = await quizAPI.getLeaderboard();
        setQuizzes(quizzesData || []);
        setLeaderboard(leaderboardData || []);
        setUsingFallback(false);
      } catch (err) {
        console.warn("Quiz server offline or empty. Launching offline sandbox arena.", err);
        setQuizzes(FALLBACK_QUIZZES);
        setLeaderboard(FALLBACK_LEADERBOARD);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizDetails();
  }, []);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleOptionSelect = (optionIdx) => {
    if (hasAnswered) return;
    setSelectedOption(optionIdx);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null || hasAnswered) return;
    
    const currentQuestion = activeQuiz.questions[currentQuestionIdx];
    const isCorrect = selectedOption === currentQuestion.answerIndex;
    
    if (isCorrect) {
      setScore(prev => prev + 100);
    }
    setHasAnswered(true);
  };

  const handleNextQuestion = () => {
    const isLastQuestion = currentQuestionIdx === activeQuiz.questions.length - 1;
    if (isLastQuestion) {
      handleFinishQuiz();
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    }
  };

  const handleFinishQuiz = async () => {
    setQuizFinished(true);
    if (isAuthenticated) {
      try {
        await quizAPI.submitScore(activeQuiz.id, {
          score: score,
          questions_answered: activeQuiz.questions.length
        });
        
        // Refresh leaderboard to include new score
        if (!usingFallback) {
          const freshLeaderboard = await quizAPI.getLeaderboard();
          setLeaderboard(freshLeaderboard);
        }
      } catch (err) {
        console.error("Failed to upload scores online:", err);
      }
    }
  };

  const handleExitQuiz = () => {
    setActiveQuiz(null);
    setQuizFinished(false);
  };

  if (loading) {
    return (
      <div style={styles.loader}>
        <div className="spinner" style={styles.spinner} />
        <p style={{ color: 'var(--text-secondary)' }}>Synchronizing leaderboards and records...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 6rem' }}>
      
      {usingFallback && (
        <div style={styles.infoBanner}>
          <Compass size={18} />
          <span>Running locally on mock data. Authenticated score updates will sync to local storage if API server is offline.</span>
        </div>
      )}

      {!activeQuiz ? (
        /* Quiz Selection & Leaderboard Layout */
        <div style={styles.mainGrid}>
          {/* Quizzes list */}
          <div style={styles.leftCol}>
            <div style={styles.sectionHeader}>
              <h1 style={styles.title} className="text-gradient">Trivia & Learning Arena</h1>
              <p style={styles.subtitle}>Test your paleontology knowledge and rise in ranking status.</p>
            </div>
            
            <div style={styles.quizzesGrid}>
              {quizzes.map(quiz => (
                <div key={quiz.id} className="glass-card" style={styles.quizCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <HelpCircle size={24} color="var(--primary-light)" />
                    <span style={styles.badge}>{quiz.questionCount || quiz.questions?.length} Questions</span>
                  </div>
                  <h3 style={styles.quizTitle}>{quiz.title}</h3>
                  <p style={styles.quizDesc}>{quiz.description}</p>
                  <button 
                    onClick={() => handleStartQuiz(quiz)} 
                    className="btn btn-primary" 
                    style={styles.actionBtn}
                  >
                    Launch Simulation
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard panel */}
          <div style={styles.rightCol}>
            <div className="glass-card" style={styles.leaderboardCard}>
              <div style={styles.leaderboardHeader}>
                <Trophy size={20} color="var(--secondary)" />
                <h2 style={styles.leaderboardTitle}>Top Explorers</h2>
              </div>
              
              <div style={styles.leaderboardList}>
                <div style={styles.leaderboardHeaderRow}>
                  <span style={{ width: '15%', textAlign: 'center' }}>Rank</span>
                  <span style={{ flexGrow: 1 }}>Username</span>
                  <span style={{ width: '25%', textAlign: 'right' }}>Score</span>
                </div>
                
                {leaderboard.map((item, index) => (
                  <div key={index} style={{
                    ...styles.leaderboardRow,
                    backgroundColor: index === 0 ? 'rgba(217, 119, 6, 0.08)' : 'transparent',
                    borderLeft: index === 0 ? '3px solid var(--secondary)' : '3px solid transparent'
                  }}>
                    <span style={styles.rankCol}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : item.rank || index + 1}
                    </span>
                    <span style={styles.userCol}>{item.username}</span>
                    <span style={styles.scoreCol}>{item.score} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Active Quiz Simulation */
        <div style={styles.activeQuizContainer}>
          <div className="glass-card" style={styles.quizSessionCard}>
            
            {/* Header progress bar */}
            <div style={styles.sessionHeader}>
              <button onClick={handleExitQuiz} style={styles.exitBtn} className="btn btn-outline">
                Abort Simulation
              </button>
              <div style={styles.progressContainer}>
                <span style={styles.progressText}>
                  Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                </span>
                <div style={styles.barOuter}>
                  <div style={{
                    ...styles.barInner,
                    width: `${((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100}%`
                  }} />
                </div>
              </div>
              <div style={styles.runningScore}>
                Score: <span style={{ color: 'var(--secondary-light)', fontWeight: 'bold' }}>{score}</span> XP
              </div>
            </div>

            {/* Content area */}
            {!quizFinished ? (
              <div style={styles.questionPanel}>
                <h2 style={styles.questionText}>
                  {activeQuiz.questions[currentQuestionIdx].question}
                </h2>
                
                <div style={styles.optionsList}>
                  {activeQuiz.questions[currentQuestionIdx].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === activeQuiz.questions[currentQuestionIdx].answerIndex;
                    
                    let optionStyle = { ...styles.optionItem };
                    if (isSelected) {
                      optionStyle.borderColor = 'var(--secondary)';
                      optionStyle.backgroundColor = 'rgba(217, 119, 6, 0.05)';
                    }
                    
                    if (hasAnswered) {
                      if (isCorrect) {
                        optionStyle.borderColor = 'var(--primary-light)';
                        optionStyle.backgroundColor = 'rgba(46, 139, 87, 0.15)';
                      } else if (isSelected) {
                        optionStyle.borderColor = 'var(--accent-light)';
                        optionStyle.backgroundColor = 'rgba(159, 12, 57, 0.15)';
                      }
                      optionStyle.cursor = 'default';
                    }

                    return (
                      <div
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        style={optionStyle}
                      >
                        <span style={styles.optionLetter}>{String.fromCharCode(65 + idx)}.</span>
                        <span style={styles.optionContent}>{opt}</span>
                        {hasAnswered && isCorrect && <CheckCircle size={18} color="var(--primary-light)" style={{ marginLeft: 'auto' }} />}
                      </div>
                    );
                  })}
                </div>

                {/* Navigation actions */}
                <div style={styles.sessionFooter}>
                  {!hasAnswered ? (
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={selectedOption === null}
                      className="btn btn-primary"
                      style={{ ...styles.actionBtn, minWidth: '150px', opacity: selectedOption === null ? 0.6 : 1 }}
                    >
                      Confirm Selection
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="btn btn-secondary"
                      style={{ ...styles.actionBtn, minWidth: '150px' }}
                    >
                      {currentQuestionIdx === activeQuiz.questions.length - 1 ? 'Analyze Final Scores' : 'Proceed Forward'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Finish Screen */
              <div style={styles.finishedPanel}>
                <Award size={64} color="var(--secondary)" style={{ marginBottom: '1rem', animation: 'bounce 2s infinite' }} />
                <h2 style={styles.finishedTitle}>Simulation Complete!</h2>
                <p style={styles.finishedSub}>
                  You scored <span style={{ color: 'var(--secondary-light)', fontWeight: 'bold' }}>{score}</span> points.
                </p>
                
                <p style={styles.finishedText}>
                  {score === activeQuiz.questions.length * 100 
                    ? 'Incredible! Flawless database synchronization. Master level Paleontologist.' 
                    : score > activeQuiz.questions.length * 50 
                    ? 'Excellent job! Deep prehistoric comprehension.' 
                    : 'Fossil layers require further study. Try again to boost score ranks.'}
                </p>

                {!isAuthenticated && (
                  <p style={styles.authReminder}>
                    Sign in to publish your XP scores on the global leaderboards!
                  </p>
                )}

                <div style={styles.finishedBtns}>
                  <button onClick={() => handleStartQuiz(activeQuiz)} style={styles.finishedBtn} className="btn btn-outline">
                    <RefreshCw size={16} />
                    <span>Run Again</span>
                  </button>
                  <button onClick={handleExitQuiz} style={styles.finishedBtn} className="btn btn-primary">
                    Return to Lobby
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 0',
    gap: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(46, 139, 87, 0.1)',
    borderTop: '3px solid var(--primary-light)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  infoBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '0.75rem 1.2rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '7fr 3fr',
    gap: '2.5rem',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeader: {
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '800',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
  },
  quizzesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  quizCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  badge: {
    fontSize: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    color: 'var(--text-secondary)',
  },
  quizTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
    color: 'var(--text-primary)',
  },
  quizDesc: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    flexGrow: 1,
    marginBottom: '1.5rem',
  },
  actionBtn: {
    marginTop: 'auto',
    width: '100%',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  leaderboardCard: {
    padding: '1.5rem',
  },
  leaderboardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem',
  },
  leaderboardTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  leaderboardHeaderRow: {
    display: 'flex',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    padding: '0.5rem',
    fontWeight: 'bold',
  },
  leaderboardRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 0.5rem',
    borderRadius: '6px',
    transition: 'background var(--transition-fast)',
    fontSize: '0.9rem',
  },
  rankCol: {
    width: '15%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  userCol: {
    flexGrow: 1,
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  scoreCol: {
    width: '25%',
    textAlign: 'right',
    color: 'var(--secondary-light)',
    fontWeight: '600',
  },
  activeQuizContainer: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  quizSessionCard: {
    padding: '2rem',
  },
  sessionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '1.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  exitBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.85rem',
  },
  progressContainer: {
    flexGrow: 1,
    maxWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  progressText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  barOuter: {
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  barInner: {
    height: '100%',
    backgroundColor: 'var(--primary-light)',
    transition: 'width 0.3s ease',
  },
  runningScore: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  questionPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  questionText: {
    fontSize: '1.4rem',
    fontWeight: '600',
    marginBottom: '2rem',
    lineHeight: '1.4',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '1rem 1.25rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  optionLetter: {
    fontWeight: '700',
    color: 'var(--secondary-light)',
    marginRight: '0.75rem',
  },
  optionContent: {
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  sessionFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  finishedPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 0',
    textAlign: 'center',
  },
  finishedTitle: {
    fontSize: '1.75rem',
    marginBottom: '0.5rem',
  },
  finishedSub: {
    fontSize: '1.25rem',
    color: 'var(--text-secondary)',
    marginBottom: '1rem',
  },
  finishedText: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    maxWidth: '500px',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
  },
  authReminder: {
    fontSize: '0.85rem',
    color: 'var(--secondary-light)',
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
    border: '1px dashed var(--secondary)',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    marginBottom: '2rem',
  },
  finishedBtns: {
    display: 'flex',
    gap: '1rem',
  },
  finishedBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
  },
};

// Handle responsive layout queries collapse
const cssResponsiveQuiz = `
@media (max-width: 768px) {
  div[style*="mainGrid"] {
    grid-template-columns: 1fr !important;
    gap: 3rem !important;
  }
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(cssResponsiveQuiz));
  document.head.appendChild(style);
}

export default Quiz;
