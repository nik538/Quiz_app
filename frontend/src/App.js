import { useEffect, useState, useCallback } from "react";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [time, setTime] = useState(15);
  const [showResult, setShowResult] = useState(false);

  // Save answer and move next
  const goNext = useCallback((value) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[current] = value;
      return updated;
    });

    setSelected(null);
    setTime(15);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  }, [current, questions.length]);

  // Timer
  useEffect(() => {
    if (!started || showResult) return;

    if (time === 0) {
      goNext(null);
      return;
    }

    const timer = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, started, showResult, goNext]);

  // Start quiz
  const startQuiz = async () => {
    const res = await fetch("http://127.0.0.1:5000/questions");
    const data = await res.json();
    setQuestions(data);
    setStarted(true);
    setTime(15);
  };

  /* ---------------- START SCREEN ---------------- */
  if (!started) {
    return (
      <div className="container">
        <h1>Quiz Application</h1>
        <p>5 Questions • 15 seconds each</p>
        <button onClick={startQuiz}>Start Quiz</button>
      </div>
    );
  }

  /* ---------------- RESULT SCREEN ---------------- */
  if (showResult) {
    let score = 0;
    answers.forEach((a, i) => {
      if (a === questions[i].answer) score++;
    });

    return (
      <div className="container">
        <h1>Result</h1>
        <h2>Score: {score} / {questions.length}</h2>

        {questions.map((q, i) => (
          <div key={i} className="result-box">
            <p><b>Q{i + 1}:</b> {q.question}</p>
            <p className={answers[i] === q.answer ? "correct" : "wrong"}>
              Your Answer: {answers[i] || "Not Answered"}
            </p>
            <p className="correct">
              Correct Answer: {q.answer}
            </p>
          </div>
        ))}

        <button onClick={() => window.location.reload()}>
          Restart Quiz
        </button>
      </div>
    );
  }

  /* ---------------- QUIZ SCREEN ---------------- */
  const q = questions[current];

  return (
    <div className="container">
      <div className="top-bar">
        <span>Q {current + 1} / {questions.length}</span>
        <span>⏱️ {time}s</span>
      </div>

      <h2>{q.question}</h2>

      {q.options.map((opt, i) => (
        <div
          key={i}
          className={`option ${selected === opt ? "selected" : ""}`}
          onClick={() => setSelected(opt)}
        >
          {opt}
        </div>
      ))}

      <button
        disabled={!selected}
        onClick={() => goNext(selected)}
      >
        {current === questions.length - 1 ? "Submit" : "Next"}
      </button>
    </div>
  );
}

export default App;
