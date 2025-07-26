"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play, FileText, Eye, Copy } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { type interview_type } from "@/apis/interviewapis";
import { toast } from "sonner";
import Actionscell from "./actioncell";

/**
 * Interview Table Columns Configuration
 *
 * WHAT THIS FILE DOES:
 * This file defines how each column in the interview table should look and behave.
 * Since we can't use React hooks directly in column definitions (they're just functions,
 * not React components), we use a function that accepts callback props from the parent component.
 *
 * WHY WE NEED CALLBACKS:
 * - React hooks can only be called from React components or custom hooks
 * - Column cell functions are regular JavaScript functions, not React components
 * - The parent component (that uses these columns) will have the hooks
 * - We pass down callback functions to handle the actions
 *
 * HOW IT WORKS:
 * 1. Parent component calls the hooks (useAnalyzeInterviewRecording, etc.)
 * 2. Parent component passes callback functions to this columns function
 * 3. Column cells call these callbacks when user interacts with buttons
 * 4. Callbacks trigger the actual API calls through the hooks
 */

// WHAT: Function that returns column definitions with callback support
// WHY: This pattern lets us inject behavior from the parent component
// HOW: Parent component passes functions that handle the actual API calls
export const columns = (
  // WHAT: Callback functions passed from parent component
  // WHY: These connect our UI to the actual API calls managed by hooks
  onAnalyze: (id: number) => void, // WHY: Triggers AI analysis
  onGenerateQuestions: (id: number) => void, // WHY: Triggers question generation
  onViewQuestions: (id: number) => void, // WHY: Navigates to questions page

  // WHAT: Loading states passed from parent
  // WHY: We need to show loading indicators and disable buttons during API calls
  // WHY: Parent component has access to the hook's loading state
  analyzingIds: number[], // WHY: Array of interview IDs currently being analyzed
  generatingIds: number[], // WHY: Array of interview IDs currently generating questions
): ColumnDef<interview_type>[] => [
  // ============================================================================
  // ID COLUMN
  // ============================================================================
  {
    // WHAT: Gets the 'id' field from each interview record
    accessorKey: "id",

    // WHY: We use accessorKey because React Table automatically knows how to:
    // - Sort by this field when user clicks the header
    // - Filter by this field if we enable filtering
    // - Access the data without us writing custom logic

    header: ({ column }) => (
      // WHAT: Uses our custom header component that adds sorting functionality
      // WHY: DataTableColumnHeader gives us:
      // - Consistent styling with other tables in our app
      // - Built-in sort arrows (up/down) that appear when sorting
      // - Hover effects and click handlers for sorting
      // - Accessibility features for screen readers
      <DataTableColumnHeader column={column} title="ID" />
    ),

    // NOTE: No custom cell function needed here because:
    // - The ID is just a number, no special formatting required
    // - React Table will automatically display row.original.id
    // - Simple data types (strings, numbers) don't need custom rendering
  },

  // ============================================================================
  // APPLICANT NAME COLUMN
  // ============================================================================
  {
    // WHAT: Gets the 'application' object from interview data
    accessorKey: "application",

    // WHY: We access the full application object because:
    // - The applicant's name is nested inside: interview.application.name
    // - React Table can handle nested objects if we provide a custom cell function
    // - This gives us access to other application data if needed (email, etc.)

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicant Name" />
    ),

    cell: ({ row }) => {
      // WHAT: Extract the application object from this row's data
      // WHY: We need to cast the type because TypeScript doesn't know
      // what structure the application object has. The 'as' tells TypeScript
      // "trust me, this object has these properties"
      const application = row.getValue("application") as {
        id: number;
        name: string;
        email: string;
      };

      // WHAT: Display just the name with medium font weight
      // WHY: font-medium makes the name stand out as the most important info
      // WHY: We only show the name here to keep the column clean and readable
      return <span className="font-medium">{application.name}</span>;
    },
  },

  // ============================================================================
  // JOB POSITION COLUMN
  // ============================================================================
  {
    // WHAT: Custom ID since we're not accessing a single direct field
    id: "job_position",

    // WHY: We use 'id' instead of 'accessorKey' because:
    // - We're combining multiple nested fields (job.title + company.name)
    // - There's no single field called 'job_position' in our data
    // - We need complete control over how this data is accessed and displayed
    accessorFn: (row) => row.application.job.title,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job Position" />
    ),

    cell: ({ row }) => {
      // WHAT: Get the full interview object to access deeply nested job data
      // WHY: row.original gives us the complete interview object, letting us
      // access: interview.application.job.title and interview.application.job.company.name
      const interview = row.original;

      return (
        // WHAT: Stack the job title and company name vertically
        // WHY: flex-col stacks elements vertically, saving horizontal space
        // WHY: This pattern is common in tables - primary info on top, secondary below
        <div className="flex flex-col">
          {/* WHAT: Job title in bold */}
          {/* WHY: Job title is primary info, so we make it bold (font-medium) */}
          <span className="font-medium">{interview.application.job.title}</span>

          {/* WHAT: Company name in smaller, muted text */}
          {/* WHY: text-sm makes it smaller, text-muted-foreground makes it less prominent */}
          {/* WHY: Company is secondary info - important but not the main focus */}
          <span className="text-muted-foreground text-sm">
            {interview.application.job.company.name}
          </span>
        </div>
      );
    },
  },

  // ============================================================================
  // INTERVIEW DATE COLUMN
  // ============================================================================
  {
    accessorKey: "date", // WHAT: Gets the 'date' field

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Interview Date" />
    ),

    cell: ({ row }) => {
      // WHAT: Get the date value and tell TypeScript it could be null
      // WHY: In our database, interview dates are optional (nullable)
      // WHY: We must handle the null case or our app will crash
      const date = row.getValue("date") as Date | null;

      // WHAT: If no date is set, show a helpful message
      // WHY: Better UX than showing empty cells or "null"
      // WHY: text-muted-foreground makes it look less prominent (it's not critical info)
      if (!date) {
        return <span className="text-muted-foreground">Not scheduled</span>;
      }

      // WHAT: If date exists, show both the date and time nicely formatted
      // WHY: Users need both date AND time for interviews
      // WHY: We format them separately for better readability
      return (
        <div className="flex flex-col">
          {/* WHAT: Full date using date-fns format */}
          {/* WHY: "PPP" format gives us "January 15, 2024" - human-readable */}
          {/* WHY: new Date() converts the string/timestamp to a Date object */}
          <span>{format(new Date(date), "PPP")}</span>

          {/* WHAT: Time in smaller, muted text */}
          {/* WHY: "p" format gives us "2:30 PM" - standard time format */}
          {/* WHY: Smaller and muted because time is secondary to the date */}
          <span className="text-muted-foreground text-sm">
            {format(new Date(date), "p")}
          </span>
        </div>
      );
    },
  },

  // ============================================================================
  // MEETING LINK COLUMN
  // ============================================================================
  {
    accessorKey: "external_meeting_link",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Meeting Link" />
    ),

    cell: ({ row }) => {
      // WHAT: Get the meeting link (could be null if not provided)
      // WHY: Not all interviews have meeting links (some might be in-person)
      const link = row.getValue("external_meeting_link") as string | null;

      // WHAT: If no meeting link provided, show a message
      // WHY: Better than empty cells - lets user know this is expected
      if (!link) {
        return <span className="text-muted-foreground">No link</span>;
      }

      return (
        // WHAT: Container for two buttons side by side
        // WHY: flex items-center aligns buttons vertically, gap-2 adds space between them
        <div className="flex items-center gap-2">
          {/* WHAT: Button to open the meeting in a new tab */}
          <Button
            variant="outline" // WHY: Outline variant is less prominent than solid buttons
            size="sm" // WHY: Small size fits better in table cells
            onClick={() => window.open(link, "_blank")} // WHY: Opens in new tab so user doesn't lose the table
            className="h-8" // WHY: Fixed height keeps all buttons consistent
          >
            <ExternalLink className="mr-1 h-3 w-3" />{" "}
            {/* WHY: Icon shows it opens externally */}
            Join
          </Button>

          {/* WHAT: Button to copy the link to clipboard */}
          <Button
            variant="ghost" // WHY: Ghost variant is even less prominent - secondary action
            size="sm"
            onClick={() => {
              // WHAT: Copy link to user's clipboard
              // WHY: Modern browsers have this API - no need for external libraries
              navigator.clipboard.writeText(link);

              // WHAT: Show success message to user
              // WHY: Users need feedback that the copy worked
              toast.success("Link copied to clipboard!");
            }}
            className="h-8 w-8 p-0" // WHY: Square button (w-8 h-8) with no padding for icon-only button
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },

  // ============================================================================
  // RESULT COLUMN
  // ============================================================================
  {
    accessorKey: "result",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Result" />
    ),

    cell: ({ row }) => {
      // WHAT: Get the result object (not just a string - it's a full object)
      // WHY: Our backend returns result as an object with id, title, slug
      const result = row.getValue("result") as {
        id: number;
        title: string;
        slug: string;
      };

      // WHAT: Get the full interview object for AI analysis data
      // WHY: We need to check if AI has analyzed this interview
      const interview = row.original;
      const analysisData = interview.analysis_data; // WHY: This contains AI confidence scores

      // WHAT: Function to determine what color the result badge should be
      // WHY: Visual color coding helps users quickly understand results
      // WHY: We define this as a function to avoid repeating the logic
      const getResultColor = (title: string) => {
        // WHY: We use toLowerCase() to handle different capitalizations
        switch (title.toLowerCase()) {
          case "pass":
            // WHY: Green universally means "good" or "success"
            // WHY: We provide both light and dark mode colors
            return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
          case "fail":
            // WHY: Red universally means "bad" or "failure"
            return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
          case "pending":
            // WHY: Yellow means "waiting" or "in progress"
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
          default:
            // WHY: Gray for unknown/neutral results
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
      };

      return (
        // WHAT: Container that centers content vertically
        // WHY: flex-col stacks badge and confidence score, items-center centers them
        <div className="flex flex-col items-center">
          {/* WHAT: Result badge with appropriate color */}
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getResultColor(
              result.title,
            )}`}
            // WHY: inline-flex allows the badge to size to its content
            // WHY: rounded-full makes it pill-shaped (modern UI trend)
            // WHY: px-2 py-1 gives it proper padding inside
            // WHY: text-xs makes it smaller to fit in table cells
            // WHY: font-medium makes the text slightly bold for readability
          >
            {result.title}
          </span>

          {/* WHAT: If AI analyzed the interview, show confidence percentage */}
          {/* WHY: This conditional rendering pattern is common in React */}
          {analysisData &&
            typeof analysisData === "object" &&
            "confidence" in analysisData && (
              <span className="text-muted-foreground mt-1 text-xs">
                {/* WHY: toFixed(1) shows one decimal place (e.g., 85.3%) */}
                {/* WHY: We cast to number because TypeScript doesn't know the type */}
                Confidence: {(analysisData.confidence as number).toFixed(1)}%
              </span>
            )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const resultObject = row.getValue(id) as {
        id: number;
        title: string;
        slug: string;
      };
      return value.includes(resultObject.title);
    },
  },

  // ============================================================================
  // ANALYZE RECORDING COLUMN
  // ============================================================================
  {
    // WHAT: Custom ID because this isn't a direct data field
    id: "analyze_recording",

    // WHY: This column triggers AI analysis, not just displays data
    // WHY: We use a simple string header since this doesn't need sorting
    header: "Analyze Recording",

    cell: ({ row }) => {
      const interview = row.original;

      // WHAT: Check if this specific interview is currently being analyzed
      // WHY: We need to show loading state for the right button
      // WHY: analyzingIds array contains IDs of interviews currently being processed
      const isAnalyzing = analyzingIds.includes(interview.id);

      // WHAT: Check if analysis has already been done
      // WHY: We don't want to analyze the same interview multiple times
      // WHY: We check object keys length to see if there's actual data
      const hasAnalysis =
        interview.analysis_data &&
        typeof interview.analysis_data === "object" &&
        Object.keys(interview.analysis_data).length > 0;

      // WHAT: Check if there's a video to analyze
      // WHY: Can't analyze if no video was uploaded
      const hasVideo = interview.interview_video;

      // WHAT: If no video uploaded, show a message
      // WHY: Can't analyze what doesn't exist - inform user why button isn't available
      if (!hasVideo) {
        return <span className="text-muted-foreground text-sm">No video</span>;
      }

      // WHAT: If already analyzed, show confirmation
      // WHY: Visual feedback that analysis is complete
      // WHY: Green color indicates success/completion
      if (hasAnalysis) {
        return (
          <div className="flex items-center justify-center gap-1 text-green-600">
            <Play className="h-3 w-3" />
            <span className="text-sm">Analyzed</span>
          </div>
        );
      }

      // WHAT: Show analyze button if video exists but not analyzed yet
      // WHY: This is the main interactive element for triggering analysis
      return (
        <Button
          variant="outline" // WHY: Outline style for secondary actions
          size="sm" // WHY: Small size fits table cells
          onClick={() => onAnalyze(interview.id)} // WHY: Call parent's callback function
          disabled={isAnalyzing} // WHY: Prevent multiple clicks while processing
          className="h-8" // WHY: Consistent height with other buttons
        >
          <Play className="mr-1 h-3 w-3" />{" "}
          {/* WHY: Play icon suggests "start analysis" */}
          {/* WHAT: Dynamic text based on loading state */}
          {/* WHY: Shows current status - either ready to analyze or currently analyzing */}
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>
      );
    },
  },

  // ============================================================================
  // QUESTIONS COLUMN
  // ============================================================================
  {
    id: "questions", // WHY: Custom ID for generated/interactive content

    header: "Questions",

    cell: ({ row }) => {
      const interview = row.original;

      // WHAT: Check if this specific interview is currently generating questions
      // WHY: We need to show loading state for the right button
      const isGenerating = generatingIds.includes(interview.id);

      // WHAT: Check if questions have already been generated
      // WHY: Don't want to regenerate existing questions
      // WHY: We check both existence and length to ensure there are actual questions
      const hasQuestions =
        interview.interview_questions &&
        interview.interview_questions.length > 0;

      // WHAT: If questions exist, show "View" button
      // WHY: Green color and "View" text indicates questions are ready
      if (hasQuestions) {
        return (
          <Button
            variant="ghost" // WHY: Ghost variant for secondary actions
            size="sm"
            onClick={() => onViewQuestions(interview.id)} // WHY: Call parent's callback
            className="h-8 text-green-600" // WHY: Green indicates success/completion
          >
            <Eye className="mr-1 h-3 w-3" />{" "}
            {/* WHY: Eye icon suggests "view/see" */}
            View
          </Button>
        );
      }

      // WHAT: If no questions yet, show "Generate" button
      // WHY: This is the primary action when questions don't exist
      return (
        <Button
          variant="outline" // WHY: Outline for primary action in this context
          size="sm"
          onClick={() => onGenerateQuestions(interview.id)} // WHY: Call parent's callback
          disabled={isGenerating} // WHY: Prevent multiple generation requests
          className="h-8"
        >
          <FileText className="mr-1 h-3 w-3" />{" "}
          {/* WHY: FileText icon suggests document/questions */}
          {/* WHAT: Dynamic text showing current state */}
          {/* WHY: Provides feedback about whether generation is in progress */}
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      );
    },
  },

  // ============================================================================
  // ACTIONS COLUMN
  // ============================================================================
  {
    // WHAT: Standard actions column for edit/delete operations
    id: "actions",

    cell: ({ row }) => {
      // WHAT: Uses your custom Actionscell component
      // WHY: Actionscell handles common table actions (edit, delete, etc.)
      // WHY: Reusing this component keeps actions consistent across all tables
      // WHY: row.original passes the complete interview object to the component
      return <Actionscell item={row.original} />;
    },
  },
];
