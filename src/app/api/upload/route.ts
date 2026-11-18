import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Check if Cloudinary credentials are provided
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'blessed-drinks',
              transformation: [{ width: 1000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
            },
            (error, result) => {
              if (error) return reject(error)
              resolve(result)
            }
          )
          .end(buffer)
      })

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      })
    } else {
      // Local Base64 preview fallback if Cloudinary credentials are not configured in dev
      const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`
      return NextResponse.json({
        success: true,
        url: base64Data,
        note: 'Fallback base64 data generated. Add CLOUDINARY credentials in .env for production storage.',
      })
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Image upload failed' },
      { status: 500 }
    )
  }
}
