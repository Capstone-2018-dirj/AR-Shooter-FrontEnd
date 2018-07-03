import Expo from 'expo';

const SOUNDS = {};

let SOURCES = {};

export async function prepareSound() {
  await Expo.Audio.setIsEnabledAsync(true);
  console.log('Set Expo.Audio enabled');
  await Expo.Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    allowsRecordingIOS: false,
    interruptionModeIOS: Expo.Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    shouldDuckAndroid: false,
    interruptionModeAndroid: Expo.Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  });
  console.log('Set Expo.Audio mode');
}

export function loadSounds(sources) {
  SOURCES = {...SOURCES, ...sources};
}

export async function playSound(key) {
  if (SOUNDS[key]) {
    console.log("That sound has already been played, let's reload.");
    await SOUNDS[key].unloadAsync();
    console.log('Sound unloaded successfully!');
  } else {
    console.log('New sound to play!');
    SOUNDS[key] = new Expo.Audio.Sound();
  }
  
  await SOUNDS[key].loadAsync(SOURCES[key]);
  console.log('Sound loaded successfully!');
  SOUNDS[key].playAsync();
  console.log('Playing...');
}
