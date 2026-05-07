import { projects } from "@/data/projects";
import IndexList from "@/components/IndexList";
import FilterBar from "@/components/FilterBar";

export default function IndexPage() {
  return (
    <div className="pt-[88px]">
      <FilterBar />
      <IndexList projects={projects} />
    </div>
  );
}
