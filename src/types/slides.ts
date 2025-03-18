export type TextAlignment = 'left' | 'center' | 'right';
export type VerticalAlignment = 'top' | 'center' | 'bottom';

export type ColorConfig = {
  word: string;
  color: string;
};

export type SlideContent = {
  header: string;
  eyebrow?: string;
  body?: string;
  supportingText?: string;
  textAlignment?: TextAlignment;
  verticalAlignment?: VerticalAlignment;
  colorConfig?: ColorConfig[];
  texturePath?: string;
  customFont?: string;
  customTextColor?: string;
};

export type ImageContent = {
  src: string;
  alt: string;
};

export type SlideType = 
  | 'cover'
  | 'cover-2'
  | 'text-only'
  | 'text-image-right'
  | 'text-image-left'
  | 'two-column-text'
  | 'model'
  | 'custom';

export type Slide = {
  id: string;
  type: SlideType;
  content: SlideContent;
  image?: ImageContent;
  customComponent?: string;
};

export type PresentationConfig = {
  title: string;
  slides: Slide[];
}; 