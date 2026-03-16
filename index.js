const { spawn } = require('child_process');

// මෙතනදී Stream Key එක කෙලින්ම දෙන්නේ නැතුව environment variable එකකින් ගන්නවා
const streamKey = process.env.YT_STREAM_KEY; 
const streamUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;

const videoSource = "https://github.com/Viruna2010/VIRU-TV/releases/download/v50.0/Cinematic_hyperrealistic_8second_video_loop_of_a_m_e0cf9a7edf.mp4";
const audioSource = "https://github.com/viruna123/Cricket-Live/releases/download/v3.0/360-no-scope-the-soundlings_4cNYa2TG.mp3";

function startStream() {
    if (!streamKey) {
        console.error("Error: YT_STREAM_KEY environment variable එක දාලා නැහැ!");
        process.exit(1);
    }

    console.log("Starting 24/7 International Music Stream...");

    const ffmpeg = spawn('ffmpeg', [
        '-re',
        '-stream_loop', '-1',
        '-i', videoSource,
        '-stream_loop', '-1',
        '-i', audioSource,
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-b:v', '125k',        // GB 80 Limit එකට ගැලපෙන්න
        '-maxrate', '125k',
        '-bufsize', '250k',
        '-framerate', '15',
        '-s', '426x240',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', '44100',
        '-f', 'flv',
        streamUrl
    ]);

    ffmpeg.stderr.on('data', (data) => {
        console.log(`FFMPEG Status: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        console.log(`Stream restart වෙමින් පවතී... Code: ${code}`);
        setTimeout(startStream, 5000);
    });
}

startStream();
