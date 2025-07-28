import { useParams } from "react-router-dom";
import { useRetrieveJob } from "@/hooks/useJob";

const Jobdescription: React.FC = () => {
  const { id } = useParams();
  const job = useRetrieveJob(Number(id));
  const { data } = job;

  // Helper function to convert text into bullet points based on periods
  const splitIntoListItems = (text: string | undefined) => {
    if (!text) return [];

    // Split by full stops, filter empty strings, and trim each sentence
    return text
      .split(".")
      .filter((sentence) => sentence.trim().length > 0)
      .map((sentence, index) => <li key={index}>{sentence}.</li>);
  };

  return (
    <div className={`grid gap-6 rounded-xl border border-slate-300 p-6`}>
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold">Job Details</h1>
        <p className="text-sm">
          We're looking for a talented {data?.title} to join our growing team.
        </p>
      </div>

      <hr />
      <div className="grid gap-1">
        <h1 className="text-xl font-bold">Responsibilities</h1>
        <ul className="list-disc pl-6">
          {splitIntoListItems(data?.responsiblities)}
        </ul>
      </div>

      <hr />
      <div className="grid gap-1">
        <h1 className="text-xl font-bold">Qualification</h1>
        <ul className="list-disc pl-6">
          {splitIntoListItems(data?.qualification)}
        </ul>
      </div>

      <hr />
      <div className="grid gap-1">
        <h1 className="text-xl font-bold">Nice to Haves</h1>
        <ul className="list-disc pl-6">
          {splitIntoListItems(data?.nice_to_haves)}
        </ul>
      </div>
    </div>
  );
};

export default Jobdescription;
