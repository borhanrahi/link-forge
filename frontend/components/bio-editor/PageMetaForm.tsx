"use client";

import { Card, CardContent, Input } from "@/components/ui";

export interface PageMetaFormProps {
  title: string;
  subtitle: string;
  profileImageUrl: string;
  onTitleChange: (v: string) => void;
  onSubtitleChange: (v: string) => void;
  onProfileImageChange: (v: string) => void;
}

export function PageMetaForm({
  title,
  subtitle,
  profileImageUrl,
  onTitleChange,
  onSubtitleChange,
  onProfileImageChange,
}: PageMetaFormProps) {
  return (
    <Card>
      <CardContent className="p-5 space-y-5">
        <Input
          label="Page Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="My Bio Page"
        />
        <Input
          label="Subtitle"
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="A short description or tagline"
          hint="Appears below the title on your public page"
        />
        <Input
          label="Profile Image URL"
          value={profileImageUrl}
          onChange={(e) => onProfileImageChange(e.target.value)}
          placeholder="https://example.com/avatar.jpg"
        />
      </CardContent>
    </Card>
  );
}
