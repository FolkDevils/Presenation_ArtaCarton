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
        body: 'Case Designs',
        textAlignment: 'center',
        verticalAlignment: 'center',
      },
    },
    {
      id: 'selected',
      type: 'text-only',
      content: {
        header: 'Selected',
        textAlignment: 'center',
        verticalAlignment: 'center',
        customFont: abrilFatface.className,
        customTextColor: '#dcb758'
      },
    },
    {
      id: 'new 01',
      type: 'model',
      content: {
        header: '',
        texturePath: '/cartoneDesigns_final.png'
      },
    },
    {
      id: 'round-two',
      type: 'text-only',
      content: {
        header: 'Round two',
        textAlignment: 'center',
        verticalAlignment: 'center',
        customFont: abrilFatface.className,
        customTextColor: '#dcb758'
      },
    },
    {
      id: 'new 01',
      type: 'model',
      content: {
        header: '',
        texturePath: '/cartoneDesigns_new01.png'
      },
    },
    {
      id: 'new 02',
      type: 'model',
      content: {
        header: '',
        texturePath: '/cartoneDesigns_new02.png'
      },
    },
    {
      id: 'new 03',
      type: 'model',
      content: {
        header: '',
        texturePath: '/cartoneDesigns_new03.png'
      },
    },
    {
      id: 'new 04',
      type: 'model',
      content: {
        header: '',
        texturePath: '/cartoneDesigns_new04.png'
      },
    },
    {
      id: 'new 05',
      type: 'model',
      content: {
        header: '',
        texturePath: '/cartoneDesigns_new05.png'
      },
    },
    {
      id: 'new 06',
      type: 'model',
      content: {
        header: '',
        texturePath: '/cartoneDesigns_new06.png'
      },
    },
    {
      id: 'new 07',
      type: 'model',
      content: {
        header: '',
        texturePath: '/cartoneDesigns_new07.png'
      },
    },
    {
      id: 'new 08',
      type: 'model',
      content: {
        header: '',
        texturePath: '/cartoneDesigns_new08.png'
      },
    },
    {
      id: 'archive',
      type: 'text-only',
      content: {
        header: 'Archive',
        textAlignment: 'center',
        verticalAlignment: 'center',
        customFont: abrilFatface.className,
        customTextColor: '#dcb758'
      },
    },
    {
      id: '2',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_origional.png'
      },
    },
    {
      id: '3',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_01.png'
      },
    },
    {
      id: '4',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_02.png'
      },
    },
    {
      id: '5',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_03.png'
      },
    },
    {
      id: '6',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_04.png'
      },
    },
    {
      id: '7',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_05.png'
      },
    },
    {
      id: '8',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_06.png'
      },
    },
    {
      id: '9',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_07.png'
      },
    },
    {
      id: '10',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_08.png'
      },
    },
    {
      id: '11',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_09.png'
      },
    },
    {
      id: '12',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_10.png'
      },
    },
    {
      id: '13',
      type: 'model',
      content: {
        header: '',
        texturePath: '/caseTexture_11.png'
      },
    },
    {
      id: '14',
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