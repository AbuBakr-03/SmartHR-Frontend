import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useListInterviewsPrivate,
  useAnalyzeInterviewRecording,
  useGenerateInterviewQuestions,
} from "@/hooks/useInterview";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthProvider";

/**
 * Interview Table Component
 *
 * WHAT THIS COMPONENT DOES:
 * This is the main component that displays the interview table with all interactive features.
 * It manages the state for loading indicators and provides callback functions to the columns.
 *
 * WHY WE NEED THIS STRUCTURE:
 * - React hooks can only be called from React components (not column definitions)
 * - We need to track loading states for multiple interviews simultaneously
 * - We need to coordinate between API calls and UI updates
 * - We need to provide navigation functionality
 *
 * HOW IT WORKS:
 * 1. This component calls all the React hooks
 * 2. It maintains arrays of IDs that are currently loading
 * 3. It provides callback functions that columns can call
 * 4. When callbacks are triggered, it updates loading state and makes API calls
 * 5. When API calls complete, it updates loading state and shows notifications
 */
const InterviewTable = () => {
  // ============================================================================
  // HOOKS - All React hooks must be called here (not in columns)
  // ============================================================================

  // WHAT: Hook to fetch all interviews data
  // WHY: We need the interview data to populate the table
  // HOW: This hook automatically handles loading, error states, and caching
  const listInterviews = useListInterviewsPrivate();

  // WHAT: Hook to handle AI analysis of interview recordings
  // WHY: We need this to trigger analysis when user clicks analyze button
  // HOW: Provides mutate function and loading state (isPending)
  const analyzeRecording = useAnalyzeInterviewRecording();

  // WHAT: Hook to handle AI generation of interview questions
  // WHY: We need this to generate questions when user clicks generate button
  // HOW: Similar to analyze hook - provides mutate function and state
  const generateQuestions = useGenerateInterviewQuestions();

  // WHAT: Hook for programmatic navigation
  // WHY: We need to navigate to the questions detail page
  // HOW: React Router hook that lets us change pages programmatically
  const navigate = useNavigate();

  // ============================================================================
  // STATE - Loading state management for multiple simultaneous operations
  // ============================================================================

  // WHAT: Array of interview IDs currently being analyzed
  // WHY: We need to track which specific interviews are being processed
  // WHY: This allows us to show loading state on the correct buttons
  // HOW: Add ID when analysis starts, remove when it completes/fails
  const [analyzingIds, setAnalyzingIds] = useState<number[]>([]);

  // WHAT: Array of interview IDs currently generating questions
  // WHY: Same as above but for question generation
  // HOW: Separate array because user might analyze and generate simultaneously
  const [generatingIds, setGeneratingIds] = useState<number[]>([]);

  // ============================================================================
  // CALLBACK FUNCTIONS - These are passed to columns for user interactions
  // ============================================================================

  /**
   * Handle Analysis Request
   *
   * WHAT: Called when user clicks "Analyze" button in the table
   * WHY: We need to coordinate the API call with UI loading states
   * HOW: Updates loading state immediately, then makes API call
   */
  const handleAnalyze = (interviewId: number) => {
    // STEP 1: Immediately add to loading array for instant UI feedback
    // WHY: User needs immediate feedback that their click worked
    // HOW: Spread previous array and add new ID
    setAnalyzingIds((prev) => [...prev, interviewId]);

    // STEP 2: Make the actual API call
    // WHY: This triggers the AI analysis on the backend
    // HOW: mutate() function from the hook handles the HTTP request
    analyzeRecording.mutate(interviewId, {
      // WHAT: Success callback - called when API returns success
      // WHY: We need to update UI and notify user of success
      onSuccess: () => {
        // Remove from loading array - button will change to "Analyzed"
        setAnalyzingIds((prev) => prev.filter((id) => id !== interviewId));

        // Show success notification to user
        // WHY: Users need confirmation that the action completed
        toast.success("Recording analyzed successfully");

        // NOTE: React Query automatically refetches data and updates the table
        // The column will see the new analysis_data and change the button accordingly
      },

      // WHAT: Error callback - called when API returns error
      // WHY: We need to handle failures gracefully
      onError: (error) => {
        // Remove from loading array - button returns to "Analyze" state
        setAnalyzingIds((prev) => prev.filter((id) => id !== interviewId));

        // Show error notification to user
        toast.error("Failed to analyze recording");

        // Log error for developers to debug
        // WHY: Helps with troubleshooting in development/production
        console.error("Analysis error:", error);
      },
    });
  };

  /**
   * Handle Question Generation Request
   *
   * WHAT: Called when user clicks "Generate Questions" button
   * WHY: Similar to analysis but for AI question generation
   * HOW: Same pattern as handleAnalyze but with different API call
   */
  const handleGenerateQuestions = (interviewId: number) => {
    // STEP 1: Add to loading array for immediate UI feedback
    setGeneratingIds((prev) => [...prev, interviewId]);

    // STEP 2: Make API call to generate questions
    generateQuestions.mutate(interviewId, {
      onSuccess: () => {
        // Remove from loading array
        setGeneratingIds((prev) => prev.filter((id) => id !== interviewId));

        // Show success notification
        toast.success("Questions generated successfully");

        // NOTE: Button will automatically change to "View Questions"
        // because React Query will refetch and update interview_questions data
      },

      onError: (error) => {
        // Remove from loading array
        setGeneratingIds((prev) => prev.filter((id) => id !== interviewId));

        // Show error notification
        toast.error("Failed to generate questions");

        // Log for debugging
        console.error("Question generation error:", error);
      },
    });
  };

  /**
   * Handle View Questions Request
   *
   * WHAT: Called when user clicks "View Questions" button
   * WHY: We need to navigate to a detailed page showing all questions
   * HOW: Uses React Router to change the current page
   */
  const handleViewQuestions = (interviewId: number) => {
    // WHAT: Navigate to the questions detail page
    // WHY: Questions list is too detailed to show in table - needs dedicated page
    // HOW: Template literal creates URL like "/interviews/123/questions"
    navigate(`/dashboard/interviews/${interviewId}/questions`);

    // NOTE: No loading state needed here because navigation is instant
    // NOTE: No API call needed because we're just changing pages
  };

  // ============================================================================
  // COLUMN CONFIGURATION - Pass callbacks and loading states to columns
  // ============================================================================

  // WHAT: Generate column definitions with our callback functions
  // WHY: Columns need access to our state and functions to work properly
  // HOW: Call the columns function with all necessary parameters
  const tableColumns = columns(
    handleAnalyze, // Function to handle analysis requests
    handleGenerateQuestions, // Function to handle question generation
    handleViewQuestions, // Function to handle navigation to questions
    analyzingIds, // Array of IDs currently being analyzed
    generatingIds, // Array of IDs currently generating questions
  );

  const authContext = useAuth();
  const { auth } = authContext;

  // Define which roles can perform actions
  const canPerformActions =
    auth?.role === "admin" || auth?.role === "Recruiter";

  // Filter columns based on permissions
  const tableColumns2 = canPerformActions
    ? tableColumns
    : tableColumns
        .filter((col) => col.id !== "actions")
        .filter((col) => col.id !== "analyze_recording")
        .filter((col) => col.id !== "questions");

  // ============================================================================
  // RENDER - Display the complete table interface
  // ============================================================================

  return (
    <div className="container mx-auto rounded-xl border-1 px-5 py-5">
      {/* WHAT: Page title */}
      {/* WHY: Users need to know what page they're on */}
      <h1 className="pb-4 text-2xl font-semibold">Interviews</h1>

      {/* WHAT: The actual data table component */}
      {/* WHY: This renders all the interview data in table format */}
      {/* HOW: Pass our configured columns and the interview data */}
      <DataTable
        columns={tableColumns2} // Our column definitions with callbacks
        data={listInterviews.data ?? []} // Interview data (empty array if loading)
      />

      {/* 
      NOTE: DataTable component handles:
      - Loading states (when listInterviews.isLoading)
      - Error states (when listInterviews.isError) 
      - Empty states (when no data)
      - Pagination, sorting, filtering
      */}
    </div>
  );
};

export default InterviewTable;

/**
 * COMPONENT FLOW SUMMARY:
 *
 * 1. Component mounts → hooks called → data fetched
 * 2. User clicks button → callback function called → loading state updated
 * 3. API call made → success/error → loading state updated → notification shown
 * 4. React Query refetches data → component re-renders → columns see new data
 * 5. Columns re-execute with fresh data → different JSX returned → UI updates
 *
 * KEY BENEFITS:
 * - Clean separation: UI logic in columns, state logic in component
 * - Multiple loading states: Each button can show individual loading
 * - Error handling: Graceful handling of API failures
 * - User feedback: Toast notifications for all actions
 * - Automatic updates: React Query keeps data fresh
 */
