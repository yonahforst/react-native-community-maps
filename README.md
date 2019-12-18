# react-native-community-maps
Boilerplate app to geographically map user content, built on top of the awesome [Expo toolchain](https://docs.expo.io/versions/latest/)

![VI2LsXBn6f](https://user-images.githubusercontent.com/1440796/54887040-ce998180-4e8e-11e9-8dca-bf285fc52adc.gif)

Create your own app (in minutes!) to map interesting things around your neighborhood. Maybe it's your fav graffiti, or a really nice sofa that needs a new home. Other users are notified in real time and can comment on each post.

## Get started
1. Fork and clone this repo
2. Install package depenencies: run `npm i && cd functions && npm i && cd ..`
3. Use the `*.example.*` files to create you own versions of `app.json`, `firebase.json`, and `config/options.json`
4. Setup the backend:
    1. Visit the [firebase console](https://console.firebase.google.com) and create a new project, 
    2. Select Authentication and enable Email/Password and Anonymous signin methods
    3. Select Database and create a Firestore database
    4. Select Storage and click Get Started
    5. Install the [firebase cli](https://firebase.google.com/docs/cli/) 
    6. Run `firebase setup:web` and copy the printed config variables into `firebase.json` (don't overwrite existing rule paths)
    7. Run `firebase deploy`
5. Run `expo start`

## Options
`app.json` - this is your standard [expo config file](https://docs.expo.io/versions/latest/workflow/configuration/). You'll need to customize this before publishing.

`config/options.json` - Everything related to the look-and-feel of the app, and which features are enabled, comes from this file.

|name|default|description|
|----|-------|-----------|
|`defaultEmoji`|🍔|the default emoji for new items|
|`noEmojiPicker`|`false`|disallow users to pick their own emoji for new items|
|`newMsgPlaceholder`|['Say something...']|Array of placeholder strings to be chosen from at random|



#### Projects using react-native-community-maps
[Sofab](https://itunes.apple.com/us/app/sofab/id1455005485)
