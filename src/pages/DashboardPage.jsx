import { Routes, Route } from "react-router-dom";
import DashboardGate from "../dashboard/DashboardGate";
import DashboardLayout from "../dashboard/DashboardLayout";
import ProfileEditor from "../dashboard/ProfileEditor";
import SkillsEditor from "../dashboard/SkillsEditor";
import ProjectsEditor from "../dashboard/ProjectsEditor";
import ExperienceEditor from "../dashboard/ExperienceEditor";
import CertificatesEditor from "../dashboard/CertificatesEditor";

export default function DashboardPage() {
  return (
    <Routes>
      <Route element={<DashboardGate />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<ProfileEditor />} />
          <Route path="skills" element={<SkillsEditor />} />
          <Route path="projects" element={<ProjectsEditor />} />
          <Route path="experience" element={<ExperienceEditor />} />
          <Route path="certificates" element={<CertificatesEditor />} />
        </Route>
      </Route>
    </Routes>
  );
}
