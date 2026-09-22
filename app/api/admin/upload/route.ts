import { NextRequest, NextResponse } from 'next/server';
import { protectAdminRoute } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  try {
    await protectAdminRoute(request);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, and WebP allowed.',
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: 'File too large. Maximum size is 5MB.',
        },
        { status: 400 }
      );
    }

    // In production, upload to Cloudinary, AWS S3, or similar
    // For now, return a mock URL with the filename
    const filename = `${Date.now()}-${file.name}`;
    const mockUrl = `/uploads/medicines/${filename}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          url: mockUrl,
          filename: filename,
          size: file.size,
          type: file.type,
        },
        message: 'Image uploaded successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload image',
      },
      { status: 500 }
    );
  }
}
