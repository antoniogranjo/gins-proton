import { join } from 'path';
import { homedir } from 'os';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const CONFIG_DIR = join(homedir(), '.gins-proton');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export interface AppConfig {
  region: string;
  profile: string;
}

const DEFAULT_CONFIG: AppConfig = {
  region: 'us-east-1',
  profile: 'default',
};

export async function readConfig(): Promise<AppConfig> {
  try {
    if (!existsSync(CONFIG_FILE)) {
      await saveConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }
    const data = await readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read config:', err);
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(config: AppConfig): Promise<void> {
  try {
    if (!existsSync(CONFIG_DIR)) {
      await mkdir(CONFIG_DIR, { recursive: true });
    }
    await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save config:', err);
  }
}
