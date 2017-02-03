#!/usr/bin/env node
':' //; export TERM=xterm-256color
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
/**
*  ____  _____ __  __ _   ___  __  ___ ___
* |  _ \| ____|  \/  | | | \ \/ / |_ _/ _ \
* | |_) |  _| | |\/| | | | |\  /   | | | | |
* |  _ <| |___| |  | | |_| |/  \ _ | | |_| |
* |_| \_\_____|_|  |_|\___//_/\_(_)___\___/
*
**/


"use strict"



if (!process.argv[2] || !process.argv[3]) process.end()

const path = require('path');
const spawn = require('child_process').spawn;
const async = require('async');


const ffmpeg_bin="/usr/bin/ffmpeg"
const donor_video_path=process.argv[2];
const working_folder=process.argv[3];
const time_intervals = [

	{'start':'0:14:18.500','end':'0:14:22.500','index':0},
	{'start':'0:14:27.500','end':'0:14:32.500','index':1},
	{'start':'0:15:18.500','end':'0:15:21.500','index':2},
	{'start':'0:31:40.500','end':'0:31:46.500','index':3},
	{'start':'0:16:58.500','end':'0:17:03.500','index':4},
	{'start':'0:31:48.500','end':'0:31:53.500','index':5},
	{'start':'0:32:07.500','end':'0:32:13.500','index':6},
	{'start':'0:32:34.500','end':'0:32:38.500','index':7},
	{'start':'0:18:19.500','end':'0:18:23.500','index':8},
	{'start':'0:18:32.500','end':'0:18:36.500','index':9},
	{'start':'0:29:53.500','end':'0:29:58.500','index':10},
	{'start':'0:15:03.500','end':'0:15:08.500','index':11},
	{'start':'0:15:11.500','end':'0:15:16.500','index':12},
	{'start':'0:34:54.500','end':'0:35:00.500','index':13},
	{'start':'0:35:10.500','end':'0:35:14.500','index':14},
	{'start':'0:37:21.500','end':'0:37:26.500','index':15},
	{'start':'0:38:46.500','end':'0:38:51.500','index':16},
	{'start':'0:22:14.500','end':'0:22:24.500','index':17},
	{'start':'0:25:39.500','end':'0:25:46.500','index':18}

]

console.log('[#][remux.io] --','Start sliceing segments...')
async.eachSeries(time_intervals, function(segment, cb) {

	console.log('[#][remux.io] --', 'slicesing segment #'+segment.index+' start:in:['+segment.start+'] and ending:in:['+segment.end+']');

	var opts = [
		'-v', '1',
		'-ss', segment.start,
		'-i', donor_video_path,
		'-t',segment.end,
		'-c:v', 'copy',
		'-an',
		'-copyts',
	    '-bsf:v', 'h264_mp4toannexb',
		'-f', 'mpegts',
		'-y',path.join(working_folder, 'segment_'+segment.index+'.ts')
	]

	// console.log(opts);


	var ffmpeg_slice_command = spawn(ffmpeg_bin,opts)

	ffmpeg_slice_command.stdout.on('data', function(data){

	})

	//this will be the log std
	ffmpeg_slice_command.stderr.on('data', function(data){
		console.log(data);
	})

	ffmpeg_slice_command.on('close', function(code){
	    console.log('[#][remux.io] --', 'exiting with signal "' + code + '". If not 0 /zero/ it\'s not good :)');
		cb(null, true)
	})


}, function(err) {
	console.log('[#][remux.io] --','Start make compilation...')
})
