#!/usr/bin/env node
import cac from 'cac';
import { startServer } from './server.js';
import { startUiServer } from './ui-server.js';
import p from 'picocolors';
const cli = cac('flashmock');
cli
    .command('start', 'Start the mock server')
    .option('--port <port>', 'Port to listen on', {
    default: 3000,
})
    .action((options) => {
    console.log(p.bold(p.yellow('⚡️ FlashMock Server ⚡️')));
    startServer(options.port);
});
cli
    .command('ui', 'Start the UI for managing mocks')
    .option('--port <port>', 'Port for the UI server', {
    default: 3001,
})
    .action((options) => {
    console.log(p.bold(p.yellow('⚡️ FlashMock UI ⚡️')));
    startUiServer(options.port);
});
cli.help();
cli.version('0.1.0');
try {
    cli.parse();
}
catch (error) {
    if (error instanceof Error) {
        console.error(p.red(error.message));
    }
    else {
        console.error(p.red('An unknown error occurred.'));
    }
    process.exit(1);
}
