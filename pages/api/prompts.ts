import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const rootDirectory = process.cwd(); // Get the root directory of the application
  const csvFilePath = path.join(rootDirectory, 'prompts.csv'); // Construct the full file path for prompts.csv

  if (!fs.existsSync(csvFilePath)) {
    // Return a 404 response if the prompts.csv file does not exist
    res.status(404).json({ message: 'File not found' });
    return;
  }

  const results: any[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data: any) => results.push(data))
    .on('end', () => {
      res.status(200).json(JSON.stringify(results));
    });
}
