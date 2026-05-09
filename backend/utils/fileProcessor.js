const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

class FileProcessor {
  static async extractText(file) {
    const filePath = file.path;
    const mimeType = file.mimetype;

    try {
      if (mimeType.startsWith('image/')) {
        return await this.extractFromImage(filePath);
      } else if (mimeType === 'application/pdf') {
        return await this.extractFromPdf(filePath);
      } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword') {
        return await this.extractFromDocx(filePath);
      } else if (mimeType === 'text/plain') {
        return fs.readFileSync(filePath, 'utf8');
      } else {
        throw new Error('Unsupported file type: ' + mimeType);
      }
    } catch (error) {
      console.error('File extraction error:', error);
      throw error;
    } finally {
      // Clean up the temporary file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  static async extractFromImage(path) {
    const { data: { text } } = await Tesseract.recognize(path, 'eng+hin+tam');
    return text;
  }

  static async extractFromPdf(path) {
    const dataBuffer = fs.readFileSync(path);
    const pdfParse = typeof pdf === 'function' ? pdf : pdf.default;
    if (!pdfParse) throw new Error('PDF parser not found in module');
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  static async extractFromDocx(path) {
    const result = await mammoth.extractRawText({ path });
    return result.value;
  }
}

module.exports = FileProcessor;
