import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { addWidget } from "../actions";
import { Plus } from "lucide-react";
import { Widget } from "@/types";
import { ClientEditorWrapper } from "@/components/editor/ClientEditorWrapper";

export const dynamic = "force-dynamic";

export default async function EditorPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect("/login");

const [profileResponse, widgetsResponse] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('widgets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true }),
  ]);

  const profile = profileResponse.data;

  if (profile && !profile.username) {
    redirect("/settings");
  }

  const widgets: Widget[] = widgetsResponse.data || [];
  const isEmpty = widgets.length === 0;

  return (
    <main className="max-w-7xl mx-auto p-6 lg:p-12 relative z-0">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="h-16 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl mb-6 flex items-center justify-center text-zinc-400">
            <Plus size={32} />
          </div>

          <h2 className="text-xl font-medium mb-2">Your grid is empty</h2>

          <p className="text-zinc-500 text-center max-w-xs">
            Start adding widgets using the dock below to showcase your work.
          </p>
        </div>
      ) : (
        <ClientEditorWrapper
          initialWidgets={widgets}
          profile={profile}
          onAdd={addWidget}
        />
      )}
    </main>
  );
}