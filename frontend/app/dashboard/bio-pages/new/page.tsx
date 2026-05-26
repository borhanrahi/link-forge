"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, CardContent, SectionHeading } from "@/components/ui";
import { useCreateBioPage } from "@/hooks";
import { ArrowLeft, Layout } from "lucide-react";
import { toast } from "sonner";

const THEME_OPTIONS = [
  { id: "minimal", label: "Minimal" },
  { id: "dark", label: "Dark" },
  { id: "vibrant", label: "Vibrant" },
];

export default function NewBioPage() {
  const router = useRouter();
  const createBioPage = useCreateBioPage();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [theme, setTheme] = useState("minimal");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!slug.trim()) {
      errs.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(slug.trim())) {
      errs.slug = "Only lowercase letters, numbers, and hyphens allowed";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSlugChange = (value: string) => {
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createBioPage.mutateAsync({
        title: title.trim() || undefined,
        slug: slug.trim(),
        theme,
      });
      toast.success("Bio page created!");
      router.push("/dashboard/bio-pages");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create bio page");
    }
  };

  return (
    <div className="max-w-xl space-y-6 animate-fade-in">
      <Link
        href="/dashboard/bio-pages"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to bio pages
      </Link>

      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Create Bio Page
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Build a link-in-bio page to share all your important links.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Title"
              placeholder="My Bio Page (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              label="Slug *"
              placeholder="my-handle"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              error={errors.slug}
              hint="This will be your page URL: linknest.app/b/my-handle"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Theme</label>
              <div className="flex gap-2">
                {THEME_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                      theme === t.id
                        ? "border-terracotta-500 bg-terracotta-500/10 text-terracotta-400"
                        : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-600"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={createBioPage.isPending}>
                {createBioPage.isPending ? "Creating..." : "Create Bio Page"}
              </Button>
              <Link
                href="/dashboard/bio-pages"
                className="text-sm text-neutral-400 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
