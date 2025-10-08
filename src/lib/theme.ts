export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

export const getThemeClass = (theme: string): string => {
  switch (theme) {
    case LIGHT_THEME:
      return 'theme-light';
    case DARK_THEME:
      return 'theme-dark';
    default:
      return '';
  }
};

// Example of reusable tokens (can be expanded as needed)
export const TRANSITION_DURATION = 'duration-300';
export const TRANSITION_EASING = 'ease-in-out';
