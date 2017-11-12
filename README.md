### Play with draft-js

This is one of my school project 's feature. You can read my [adventure](https://namkolo.github.io/posts/challenge-with-draftjs-part-1/) here.


### Demo
 ![demo](./screenshot/demo.gif)

### Features
- [x] Display sidebar  
- [x] Display toolbar when select text
- [x] Support Bold, Italic
- [x] Highlight feature
- [x] Add/Remove image
- [x] Focus image.
- [ ] Support markdown
- [ ] Support drag & drop image

### Go ahead !
#### Environment
- Node 6+
- yarn 1+
#### Install
```
 yarn install
 cd server
 yarn install
```

#### How to use
At the root directory of repository, run below command
```
 npm run start
```
It will open a browser `localhost:3000`.
Then open another tab and run below commands
```
  cd server
  npm run server
```
It will start a simple backend server which handles image uploading / serving + store editor data in memory. Check it at `localhost:4000`.
