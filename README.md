# Space Cowboy


## AR Laser Tag

Player 1  (Iphone X)           |  Player 2 (Iphone 6s)
:-------------------------:|:-------------------------:
<img src="https://github.com/Space-Cowboy-2018/proof-of-concept/blob/master/public/preview4.gif" width="150">  |  <img src="https://github.com/Space-Cowboy-2018/proof-of-concept/blob/master/public/preview5.gif" width="150">

### Gameplay Mechanics
Space Cowboy is designed to be an Augmented Reality mutliply player laser-tag. Players can create seperate rooms and begin a game when all players are ready. During the game play phase each player starts with 100 HP. Everytime you tag your opponent they lose 10HP, when you health goes to 0 you lose. You can obtain more health by grabbing an in game heart. When all your opponents are out you win.

### Architecture

<img src="https://github.com/Space-Cowboy-2018/proof-of-concept/blob/master/public/Space%20Cowboy%20Tech%20Stack%20(1).png" width="300"> 

Space Cowboy
Frontend : [React-Native](https://facebook.github.io/react-native/),[ Socket.io](https://socket.io/), [Three.js](https://threejs.org/), [Expo-AR](https://expo.io/)

Backend : [Node.js](https://nodejs.org/en/), [Socket.io](https://socket.io/), [Redux](https://redux.js.org/), [Express.js](https://expressjs.com/)

Testing : [Mocha](https://mochajs.org/)

### How to Play


-Create Name

-Create Room

-Start Game by lining up all the phones together to sync location

-Go pew pew!!!

-Grab the heart to get more HP!

-Be the last one standing

### How to Install

1. Download EXPO for iOS https://itunes.apple.com/us/app/expo-client/id982107779?mt=8

2. Clone the github FrontEnd Repo at https://github.com/Space-Cowboy-2018/AR-Shooter-FrontEnd.git

3. ```npm install``` all dependencies.

4. In Expo XDE open existing project and select the directory you cloned the repo at.

5. Click share and scan the QR code using the Iphone's camera.

6. Enjoy!

### ETC

- see list of rooms. https://ar-shooter-server.herokuapp.com/rooms

