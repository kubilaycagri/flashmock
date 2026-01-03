import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import path from 'node:path';
import fs from 'fs-extra';
import p from 'picocolors';
import { fileURLToPath } from 'node:url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mocksDir = path.join(process.cwd(), 'mocks');
// When running from `dist`, the templates and public folders are one level up
const templatesDir = path.join(__dirname, '..', 'templates'); 
const publicDir = path.join(__dirname, '..', 'public');

interface DirNode {
    name: string;
    path: string;
    type: 'folder' | 'file';
    children?: DirNode[];
}

// Helper to recursively read directory structure
async function getDirTree(dirPath: string): Promise<DirNode[]> {
    if (!await fs.pathExists(dirPath)) {
        return [];
    }
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    const tree: DirNode[] = [];
    for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        const node: DirNode = {
            name: item.name,
            path: path.relative(process.cwd(), fullPath),
            type: item.isDirectory() ? 'folder' : 'file',
        };
        if (item.isDirectory()) {
            node.children = await getDirTree(fullPath);
        }
        tree.push(node);
    }
    return tree;
}


export function startUiServer(port = 3001) {
    const app = new Hono();

    app.use('*', cors());

    const api = new Hono();

    // API endpoint to list files in mocks directory
    api.get('/files', async (c: Context) => {
        try {
            const tree = await getDirTree(mocksDir);
            return c.json(tree);
        } catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
                return c.json({ error: 'Mocks directory not found. Start by creating it or applying a template.' }, 404);
            }
            return c.json({ error: `Failed to read mocks directory: ${error instanceof Error ? error.message : String(error)}` }, 500);
        }
    });

    // API endpoint to get file content
    api.get('/file', async (c: Context) => {
        const filePath = c.req.query('path');
        if (!filePath) return c.json({ error: 'File path is required' }, 400);

        const safePath = path.join(process.cwd(), filePath);
        // Security: Ensure path is within the project
        if (!safePath.startsWith(path.resolve(mocksDir))) { // Use path.resolve for proper comparison
            return c.json({ error: 'Invalid path: Must be within mocks directory' }, 400);
        }
        try {
            const content = await fs.readFile(safePath, 'utf-8');
            return c.json({ content });
        } catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
                return c.json({ error: 'File not found' }, 404);
            }
            return c.json({ error: `Failed to read file: ${error instanceof Error ? error.message : String(error)}` }, 500);
        }
    });

    // API endpoint to create/update a file
    api.post('/file', async (c: Context) => {
        const { path: relativePath, content } = await c.req.json();
        if (!relativePath || content === undefined) {
            return c.json({ error: 'Path and content are required' }, 400);
        }
        const filePath = path.join(process.cwd(), relativePath);
         if (!filePath.startsWith(path.resolve(mocksDir))) { // Use path.resolve for proper comparison
            return c.json({ error: 'Path must be inside the mocks directory' }, 400);
        }
        try {
            await fs.outputFile(filePath, content);
            return c.json({ success: true, path: relativePath });
        } catch (error) {
            return c.json({ error: 'Failed to write file', details: error instanceof Error ? error.message : String(error) }, 500);
        }
    });
    
    // API endpoint to delete a file or folder
    api.delete('/file', async (c: Context) => {
        const { path: relativePath } = await c.req.json();
        if (!relativePath) return c.json({ error: 'Path is required' }, 400);

        const filePath = path.join(process.cwd(), relativePath);
         if (!filePath.startsWith(path.resolve(mocksDir))) { // Use path.resolve for proper comparison
            return c.json({ error: 'Path must be inside the mocks directory' }, 400);
        }
        try {
            await fs.remove(filePath);
            return c.json({ success: true, path: relativePath });
        } catch (error) {
            return c.json({ error: 'Failed to delete', details: error instanceof Error ? error.message : String(error) }, 500);
        }
    });

    // API endpoint to list templates
    api.get('/templates', async (c: Context) => {
        try {
            if (!await fs.pathExists(templatesDir)) {
                return c.json([]);
            }
            const templates = await fs.readdir(templatesDir);
            const templateFolders = await Promise.all(
                templates.map(async name => {
                    const fullPath = path.join(templatesDir, name);
                    const stat = await fs.stat(fullPath);
                    return stat.isDirectory() ? name : null;
                })
            );
            return c.json(templateFolders.filter(Boolean));
        } catch (error) {
             console.error(p.red('Error listing templates:'), error);
             return c.json([], 500); // Return empty array on error
        }
    });

    // API endpoint to apply a template
    api.post('/template', async (c: Context) => {
        const { name } = await c.req.json();
        if (!name) return c.json({ error: 'Template name is required' }, 400);
        
        const templatePath = path.join(templatesDir, name);

        if (!await fs.pathExists(templatePath) || !(await fs.stat(templatePath)).isDirectory()) {
            return c.json({ error: `Template '${name}' not found or is not a directory.` }, 404);
        }

        try {
            await fs.emptyDir(mocksDir); // Clear mocks directory before applying template
            await fs.copy(templatePath, mocksDir, { overwrite: true });
            return c.json({ success: true, message: `Template '${name}' applied.` });
        } catch (error) {
            return c.json({ error: `Failed to apply template '${name}'`, details: error instanceof Error ? error.message : String(error) }, 500);
        }
    });


    app.route('/_ui/api', api);

    // Static file serving
    app.use('/*', serveStatic({ root: publicDir }));
    app.get('*', serveStatic({ path: path.join(publicDir, 'index.html') }));


    serve({ fetch: app.fetch, port }, (info) => {
         console.log(p.bgBlue(p.black(`
 FlashMock UI server started `)));
         console.log(p.white(`› Listening on: http://localhost:${info.port}`));
    });
}
