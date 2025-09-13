import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const baseUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api`;
  const apiDir = path.join(process.cwd(), 'api');
  let files = [];

  try {
    files = fs.readdirSync(apiDir).filter(file => file.endsWith('.js'));
  } catch (err) {
    console.error('Error reading /api:', err);
  }

  const routes = {};
  files.forEach(file => {
    const name = file.replace('.js', '');
    if (name === 'index') return;
    routes[`${name}_url`] = `${baseUrl}/${name}{?params}`;
  });

  res.status(200).json({
    message: 'Welcome to Zunalita API',
    documentation_url: `${baseUrl}/docs`,
    ...routes
  });
}
