import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HomeClient from "./home-client";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: analyses } = await supabase
    .from("analyses")
    .select("id, store_name, brand_exhibited, confidence, created_at, products")
    .order("created_at", { ascending: false })
    .limit(20);

  return <HomeClient user={user} analyses={analyses ?? []} />;
}
