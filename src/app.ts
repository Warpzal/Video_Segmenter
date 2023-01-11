import yargs from 'yargs'
import { splitEvenlyInSeconds, getVideoDuration, getVideoDurationForCwd, reduceVideoSize } from './commands'

yargs.command({
    command: 'vid',
    describe: 'Video management utility tool',
    builder: {
        n: {
            describe: 'Video name (MUST BE IN DIRECTORY)',
            demandOption: false,
            type: 'string',
        },
        l: {
            describe: 'List videos and their sizes in a directory',
            demandOption: false,
            type: 'boolean',
        },
        s: {
            describe: 'Will split a video after every X seconds',
            demandOption: false,
            type: 'number',
        },
        o: {
            describe: 'Naming Scheme',
            demandOption: false,
            type: 'string',
        },
    },
    async handler({ n, l, s, o }) {
        reduceVideoSize(String(n))
    },
})

yargs.command({
    command: 'vidreduce',
    describe: 'Reduce the filesize and keep as much quality',
    builder: {
        n: {
            describe: 'Video name (MUST BE IN DIRECTORY)',
            demandOption: true,
            type: 'string',
        },
    },
    async handler({ n }) {
        reduceVideoSize(String(n))
    },
})

yargs.command({
    command: 'vidtime',
    describe: 'Get the time of a Videofile',
    builder: {
        n: {
            describe: 'Video name (MUST BE IN DIRECTORY)',
            demandOption: false,
            type: 'string',
        },
        l: {
            describe: 'List videos and their sizes in a directory',
            demandOption: false,
            type: 'boolean',
        },
    },
    async handler({ n, l }) {
        if (n) {
            await getVideoDuration(String(n))
        }
        if (l) {
            await getVideoDurationForCwd()
        }
    },
})

yargs.command({
    command: 'vidsplit',
    describe: 'Splits a video into smaller parts',
    builder: {
        t: {
            describe: 'Will split a video after every X seconds',
            demandOption: true,
            type: 'number',
        },
        n: {
            describe: 'Name of the file (MUST be in directory)',
            demandOption: true,
            type: 'string',
        },
        o: {
            describe: 'Naming Scheme',
            demandOption: true,
            type: 'string',
        },
    },
    async handler({ n, t, o }) {
        await splitEvenlyInSeconds(String(n), Number(t), String(o))
    },
})

yargs.parse()
