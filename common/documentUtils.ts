/**
 * Generates a Cloudinary transformation URL for document previews.
 * Support for Images and first-page PDF thumbnails.
 * @param url - The original Cloudinary URL
 * @param fileType - The file extension/type (e.g., 'pdf', 'jpg')
 * @returns A transformed URL or the original if unsupported.
 */
export function getDocumentPreviewUrl(url: string, fileType: string): string | null {
  if (!url || !url.includes("cloudinary.com")) return null;

  const type = fileType?.toLowerCase();
  
  // Base transformations: fit into 600x400 area, maintain aspect, use auto format/quality
  const transformations = "c_fill,h_400,w_600,f_auto,q_auto";

  if (["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(type)) {
    return url.replace("/upload/", `/upload/${transformations}/`);
  }

  if (type === "pdf") {
    // For PDFs, we add pg_1 to get the first page as an image
    return url.replace("/upload/", `/upload/pg_1,${transformations}/`).replace(".pdf", ".jpg");
  }

  // Fallback for other formats (DOCX, etc. don't support direct image transformation as easily)
  return null;
}
