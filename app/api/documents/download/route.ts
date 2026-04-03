import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

// Create an HTTPS agent that explicitly bypasses SSL verification
// Required for corporate proxy environments with SSL interception
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

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
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
      httpsAgent,
      timeout: 30000,
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Content-Length': String(response.data.byteLength),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Download Proxy Error:', error.message);
    return NextResponse.json({ 
      error: 'Failed to download file', 
      details: error.message,
    }, { status: 500 });
  }
}
