import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { ProjectsPage } from "@/components/pages/projects-page";

export const metadata = { title: "Projets - Nocturne Studio" };
export default function Page() {
  return <ProjectsPage action={<CreateProjectDialog />} />;
}
