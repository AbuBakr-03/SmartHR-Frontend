import { Users, MapPin } from "lucide-react";
import img from "@/assets/data-entry.webp";
// import colors from "../../../styles/global.module.css";
import { useParams } from "react-router-dom";
import { useRetrieveJob } from "@/hooks/useJob";

const Jobhero: React.FC = () => {
  const { id } = useParams();
  const job = useRetrieveJob(Number(id));
  const { data } = job;

  return (
    <div className={`justify-items-center bg-slate-50 py-8`}>
      <div className={`grid w-9/12 place-items-center gap-8 md:grid-cols-2`}>
        <div className={`grid gap-8 md:justify-self-start`}>
          <h1 className={`text-4xl font-bold text-slate-900`}>{data?.title}</h1>
          <div className={`grid items-center gap-4`}>
            <div className={`grid grid-cols-2 place-items-center`}>
              <div className={`rounded-full border-2 border-slate-900 p-1`}>
                <Users></Users>
              </div>
              <p className={`justify-self-start font-medium text-slate-900`}>
                {data?.department.title}
              </p>
            </div>
            <div className={`grid grid-cols-2 place-items-center`}>
              <div className={`rounded-full border-2 border-slate-900 p-1`}>
                <MapPin></MapPin>
              </div>
              <p className={`justify-self-start text-slate-900`}>
                {data?.location}
              </p>
            </div>
          </div>
        </div>
        <img
          className={`rounded-md border object-cover md:aspect-video md:justify-self-end lg:w-8/12`}
          src={img}
          alt=""
        />
      </div>
    </div>
  );
};
export default Jobhero;
