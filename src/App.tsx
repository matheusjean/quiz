// https://opentdb.com/api.php?amount=10&type=multiple
import React, { useState } from 'react';
import {fetchQuizQuestions} from './Api';
import QuestionCard from './components/QuestionCard';

import { QuestionState, Difficulty } from './Api';

import {GlobalStyle, Wrapper} from './appStyles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY,
    );

    setQuestions(newQuestions);

    setScore(0);

    setUserAnswers([]);

    setNumber(0);

    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver) {
      // Resposta do usuário
      const answer = e.currentTarget.value;
      // Resposta contra valor correto
      const correct = questions[number].correct_answer === answer;
      // Adicionar score se está correto
      if(correct) setScore(prev => prev + 1);
      // Salvando resposta
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers(prev => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    // Proxima pergunta se não for a ultima
    const nextQuestion = number +1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }


  };
  return (
    <>
    <GlobalStyle/>
    <Wrapper>

      <h1>Quiz</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className="start" onClick={startTrivia}>
        Iniciar
      </button>
        ) : null }

      {!gameOver ? <p className="score">Placar: {score} </p> : null}

      {loading && <p>Carregando questões...</p>}

      {!loading && !gameOver && (
        <QuestionCard
        questionNr={number + 1}
        totalQuestions={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
        />
      )}

      {!gameOver &&
      !loading &&
      userAnswers.length === number + 1
      && number !== TOTAL_QUESTIONS - 1 ? (
      <button className="next" onClick={nextQuestion}>
        Próxima pergunta
      </button>
      ) : null}

    </Wrapper>
    </>
  );
};

export default App;
