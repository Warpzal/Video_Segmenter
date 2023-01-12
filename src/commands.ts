import { readdirSync, statSync } from 'fs'
import colors from 'colors'
import util from 'util'

const exec = util.promisify(require('child_process').exec)

// Note the list must be like this
// file 1.mp4
// file 2.mp4
// and so on
export const mergeVideos = async (list: string, output: string) => {
    await exec(`ffmpeg -f concat -i ${list} -c copy ${output}`)
}

export const reduceVideoSize = async (fileName: string) => {
    let [_, videoName, extension] = fileName.match(/(.+)\.(.+)$/)!
    await exec(
        `ffmpeg -i ${fileName} -vcodec libx265 -crf 28 ${videoName}_reduce.${extension}`
    )
}

export const getVideoDurationForCwd = async () => {
    readdirSync(process.cwd()).forEach(async (file: string) => {
        let [_, extension] = file.match(/.+\.(.+)$/) || '.jpeg'
        if (extension === 'png' || extension === 'jpg' || extension === 'jpeg')
            return

        let { stdout } = await exec(
            `ffmpeg -i "${file}" 2>&1 | grep "Duration"| cut -d ' ' -f 4 | sed s/,//`
        )
        stdout = stdout.slice(3, stdout.length - 1)
        const fileSizeInBytes = statSync(file).size
        const fileSizeInMegaBytes = (fileSizeInBytes / (1024 * 1024)).toFixed(2)

        if (stdout) {
            console.log(
                `${colors.cyan(stdout.trim())} - ${colors.yellow(
                    fileSizeInMegaBytes
                )}${colors.red('mb')} - ${colors.green(file)}`
            )
        }
    })
}

export const splitEvenlyInSeconds = async (
    videoPath: string,
    seconds: number,
    namingScheme: string
) => {
    try {
        let [_, extension] = videoPath.match(/.+\.(.+)$/)!
        await exec(
            `ffmpeg -i "${videoPath}" -c copy -map 0 -f segment -segment_time ${seconds} -reset_timestamps 1 -segment_format_options movflags=+faststart ${namingScheme}%d.${extension}`
        )
        console.log('Finished creating files!')
    } catch (e) {
        console.log('Error creating files')
        console.log(e)
    }
}
