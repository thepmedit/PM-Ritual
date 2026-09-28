# The PM Ritual

The companion app for The PM Edit. Built with Expo (React Native) for iPhone and Android.

## What's inside

- **Onboarding:** name, ritual time, bedtime reminder permission, Edition 01 code redemption.
- **Tonight:** nightly quote, nights kept, the ritual, this month's ritual, week of rest, morning check-in, milestone cards, refill prompt, journal.
- **The ritual:** pulse point oil, pillow spray, silk pillowcase, three moments (PM Guide first, phone optional), slow breath (4 in, 6 out, five rounds), silk eye mask.
- **Rest:** guided wind-downs of 5 or 10 minutes. On-screen guidance works now; add recorded audio later (see below).
- **Sounds:** rain, deep hush, ocean, night hum, with volume and a fade-out timer. They play with the screen locked.
- **Me:** name, ritual time, reminders, candlelight mode (manual or automatic), milestones, restore purchases, privacy, erase data.
- **Membership:** RevenueCat subscriptions (monthly and yearly with a free trial) and Apple Offer Codes for Edition 01 boxes.
- **Goodnight** screen after the ritual or a finished session.

All the words (quotes, steps, meditation scripts, milestones, reminders) are in `src/content.ts`.

## Settings to fill in (`app.json` → `extra`)

| Setting | What it is |
| --- | --- |
| `revenueCatIosKey` | RevenueCat's public iOS API key (starts with `appl_`). Leave empty until payments are set up; members-only content stays locked. |
| `revenueCatAndroidKey` | RevenueCat's public Android key (starts with `goog_`). |
| `entitlementId` | The RevenueCat entitlement name. Default `member`. |
| `contentUrl` | Optional. A link to a `content.json` file (for example uploaded to Shopify → Content → Files). Lets you add quotes and a new monthly ritual without an app update. See `content.example.json`. |
| `privacyUrl` | Your privacy policy page. |
| `termsUrl` | Terms of use. Apple's standard licence is used by default. |
| `shopUrl` | Where "Reorder refills" goes. |

## Adding recorded meditations

Upload each MP3 somewhere public (Shopify → Content → Files works), then add `audio5` and `audio10` links to that session in `content.json`. When a recording is present, the app plays it with a quiet tone underneath instead of showing the on-screen guidance.

## Replacing the sleep sounds

The four sounds in `assets/sounds` are placeholder recordings made for this app. Replace them with licensed recordings of the same names (`rain.m4a`, `hush.m4a`, `ocean.m4a`, `hum.m4a`). Loops of 1–10 minutes work best.

## Replacing the app icon

Replace `assets/icon.png` (1024 × 1024, no transparency), `assets/adaptive-icon.png` and `assets/splash-icon.png` with your monogram.

## Building (no Mac needed)

1. Create a free account at expo.dev.
2. Connect this GitHub repository to a new Expo project.
3. Start an iOS build with the **production** profile. Expo asks for your Apple Developer login and handles certificates.
4. Submit the build to App Store Connect from Expo, then send it to TestFlight.

If a build fails, copy the error from the build log. Most first-build errors are package version mismatches, fixed by running `npx expo install --fix`.

## App Store setup checklist

- Bundle ID: `au.com.thepmedit.ritual` (change in `app.json` before the first build if you prefer another).
- Subscription group "Membership": monthly and yearly products, 7-day free trial on yearly.
- RevenueCat: add both products, create entitlement `member`, put both in the current offering as Monthly and Annual packages.
- Offer Codes: one-time codes giving 12 months free on the yearly product, one per Edition 01 card.
- Privacy questions: the app stores name, ritual time, journal and check-ins on the device only. Purchases are handled by Apple and RevenueCat.
