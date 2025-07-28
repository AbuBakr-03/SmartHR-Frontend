// frontend/src/pages/dashboard/interviewQuestions/InterviewQuestions.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useRetrieveInterviewPrivate } from "@/hooks/useInterview";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type InterviewQuestion = {
  category: string;
  question: string;
};

const InterviewQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const interviewQuestion = useRetrieveInterviewPrivate(Number(id));
  const { data } = interviewQuestion;

  if (
    !data ||
    !data.interview_questions ||
    data.interview_questions.length === 0
  ) {
    return (
      <div className="container mx-auto p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              There are no interview questions generated for this interview yet.
              Please use the "Generate Questions" button on the interviews page.
            </p>
            <Button
              onClick={() => navigate("/dashboard/all-interview-sessions")}
              className="mt-4"
            >
              Return to Interviews List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group questions by category
  const questionsByCategory: Record<string, InterviewQuestion[]> = {};
  data.interview_questions.forEach((q: InterviewQuestion) => {
    if (!questionsByCategory[q.category]) {
      questionsByCategory[q.category] = [];
    }
    questionsByCategory[q.category].push(q);
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold">
          Interview Questions for {data.application.name}
        </h1>
        <p className="text-muted-foreground">
          Position: {data.application.job.title}
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(questionsByCategory).map(([category, questions]) => (
          <Card key={category} className="overflow-hidden">
            <CardHeader className="bg-muted">
              <CardTitle className="text-lg">{category} Questions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ol className="list-decimal space-y-3 pl-5">
                {questions.map((question, index) => (
                  <li key={index} className="pl-1">
                    <div className="font-medium">{question.question}</div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InterviewQuestions;
