import { Card } from "@/components/ui/card";
import { AdminCreateTrainingForm } from "./_components/admin-create-training-form";
import { db } from "@/lib/db";

const AdminCreateTrainingPage = async () => {
  const courses = await db.course.findMany({
    where: {
      active: true,
    },
  });

  const companies = await db.company.findMany({
    where: {
      active: true,
      isValid: true,
    },
  });

  return <AdminCreateTrainingForm courses={courses} companies={companies} />;
};

export default AdminCreateTrainingPage;
