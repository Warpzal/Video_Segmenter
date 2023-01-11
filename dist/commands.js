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
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitEvenlyInSeconds = exports.getVideoDuration = exports.getVideoDurationForCwd = exports.reduceVideoSize = void 0;
const { readdirSync, statSync } = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const colors = require('colors');
const reduceVideoSize = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    let [_, videoName, extension] = fileName.match(/(.+)\.(.+)$/);
    yield exec(`ffmpeg -i ${fileName} -vcodec libx265 -crf 28 ${videoName}_reduce.${extension}`);
});
exports.reduceVideoSize = reduceVideoSize;
const getVideoDurationForCwd = () => __awaiter(void 0, void 0, void 0, function* () {
    readdirSync(process.cwd()).forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        let [_, extension] = file.match(/.+\.(.+)$/) || '.jpeg';
        if (extension === 'png' || extension === 'jpg' || extension === 'jpeg')
            return;
        let { stdout } = yield exec(`ffmpeg -i "${file}" 2>&1 | grep "Duration"| cut -d ' ' -f 4 | sed s/,//`);
        stdout = stdout.slice(3, stdout.length - 1);
        const fileSizeInBytes = statSync(file).size;
        const fileSizeInMegaBytes = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
        if (stdout)
            console.log(`${colors.cyan(stdout.trim())} - ${colors.yellow(fileSizeInMegaBytes)}${colors.red('mb')} - ${colors.green(file)}`);
    }));
});
exports.getVideoDurationForCwd = getVideoDurationForCwd;
const getVideoDuration = (videoName) => __awaiter(void 0, void 0, void 0, function* () {
    const log = yield exec(`ffmpeg -i ${videoName} 2>&1 | grep "Duration"| cut -d ' ' -f 4 | sed s/,//`);
    console.log(log.stdout.trim());
});
exports.getVideoDuration = getVideoDuration;
const splitEvenlyInSeconds = (videoPath, seconds, namingScheme) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let [_, extension] = videoPath.match(/.+\.(.+)$/);
        yield exec(`ffmpeg -i ${videoPath} -c copy -map 0 -f segment -segment_time ${seconds} -reset_timestamps 1 -segment_format_options movflags=+faststart ${namingScheme}%d.${extension}`);
        console.log('Finished creating files!');
    }
    catch (e) {
        console.log('Error creating files');
        console.log(e);
    }
});
exports.splitEvenlyInSeconds = splitEvenlyInSeconds;
