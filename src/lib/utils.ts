export function extractHandle(url: string, platform: string): string {
  if (!url) return "";

  try {
    const cleanUrl = url.split('?')[0].replace(/\/$/, "");
    const validUrl = cleanUrl.includes("://") ? cleanUrl : `https://${cleanUrl}`;
    const uri = new URL(validUrl);
    
    const path = uri.pathname.replace(/\/$/, "");
    const parts = path.split("/").filter(Boolean);

    if (parts.length === 0) return "";
    if (platform === "youtube") {
      const segment = parts[parts.length - 1];
      return segment.startsWith("@") ? segment : `@${segment}`;
    }

    if (platform === "linkedin") {
      return parts[parts.length - 1];
    }

    return `@${parts[0]}`;
  } catch (error) {
    if (url.startsWith("@")) return url;
    return "";
  }
}