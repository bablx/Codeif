import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const USERS_FILE = join(process.cwd(), 'data', 'users.json');

async function getUsers() {
  try {
    const data = await readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUsers(users: any[]) {
  await mkdir(join(process.cwd(), 'data'), { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get existing users
    const users = await getUsers();

    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate random avatar color
    const colors = ["bg-[#7030E0]", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500", "bg-pink-500"];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    // Create new user
    const newUser = {
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
      avatarColor
    };

    users.push(newUser);
    await saveUsers(users);

    console.log('Account created:', { name, email });

    return NextResponse.json(
      { 
        message: 'Account created successfully',
        user: { name, email, avatarColor },
        redirect: '/login'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
