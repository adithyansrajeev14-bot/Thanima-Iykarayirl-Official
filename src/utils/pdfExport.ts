import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportReceiptToPdf(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    return false;
  }

  try {
    // Hide buttons or elements with .no-pdf class during capture
    const hiddenElements = element.querySelectorAll<HTMLElement>('.no-pdf');
    hiddenElements.forEach(el => {
      el.style.display = 'none';
    });

    const canvas = await html2canvas(element, {
      scale: 2, // High resolution for crisp printing
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
    });

    // Restore hidden elements
    hiddenElements.forEach(el => {
      el.style.display = '';
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Leave a small 10mm margin
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    if (contentHeight > pdfHeight - margin * 2) {
      // If it exceeds one page, scale to fit one page nicely
      const scaledWidth = ((pdfHeight - margin * 2) * canvas.width) / canvas.height;
      const xOffset = (pdfWidth - scaledWidth) / 2;
      pdf.addImage(imgData, 'PNG', xOffset, margin, scaledWidth, pdfHeight - margin * 2);
    } else {
      pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}
