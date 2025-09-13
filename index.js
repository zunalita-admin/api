import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const apiDir = path.join(process.cwd(), 'api');
  let files = [];

  try {
    files = fs.readdirSync(apiDir).filter(file => file.endsWith('.js'));
  } catch (err) {
    console.error('Error reading /api:', err);
  }

  res.status(200).json({
    message: 'This is zunalita api, served by vercel',
    api_files: files
  });
}
