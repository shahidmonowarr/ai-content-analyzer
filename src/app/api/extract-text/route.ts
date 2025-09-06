import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the URL content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Simple text extraction from HTML (no cheerio needed for basic extraction)
    const text = extractTextFromHtml(html);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error extracting text from URL:", error);
    return NextResponse.json(
      { error: "Failed to extract text from URL" },
      { status: 500 }
    );
  }
}

// Simple HTML to text extraction
function extractTextFromHtml(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  // Replace HTML tags with spaces
  text = text.replace(/<[^>]+>/g, " ");

  // Replace multiple spaces/newlines with single space
  text = text.replace(/\s+/g, " ");

  // Trim and limit length
  text = text.trim();

  // Limit to reasonable length to avoid performance issues
  if (text.length > 10000) {
    text = text.substring(0, 10000) + "... [content truncated]";
  }

  return text;
}
