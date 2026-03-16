const { spawn } = require('child_process');

// Settings
const streamUrl = "rtmp://a.rtmp.youtube.com/live2/YOUR_STREAM_KEY"; // ඔයාගේ YouTube Stream Key එක මෙතනට දාන්න
const videoSource = "https://github.com/Viruna2010/VIRU-TV/releases/download/v50.0/Cinematic_hyperrealistic_8second_video_loop_of_a_m_e0cf9a7edf.mp4";
const audioSource = "https://github.com/viruna123/Cricket-Live/releases/download/v3.0/360-no-scope-the-soundlings_4cNYa2TG.mp3";

function startStream() {
    console.log("Starting 24/7 Lifetime Loop Stream...");

    const ffmpeg = spawn('ffmpeg', [
        '-re',
        '-stream_loop', '-1', // වීඩියෝ එක නොනවත්වා ලූප් කිරීමට
        '-i', videoSource,
        '-stream_loop', '-1', // ඕඩියෝ එක නොනවත්වා ලූප් කිරීමට
        '-i', audioSource,
        '-map', '0:v:0',      // පළමු input එකෙන් වීඩියෝ එක ගන්න
        '-map', '1:a:0',      // දෙවන input එකෙන් ඕඩියෝ එක ගන්න
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-b:v', '125k',        // Video bitrate (GB 80 ලිමිට් එකට ගැලපෙන්න)
        '-maxrate', '125k',
        '-bufsize', '250k',
        '-framerate', '15',    // ස්මූත් ලූප් එකක් සඳහා FPS 15ක් ඇති
        '-s', '426x240',       // Resolution 240p (Bandwidth ඉතිරි කරගන්න)
        '-c:a', 'aac',
        '-b:a', '128k',        // ඔයා ඉල්ලපු High Quality Audio
        '-ar', '44100',
        '-f', 'flv',
        streamUrl
    ]);

    ffmpeg.stderr.on('data', (data) => {
        // ලයිව් එකේ තත්ත්වය කන්සෝල් එකේ පෙන්වයි
        console.log(`FFMPEG: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        console.log(`Stream connection lost (Code: ${code}). Reconnecting...`);
        setTimeout(startStream, 5000); // මොකක් හරි හේතුවකින් නැවතුණොත් තත්පර 5කින් නැවත පටන් ගනී
    });
}

startStream();
