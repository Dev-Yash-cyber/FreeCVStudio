import React from 'react';
import { CustomizeTab } from './CustomizeSidebar.js';
import { CustomizeDocument } from './CustomizeDocument.js';
import { CustomizeTemplates } from './CustomizeTemplates.js';
import { CustomizeLayout } from './CustomizeLayout.js';
import { CustomizeFontSize } from './CustomizeFontSize.js';
import { CustomizeSpacing } from './CustomizeSpacing.js';
import { CustomizeEntries } from './CustomizeEntries.js';
import { CustomizeHeadings } from './CustomizeHeadings.js';
import { CustomizeFont } from './CustomizeFont.js';
import { CustomizeColors } from './CustomizeColors.js';
import { CustomizeHeader } from './CustomizeHeader.js';
import { CustomizePhoto } from './CustomizePhoto.js';
import { CustomizeLinks } from './CustomizeLinks.js';
import { CustomizeFooter } from './CustomizeFooter.js';
import { CustomizeSections } from './CustomizeSections.js';

interface CustomizePanelProps {
  activeTab: CustomizeTab;
}

export const CustomizePanel: React.FC<CustomizePanelProps> = ({ activeTab }) => {
  switch (activeTab) {
    case 'templates':
      return <CustomizeTemplates />;
    case 'layout':
      return <CustomizeLayout />;
    case 'fontSize':
      return <CustomizeFontSize />;
    case 'spacing':
      return <CustomizeSpacing />;
    case 'entries':
      return <CustomizeEntries />;
    case 'headings':
      return <CustomizeHeadings />;
    case 'font':
      return <CustomizeFont />;
    case 'colors':
      return <CustomizeColors />;
    case 'header':
      return <CustomizeHeader />;
    case 'photo':
      return <CustomizePhoto />;
    case 'links':
      return <CustomizeLinks />;
    case 'footer':
      return <CustomizeFooter />;
    case 'sections':
      return <CustomizeSections />;
    case 'document':
    default:
      return <CustomizeDocument />;
  }
};
