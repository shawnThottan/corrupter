# corrupter
modifies video files using math wave functions.

# How to run:
  * Set up jjmpeg. Set the right environment variables.
  * run npm install from the root folder.
  * copy an mp4 video file to {root-folder}/videos
  * modify the code variable filename to the video title without the extension
  * npm start
  * output will be in the public folder.

# To Be Noted
  * Reduce the variable frameCount or use shorter and lower res videos to get output faster.
  * Uses sin function by default. Can be changed to whatever function you require in code.
  * Uses 50 frames in front to create the effect can be tweaked using the tbMixedFrames variable.
