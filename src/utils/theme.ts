import { barlow } from './fonts';

export type ThemeConfig = {
  colors: {
    gradient: {
      from: string;
      to: string;
      direction: string;
    };
    primary: string;
    secondary: string;
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    container: string;
    gap: string;
  };
};

export const defaultTheme: ThemeConfig = {
  colors: {
    gradient: {
      from: '#000000',
      to: '#000000',
      direction: 'to-br'
    },
    primary: '#000000',
    secondary: '#000000',
    text: {
      primary: '#ffffff',
      secondary: '#dcb758',
      accent: '#dcb758'
    },
    background: '#000000'
  },
  fonts: {
    heading: barlow.className,
    body: barlow.className
  },
  spacing: {
    container: 'max-w-7xl',
    gap: 'gap-8 md:gap-16'
  }
};

export const getGradientStyle = () => {
  return {
    background: `linear-gradient(to bottom right, ${defaultTheme.colors.gradient.from}, ${defaultTheme.colors.gradient.to})`
  };
}; 