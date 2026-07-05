import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminClient from "./admin-client";

const ADMIN_EMAIL = "enriquereckev@gmail.com";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.auth.getUser();
  if (profile.user?.email !== ADMIN_EMAIL) redirect("/");

  const { data: analyses } = await supabase
    .from("analyses")
    .select("id, created_at, store_name, brand_exhibited, confidence, products")
    .order("created_at", { ascending: false });

  const totalAnalyses = analyses?.length ?? 0;
  const totalProducts = analyses?.reduce((sum, a) => sum + (Array.isArray(a.products) ? a.products.length : 0), 0) ?? 0;
  const exhibited = analyses?.filter((a) => a.brand_exhibited).length ?? 0;

  return <AdminClient totalAnalyses={totalAnalyses} totalProducts={totalProducts} exhibited={exhibited} />;
}
