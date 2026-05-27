"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Button, Input } from "@/components/ui";
import { useCreateLink } from "@/hooks";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SHORT_DOMAIN = "http://localhost:8000";

export default function NewLinkPage() {
  const router = useRouter();
  const createLink = useCreateLink();

  const [originalUrl, setOriginalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!originalUrl.trim()) {
      errs.originalUrl = "Destination URL is required";
    } else {
      try {
        new URL(originalUrl);
      } catch {
        errs.originalUrl = "Enter a valid URL (include https://)";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await createLink.mutateAsync({
        original_url: originalUrl.trim(),
        title: title.trim() || undefined,
        custom_alias: customAlias.trim() || undefined,
        password: password || undefined,
      });
      const shortUrl = `${SHORT_DOMAIN}/${result.short_code}`;
      toast.success("Link created!", {
        description: shortUrl,
        action: {
          label: "Copy",
          onClick: () => navigator.clipboard.writeText(shortUrl),
        },
      });
      router.push("/dashboard/links");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create link");
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/links"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to links
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Create Link</h1>
        <p className="mt-1 text-sm text-neutral-400">Shorten a URL and customize your link.</p>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Destination URL *"
              type="url"
              placeholder="https://example.com/my-long-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              error={errors.originalUrl}
            />

            <Input
              label="Title"
              placeholder="My Link (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              label="Custom Alias"
              placeholder="my-custom-alias (optional)"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              hint="Leave blank for an auto-generated short code"
            />

            <Input
              label="Password Protection"
              type="password"
              placeholder="Set a password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint="Require visitors to enter a password before accessing the link"
            />

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={createLink.isPending}
                className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white shadow-lg shadow-terracotta-500/20 hover:from-terracotta-400 hover:to-terracotta-500"
              >
                {createLink.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Creating...
                  </>
                ) : (
                  "Create Link"
                )}
              </Button>
              <Link
                href="/dashboard/links"
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
