pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Proto 2"
include(":app")
include(":android:app")
project(":android:app").projectDir = file("android/app")

val capacitorDir = file("node_modules/@capacitor/android/capacitor")
if (capacitorDir.exists()) {
    include(":capacitor-android")
    project(":capacitor-android").projectDir = capacitorDir
}

val capacitorAppDir = file("node_modules/@capacitor/app/android")
if (capacitorAppDir.exists()) {
    include(":capacitor-app")
    project(":capacitor-app").projectDir = capacitorAppDir
}

val capacitorSplashScreenDir = file("node_modules/@capacitor/splash-screen/android")
if (capacitorSplashScreenDir.exists()) {
    include(":capacitor-splash-screen")
    project(":capacitor-splash-screen").projectDir = capacitorSplashScreenDir
}

val capacitorStatusBarDir = file("node_modules/@capacitor/status-bar/android")
if (capacitorStatusBarDir.exists()) {
    include(":capacitor-status-bar")
    project(":capacitor-status-bar").projectDir = capacitorStatusBarDir
}

val cordovaPluginsDir = file("android/capacitor-cordova-android-plugins")
if (cordovaPluginsDir.exists()) {
    include(":capacitor-cordova-android-plugins")
    project(":capacitor-cordova-android-plugins").projectDir = cordovaPluginsDir
}

 