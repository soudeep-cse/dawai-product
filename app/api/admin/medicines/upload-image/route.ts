import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'medicines');

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json(
      {
        success: true,
        filename,
        url: `/uploads/medicines/${filename}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
