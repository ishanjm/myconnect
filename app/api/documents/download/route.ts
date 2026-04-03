import { NextResponse } from 'next/server';

// Allow self-signed certificates (corporate proxy / dev only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * @swagger
 * /api/documents/download:
 *   get:
 *     summary: Proxy to force download of cross-origin assets (Cloudinary)
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: url
 *         description: The encoded Cloudinary source URL
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: filename
 *         description: The desired local filename for the download
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Triggers a browser "Save As" dialog
 *       400:
 *         description: Missing URL or filename
 *       500:
 *         description: Remote fetch failed
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get('url');
  const filename = searchParams.get('filename');

  if (!fileUrl || !filename) {
    return NextResponse.json({ error: 'URL and filename are required' }, { status: 400 });
  }

  try {
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      console.error(`Failed to fetch file from ${fileUrl}: ${response.statusText}`);
      return NextResponse.json({ error: 'Failed to fetch the remote file' }, { status: 502 });
    }

    const headers = new Headers();

    // Set content type and attachment headers
    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    headers.set('Cache-Control', 'no-cache');

    // Return the response body stream directly
    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Download Proxy Exception:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during download' }, { status: 500 });
  }
}
