import { PresentationConfig } from '../types/slides';
import { abrilFatface } from '../utils/fonts';

export const samplePresentation: PresentationConfig = {
  title: 'Folk Devils Presentation',
  slides: [
    {
      id: '1',
      type: 'cover',
      content: {
        eyebrow: '',
        header: '',
        body: 'Case Designs Round 01',
        textAlignment: 'center',
        verticalAlignment: 'center',
      },
    },
    {
      id: '2',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_01.png'
      },
    },
    {
      id: '3',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_02.png'
      },
    },
    {
      id: '4',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_03.png'
      },
    },
    {
      id: '5',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_04.png'
      },
    },
    {
      id: '6',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_05.png'
      },
    },
    {
      id: '7',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_06.png'
      },
    },
    {
      id: '8',
      type: 'cover',
      content: {
        header: 'Thank You.',
        body: '',
        textAlignment: 'center',
        verticalAlignment: 'center',
        customFont: abrilFatface.className,
        customTextColor: '#d8bb53'
      },
    },
  ],
}; 