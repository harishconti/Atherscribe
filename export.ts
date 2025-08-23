
import { jsPDF } from 'jspdf';
import type { GeneratedContent } from './types';

function sanitizeFilename(title: string): string {
    // Replace non-alphanumeric characters with underscores, limit length
    return title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
}

function downloadFile(filename: string, content: Blob) {
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Utility to convert basic HTML from TipTap to Markdown
function htmlToMarkdown(html: string): string {
    let md = html;
    md = md.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    md = md.replace(/<em>(.*?)<\/em>/g, '*$1*');
    md = md.replace(/<ul>/g, '').replace(/<\/ul>/g, '');
    md = md.replace(/<li>/g, '- ').replace(/<\/li>/g, '\n');
    md = md.replace(/<p>(.*?)<\/p>/g, '$1\n');
    // Remove any remaining HTML tags
    md = md.replace(/<[^>]*>/g, '');
    return md;
}


export function exportToMarkdown(content: GeneratedContent): void {
    if (content.imageUrl) {
        console.error("Cannot export visual content to Markdown.");
        return;
    }
    let markdownString = `# ${content.title}\n\n`;
    content.sections.forEach(section => {
        markdownString += `## ${section.heading}\n\n`;
        markdownString += `${htmlToMarkdown(section.content)}\n\n`;
    });

    const blob = new Blob([markdownString.trim()], { type: 'text/markdown;charset=utf-8' });
    downloadFile(`${sanitizeFilename(content.title)}.md`, blob);
}

function processHtmlForPdf(doc: jsPDF, html: string, startX: number, startY: number, usableWidth: number): number {
    let currentY = startY;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // A simple parser to handle p and ul/li tags for PDF
    Array.from(tempDiv.children).forEach(element => {
        if (element.tagName === 'P') {
            const text = element.textContent || '';
            const lines = doc.splitTextToSize(text, usableWidth);
            lines.forEach((line: string) => {
                 if (currentY > doc.internal.pageSize.height - 15) {
                    doc.addPage();
                    currentY = 15;
                }
                doc.text(line, startX, currentY);
                currentY += 5; // line height
            });
            currentY += 3; // paragraph spacing
        } else if (element.tagName === 'UL') {
            Array.from(element.children).forEach(liElement => {
                if (liElement.tagName === 'LI') {
                    const text = `• ${liElement.textContent || ''}`;
                    const lines = doc.splitTextToSize(text, usableWidth - 5); // Indent for bullet
                     if (currentY > doc.internal.pageSize.height - 15) {
                        doc.addPage();
                        currentY = 15;
                    }
                    doc.text(lines, startX + 5, currentY);
                    currentY += (lines.length * 5);
                }
            });
            currentY += 3; // list spacing
        }
    });

    return currentY;
}


export function exportToPdf(content: GeneratedContent): void {
     if (content.imageUrl) {
        console.error("Cannot export visual content to PDF.");
        return;
    }
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const usableWidth = pageWidth - margin * 2;
    let y = margin;

    const checkPageBreak = (heightNeeded: number) => {
        if (y + heightNeeded > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    const titleLines = doc.splitTextToSize(content.title, usableWidth);
    checkPageBreak(titleLines.length * 10);
    doc.text(titleLines, margin, y);
    y += (titleLines.length * 7) + 10;
    
    // Line separator
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    content.sections.forEach(section => {
        // Section Heading
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        const headingLines = doc.splitTextToSize(section.heading, usableWidth);
        checkPageBreak(headingLines.length * 7 + 5); // heading + space after
        doc.text(headingLines, margin, y);
        y += (headingLines.length * 6) + 5;

        // Section Content
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        y = processHtmlForPdf(doc, section.content, margin, y, usableWidth);
        
        y += 10; // Space between sections
    });

    doc.save(`${sanitizeFilename(content.title)}.pdf`);
}