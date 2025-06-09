import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await axios.get(
      'https://api.demonlist.org/levels/classic?search=&levels_type=all&limit=0'
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return NextResponse.json(
      { error: 'Не удалось получить данные с Demonlist API' },
      { status: 500 }
    );
  }
}
