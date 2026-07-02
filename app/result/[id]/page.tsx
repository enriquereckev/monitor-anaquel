import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ResultClient from "./result-client";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!data) notFound();
  return <ResultClient analysis={data} />;
}
