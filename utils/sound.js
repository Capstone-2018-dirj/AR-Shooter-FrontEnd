import Expo from 'expo';

const SOUNDS = {};

let SOURCES = {};

export async function prepareSound() {
  await Expo.Audio.setIsEnabledAsync(true);
  await Expo.Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    allowsRecordingIOS: false,
    interruptionModeIOS: Expo.Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    shouldDuckAndroid: false,
    interruptionModeAndroid: Expo.Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  });
}

export function loadSounds(sources) {
  SOURCES = {...SOURCES, ...sources};
}

export async function playSound(key) {
  if (SOUNDS[key]) {
    await SOUNDS[key].unloadAsync();
  } else {
    SOUNDS[key] = new Expo.Audio.Sound();
  }

  await SOUNDS[key].loadAsync(SOURCES[key]);
  SOUNDS[key].playAsync();
}
