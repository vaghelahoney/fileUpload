import Dashboard from "@/modules/user/Dashboard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const crsData = { crsScore: 450, workVisaScore: 75 };

  return <Dashboard user={session.user as any} crsData={crsData} />;
}
