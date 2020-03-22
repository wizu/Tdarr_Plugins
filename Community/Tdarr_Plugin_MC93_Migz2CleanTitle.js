function details() {
  return {
    id: "Tdarr_Plugin_MC93_Migz2CleanTitle",
    Stage: "Pre-processing",
    Name: "Migz-Clean title metadata",
    Type: "Video",
	Operation: "Clean",
    Description: `This plugin removes title metadata from video/audio/subtitles, if it exists. \n\n`,
    Version: "1.10",
    Link: "https://github.com/HaveAGitGat/Tdarr_Plugins/blob/master/Community/Tdarr_Plugin_MC93_Migz2CleanTitle.js",
    Tags:'pre-processing,ffmpeg',
  }
}

function plugin(file) {
  var response = {
     processFile : false,
     preset : '',
     container: '.' + file.container,
     handBrakeMode : false,
     FFmpegMode : true,
     reQueueAfter : false,
     infoLog : '',

  }
  
  var ffmpegCommandInsert = ''
  var videoIdx = 0
  var audioIdx = 0
  var subtitleIdx = 0
  var convert = false

  if (file.fileMedium !== "video") {
    console.log("File is not video")
    response.infoLog += "☒File is not video \n"
    response.processFile = false;
    return response
  }
  
  try {
    if (typeof file.meta.Title != 'undefined' ){
	    ffmpegCommandInsert += ` -metadata title="" `
		response.infoLog += "1"
	    convert = true
    }
  } catch (err) { }
  
  for (var i = 0; i < file.ffProbeData.streams.length; i++) {
        if (file.ffProbeData.streams[i].codec_type.toLowerCase() == "video") {
		    try {
		         if (typeof file.ffProbeData.streams[i].tags.title != 'undefined') {
			     ffmpegCommandInsert += ` -metadata:s:v:${videoIdx} title="" `
	  	         convert = true
                }
			} catch (err) { }
     		videoIdx++
		}
		        if (file.ffProbeData.streams[i].codec_type.toLowerCase() == "audio") {
		    try {
		         if (typeof file.ffProbeData.streams[i].tags.title != 'undefined') {
			     ffmpegCommandInsert += ` -metadata:s:a:${audioIdx} title="" `
	  	         convert = true
                }
			} catch (err) { }
     		audioIdx++
		}
		        if (file.ffProbeData.streams[i].codec_type.toLowerCase() == "subtitle") {
		    try {
		         if (typeof file.ffProbeData.streams[i].tags.title != 'undefined') {
			     ffmpegCommandInsert += ` -metadata:s:s:${subtitleIdx} title="" `
	  	         convert = true
                }
			} catch (err) { }
     		subtitleIdx++
		}
    }
  
   if (convert == true){
    response.infoLog += "☒File has title metadata \n"
    response.preset = `,${ffmpegCommandInsert} -c copy`
    response.reQueueAfter = true;
    response.processFile = true;
    } else {
    response.infoLog += "☑File has no title metadata \n"
    }
    return response
}

module.exports.details = details;
module.exports.plugin = plugin;