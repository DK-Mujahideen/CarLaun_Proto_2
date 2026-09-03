# Implementation Plan - CarLaun Evolution

Transform the CarLaun app into a multi-vendor marketplace (Swiggy-like) with a dedicated login flow and role-based access.

## Proposed Changes

### [Auth & Data Layer]

#### [MODIFY] [types.ts](file:///E:/SIH%202026/CarLaun-Proto/lib/types.ts)
- Add `User` interface with `id`, `name`, `email`, and `role`.
- Add `login` to the `View` type union.

#### [MODIFY] [data.ts](file:///E:/SIH%202026/CarLaun-Proto/lib/data.ts)
- Add `ADMIN_EMAILS` list to simulate role-based access control.

#### [MODIFY] [store.tsx](file:///E:/SIH%202026/CarLaun-Proto/lib/store.tsx)
- Add `user` state to `StoreProvider`.
- Implement `login` and `logout` functions.
- Update `navigate` logic to start at the `login` screen if no user is present.
- Export `user`, `login`, and `logout` through `useStore`.

### [UI Components]

#### [NEW] [login-screen.tsx](file:///E:/SIH%202026/CarLaun-Proto/components/screens/login-screen.tsx)
- Create a modern, purple-accented login page.
- Include fields for Name and Email.
- Add feedback for Admin users.

#### [MODIFY] [app-shell.tsx](file:///E:/SIH%202026/CarLaun-Proto/components/app-shell.tsx)
- Update navigation logic to show `LoginScreen` if the user is unauthenticated.
- Hide `Header`, `BottomNav`, and `BagBar` on the login screen for a clean entry experience.

### [Home Page Redesign]

#### [NEW] [marketplace.tsx](file:///E:/SIH%202026/CarLaun-Proto/components/home/marketplace.tsx)
- Create a Swiggy-like marketplace interface:
    - **Header**: Active location display and search bar.
    - **Categories**: Horizontal scrolling or grid of service icons (Laundry, Ironing, etc.).
    - **Promotions**: Carousel for current offers and discounts.
    - **Shop List**: Vertical list of nearby "Care Partners" with ratings, distance, and turnaround time.

#### [MODIFY] [home-screen.tsx](file:///E:/SIH%202026/CarLaun-Proto/components/screens/home-screen.tsx)
- Replace the landing-page style content with the new `Marketplace` component.

## Verification Plan

### Manual Verification
- Deploy to emulator.
- Verify the app starts on the **Login Screen**.
- Test normal user login -> Redirects to **Marketplace Home**.
- Test admin email login -> Redirects to **Admin Dashboard**.
- Verify the new **Home Page** layout follows the multi-vendor marketplace style (Swiggy-like).
- Verify the **Purple Accent** is consistent across new screens.
