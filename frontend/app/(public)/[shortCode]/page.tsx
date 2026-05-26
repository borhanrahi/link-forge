import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ shortCode: string }>;
}

export default async function ShortCodeRedirect(props: Props) {
  const { shortCode } = await props.params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${apiUrl}/${shortCode}`, { redirect: "manual" });
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (location) {
        redirect(location);
      }
    }
  } catch {}

  redirect("/");
}
