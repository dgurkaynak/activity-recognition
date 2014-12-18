# Activity Recognition

This is my graduation project that can recognize predefined human poses and actions with Kinect. The whole project is built with just javascript and recent web technologies such as node.js, socket.io, WebGL (three.js), neural networks (brain.js).

![Image of Yaktocat](http://new.tinygrab.com/97d28b815591c338641c3fe78485fe375bea098a06.png)

The system is tracking 3 people.
[Watch the single person test video on youtube.](http://www.youtube.com/watch?v=iBflPzJa2Pc)

## Requirements
* Kinect
* Windows or OS X
* Good Web Browser
* NodeJS

## Installation
1. [Download](http://zigfu.com/en/downloads/browserplugin/) and install zigfu installer. If you are on windows and you have Kinect SDK installed, please just install browser plugin only.
2. `npm install` for installing dependencies.
3. `npm start` for starting server.
4. Plug in kinect and open `http://localhost:3000` in your browser.
5. Don't forget to open the console and play!

## Predefined Poses and Actions
The system has predefined 5 actions and 4 poses now, which can be seen below.

![Predefined poses and actions](http://new.tinygrab.com/97d28b815527d1cc2807f5c420da26fe171e520eb9.png)

Sure, you can add custom pose or custom data. Since there is no direct interface for adding activity, you have to dig viewer and recorder. 

Please don't hesitate to ask questions. Cheers!
