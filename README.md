# BrandLens

BrandLens is a React + Vite project that stays live as a website and now also includes native iPhone and Android app shells through Capacitor.

## Website

Run the web app locally:

```bash
bash scripts/local-npm.sh install
bash scripts/local-npm.sh run dev
```

Then open the local URL shown in the terminal.

## Native App

Build the website and sync it into the mobile app projects:

```bash
bash scripts/local-npm.sh run app:sync
```

Open the iPhone project in Xcode:

```bash
bash scripts/local-npm.sh run app:open:ios
```

Open the Android project in Android Studio:

```bash
bash scripts/local-npm.sh run app:open:android
```

## Notes

- The website and app use the same codebase.
- The native app shells live in `ios/` and `android/`.
- Public web hosting and native app store publishing are separate steps.
