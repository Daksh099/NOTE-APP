import connectToDatabase from '@/lib/mongodb';
import Note from '@/models/Note';

function getErrorMessage(error) {
  if (error.message.includes('MONGODB_URI')) {
    return 'Database not configured. Please add MONGODB_URI to .env.local file.';
  }
  if (error.message.includes('connect')) {
    return 'Failed to connect to database. Please check your MONGODB_URI in .env.local';
  }
  return error.message;
}

export async function GET(request) {
  try {
    await connectToDatabase();

    const notes = await Note.find().sort({ createdAt: -1 });

    return Response.json(
      { success: true, data: notes },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/notes error:', error);
    return Response.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return Response.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const note = await Note.create({ title, content });

    return Response.json(
      { success: true, data: note },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/notes error:', error);
    return Response.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { success: false, error: 'Note ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return Response.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const note = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      return Response.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: note },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT /api/notes error:', error);
    return Response.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { success: false, error: 'Note ID is required' },
        { status: 400 }
      );
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return Response.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: note },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/notes error:', error);
    return Response.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
