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
exports.splitEvenlyInSeconds = exports.getVideoDurationForCwd = exports.reduceVideoSize = exports.mergeVideos = void 0;
const fs_1 = require("fs");
const colors_1 = __importDefault(require("colors"));
const util_1 = __importDefault(require("util"));
const exec = util_1.default.promisify(require('child_process').exec);
// Note the list must be like this
// file 1.mp4
// file 2.mp4
// and so on
const mergeVideos = (list, output) => __awaiter(void 0, void 0, void 0, function* () {
    yield exec(`ffmpeg -f concat -i ${list} -c copy ${output}`);
});
exports.mergeVideos = mergeVideos;
const reduceVideoSize = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    let [_, videoName, extension] = fileName.match(/(.+)\.(.+)$/);
    yield exec(`ffmpeg -i ${fileName} -vcodec libx265 -crf 28 ${videoName}_reduce.${extension}`);
});
exports.reduceVideoSize = reduceVideoSize;
const getVideoDurationForCwd = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, fs_1.readdirSync)(process.cwd()).forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        let [_, extension] = file.match(/.+\.(.+)$/) || '.jpeg';
        if (extension === 'png' || extension === 'jpg' || extension === 'jpeg')
            return;
        let { stdout } = yield exec(`ffmpeg -i "${file}" 2>&1 | grep "Duration"| cut -d ' ' -f 4 | sed s/,//`);
        stdout = stdout.slice(3, stdout.length - 1);
        const fileSizeInBytes = (0, fs_1.statSync)(file).size;
        const fileSizeInMegaBytes = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
        if (stdout) {
            console.log(`${colors_1.default.cyan(stdout.trim())} - ${colors_1.default.yellow(fileSizeInMegaBytes)}${colors_1.default.red('mb')} - ${colors_1.default.green(file)}`);
        }
    }));
});
exports.getVideoDurationForCwd = getVideoDurationForCwd;
const splitEvenlyInSeconds = (videoPath, seconds, namingScheme) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let [_, extension] = videoPath.match(/.+\.(.+)$/);
        yield exec(`ffmpeg -i "${videoPath}" -c copy -map 0 -f segment -segment_time ${seconds} -reset_timestamps 1 -segment_format_options movflags=+faststart ${namingScheme}%d.${extension}`);
        console.log('Finished creating files!');
    }
    catch (e) {
        console.log('Error creating files');
        console.log(e);
    }
});
exports.splitEvenlyInSeconds = splitEvenlyInSeconds;
