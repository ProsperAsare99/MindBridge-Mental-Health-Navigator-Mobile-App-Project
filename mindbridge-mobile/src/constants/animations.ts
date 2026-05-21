import { Easing } from 'react-native-reanimated';

// 1. Is this element entering or exiting? -> Use ease-out (entering)
export const easeOut = Easing.out(Easing.ease);

// 2. Is an on-screen element moving? -> Use ease-in-out
export const easeInOut = Easing.inOut(Easing.ease);

// 3. Is this a hover/color transition? -> Use ease
export const easeStandard = Easing.ease;

// 7. Is this an exit animation? -> Make it faster than the entrance (ease-in)
export const easeInFast = Easing.in(Easing.ease);

// 5. Is this a drag or interruptible gesture? -> Use a spring
export const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

// Durations
export const DURATIONS = {
  enter: 300,
  exit: 200, // Exits faster than entrances
  movement: 400,
  largeElement: 500, // Bigger size = longer duration
};
