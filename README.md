# react-native-community-maps
Boilerplate app to map (geographically) user uploaded photos.

#### Projects using react-native-community-maps
[Sofab](https://itunes.apple.com/us/app/sofab/id1455005485)

![NeNxRQwriK](https://user-images.githubusercontent.com/1440796/54877398-76c33200-4e1e-11e9-9ce7-05f2212aa5c3.gif)

### Get started
1. Fork and clone this repo
2. Install package depenencies: run `npm i && cd functions && npm i && cd ..`
3. Use the `.example.` files to create you own versions of `app.json`, `firebase.json`, and `config/options.json`
4. Setup the backend:
    1. Visit the [firebase console](https://console.firebase.google.com) and create a new project, 
    2. Select Authentication and enable Email/Password and Anonymous signin methods
    3. Select Database and create a Firestore database
    4. Select Storage and click Get Started
    5. Install the [firebase cli](https://firebase.google.com/docs/cli/) 
    6. Run `firebase setup:web` and copy the printed config variables into `firebase.json` (don't overwrite existing rule paths)
    7. Run `firebase deploy`
5. Run `expo start`

