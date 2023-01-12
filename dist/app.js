"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const commands_1 = require("./commands");
yargs_1.default.command({
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
    handler({ n, l, s, o }) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, commands_1.reduceVideoSize)(String(n));
        });
    },
});
yargs_1.default.command({
    command: 'vidreduce',
    describe: 'Reduce the filesize and keep as much quality',
    builder: {
        n: {
            describe: 'Video name (MUST BE IN DIRECTORY)',
            demandOption: true,
            type: 'string',
        },
    },
    handler({ n }) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, commands_1.reduceVideoSize)(String(n));
        });
    },
});
yargs_1.default.command({
    command: 'vidmerge',
    describe: 'merge a list of video files toegether',
    builder: {
        l: {
            describe: 'Text file list of files to merge(MUST BE IN DIRECTORY)',
            demandOption: true,
            type: 'string',
        },
        o: {
            describe: 'Output file',
            demandOption: true,
            type: 'string',
        },
    },
    handler({ l, o }) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, commands_1.mergeVideos)(String(l), String(o));
        });
    },
});
yargs_1.default.command({
    command: 'vidtime',
    describe: 'Get the time of a Videofile',
    builder: {
        l: {
            describe: 'List videos and their sizes in a directory',
            demandOption: false,
            type: 'boolean',
        },
    },
    handler({ l }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (l)
                yield (0, commands_1.getVideoDurationForCwd)();
        });
    },
});
yargs_1.default.command({
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
    handler({ n, t, o }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, commands_1.splitEvenlyInSeconds)(String(n), Number(t), String(o));
        });
    },
});
yargs_1.default.parse();
