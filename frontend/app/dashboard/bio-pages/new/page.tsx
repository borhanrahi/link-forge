"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Button, Input } from "@/components/ui";
import { useCreateBioPage } from "@/hooks";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BIO_TEMPLATES } from "@/lib/bio-templates";

const SHORT_DOMAIN = "http://localhost:8000";

export default function NewBioPage() {
  const router = useRouter();
  const createBioPage = useCreateBioPage();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [templateId, setTemplateId] = useState("minimal");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedTemplate = BIO_TEMPLATES.find((t) => t.id === templateId)!;

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
        theme: selectedTemplate.theme,
        brand_color: selectedTemplate.brand_color,
        bg_color: selectedTemplate.bg_color,
        font_family: selectedTemplate.font_family,
      });
      const pageUrl = `${SHORT_DOMAIN}/b/${slug.trim()}`;
      await navigator.clipboard.writeText(pageUrl);
      toast.success("Bio page created! URL copied to clipboard.", {
        description: pageUrl,
      });
      router.push("/dashboard/bio-pages");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create bio page");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/bio-pages"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to bio pages
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Create Bio Page</h1>
        <p className="mt-1 text-sm text-neutral-400">Build a link-in-bio page to share all your important links.</p>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          {/* Template picker */}
          <div className="space-y-3 mb-6">
            <label className="text-sm font-medium text-neutral-200">Choose a Template</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {BIO_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  className="relative rounded-xl border-2 overflow-hidden transition-all text-left"
                  style={{
                    borderColor: templateId === t.id ? t.brand_color : "transparent",
                    boxShadow: templateId === t.id ? `0 0 0 1px ${t.brand_color}` : "none",
                  }}
                >
                  {templateId === t.id && (
                    <div className="absolute top-1 right-1 z-10">
                      <div className="h-5 w-5 rounded-full flex items-center justify-center" style={{ backgroundColor: t.brand_color }}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                  <div
                    className="h-20 flex flex-col items-center justify-center gap-1 p-2"
                    style={{
                      backgroundColor: t.bg_color,
                      color: t.brand_color,
                      fontFamily: t.font_family === "serif" ? "Georgia, serif" : "Inter, sans-serif",
                    }}
                  >
                    <div
                      className="h-6 w-6 border-2"
                      style={{
                        borderRadius:
                          t.preview.avatarShape === "circle" ? "50%" :
                          t.preview.avatarShape === "rounded" ? "6px" : "2px",
                        borderColor: t.brand_color,
                      }}
                    />
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: "60%",
                        backgroundColor: t.brand_color,
                        opacity: 0.6,
                        borderRadius: t.preview.linkStyle === "pill" ? "999px" : "3px",
                      }}
                    />
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: "40%",
                        backgroundColor: t.brand_color,
                        opacity: 0.4,
                        borderRadius: t.preview.linkStyle === "pill" ? "999px" : "3px",
                      }}
                    />
                  </div>
                  <div className="px-2 py-1.5 bg-neutral-950">
                    <p className="text-xs font-medium text-neutral-200 truncate">{t.name}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

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
              hint={
                slug.trim()
                  ? `Your page URL: ${SHORT_DOMAIN}/b/${slug.trim()}`
                  : "Lowercase letters, numbers, and hyphens only"
              }
            />

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={createBioPage.isPending}
                className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/20 hover:from-terracotta-400 hover:to-terracotta-500"
              >
                {createBioPage.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Creating...
                  </>
                ) : (
                  "Create Bio Page"
                )}
              </Button>
              <Link
                href="/dashboard/bio-pages"
                className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
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
