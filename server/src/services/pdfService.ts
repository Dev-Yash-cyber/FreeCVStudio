import puppeteer, { Browser } from 'puppeteer';
import { ResumeData, DesignSettings, CoverLetterData } from '../types/index.js';
import { generateResumeHtml, generateCoverLetterHtml } from './templateRenderer.js';

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
  }
  return browserInstance;
}

export async function generateResumePdf(
  data: ResumeData,
  design: DesignSettings
): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    const html = generateResumeHtml(data, design);

    await page.setContent(html, {
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000,
    });

    const isLetter = design.paperSize === 'Letter';
    const pdfBuffer = await page.pdf({
      format: isLetter ? 'Letter' : 'A4',
      printBackground: true,
      margin: {
        top: `${design.margins || 20}px`,
        bottom: `${design.margins || 20}px`,
        left: `${design.margins || 20}px`,
        right: `${design.margins || 20}px`,
      },
      preferCSSPageSize: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}

export async function generateCoverLetterPdf(
  data: CoverLetterData,
  design: any
): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    const html = generateCoverLetterHtml(data, design);

    await page.setContent(html, {
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000,
    });

    const isLetter = design.paperSize === 'Letter';
    const pdfBuffer = await page.pdf({
      format: isLetter ? 'Letter' : 'A4',
      printBackground: true,
      margin: {
        top: '25mm',
        bottom: '25mm',
        left: '25mm',
        right: '25mm',
      },
      preferCSSPageSize: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}
