import { Hono, type Context, type Handler } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import path from 'node:path';
import fs from 'node:fs/promises';
import chokidar from 'chokidar';
import p from 'picocolors';

const mocksDir = path.join(process.cwd(), 'mocks');
let serverInstance: ReturnType<typeof serve>;
let app = new Hono();

async function registerRoutes() {
  const newApp = new Hono();
  newApp.use('*', cors());

  try {
    const files = await fs.readdir(mocksDir, { recursive: true });
    console.log(p.cyan('Scanning mock files...'));

    for (const file of files) {
      const filePath = path.join(mocksDir, file as string);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) continue;

      const { dir, name: method, ext } = path.parse(filePath);
      const routePath = dir.replace(mocksDir, '').replace(/\[([^\]]+)\]/g, ':$1') || '/';
      const httpMethod = method.toLowerCase();

      // We don't log here anymore, we log when we actually register a valid method
      const register = (handler: Handler) => {
        let registered = true;
        switch (httpMethod) {
          case 'get':
            newApp.get(routePath, handler);
            break;
          case 'post':
            newApp.post(routePath, handler);
            break;
          case 'put':
            newApp.put(routePath, handler);
            break;
          case 'delete':
            newApp.delete(routePath, handler);
            break;
          case 'patch':
            newApp.patch(routePath, handler);
            break;
          default:
            registered = false;
        }
        if (registered) {
            console.log(p.green(`  › Registering: ${p.bold(httpMethod.toUpperCase())} ${routePath}`));
        }
      };

      if (ext === '.json') {
        const content = await fs.readFile(filePath, 'utf-8');
        const jsonContent = JSON.parse(content);
        register((c: Context) => c.json(jsonContent));
      } else if (ext === '.ts' || ext === '.js') {
        const handlerModule = await import(`${filePath}?t=${Date.now()}`);
        if (typeof handlerModule.default === 'function') {
          register(handlerModule.default);
        }
      }
    }
    app = newApp;
    console.log(p.cyan('Routes registered.'));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.log(p.yellow('No mocks directory found. Skipping route registration.'));
    } else {
      console.error(p.red('Error registering routes:'), error);
    }
  }
}

export async function startServer(port = 3000) {
  await registerRoutes();

  const watcher = chokidar.watch(mocksDir, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true, // Don't trigger on initial scan
  });

  // Debounce watcher events to avoid multiple reloads for one change
  let reloadTimeout: NodeJS.Timeout;
  watcher.on('all', (event, filePath) => {
    clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(async () => {
      console.log(p.magenta(`\n[${event}] ${path.relative(process.cwd(), filePath)}`));
      await registerRoutes();
      console.log(p.blue('Hot-reloaded routes successfully. Server is listening with new routes.'));
    }, 50);
  });

  serverInstance = serve(
    {
      fetch: (req: Request) => app.fetch(req),
      port,
    },
    (info: { port: number; address: string }) => {
      console.log(p.bgGreen(p.black(`\n FlashMock server started `)));
      console.log(p.white(`› Listening on: http://localhost:${info.port}`));
    }
  );
}
