import axios from 'axios';

export type DemonlistLevel = {
  id: number;
  level_id: number;
  verifier_id: number;
  place: number;
  score: number;
  minimal_percent: number;
  length: number;
  objects: number;
  name: string;
  description: string;
  verifier: string;
  creator: string;
  holder: string;
  video: string;
  song: string;
  created_in: string;
  password: string;
};

export async function getDemonList() {
  const response = await axios.get<{ data: DemonlistLevel[] }>(
    '/api/demonlist'
  );

  if (response.data?.data && Array.isArray(response.data?.data)) {
    return response.data.data;
  }
  {
    return [];
  }
}
