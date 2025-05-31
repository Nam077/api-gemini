import { injectable } from 'inversify';
import { ILogger } from '../types/interfaces';

@injectable()
export class Logger implements ILogger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: string, message: string): string {
    return `[${this.getTimestamp()}] [${level.toUpperCase()}] ${message}`;
  }

  public info(message: string, meta?: any): void {
    console.log(this.formatMessage('info', message));
    if (meta) {
      console.log('Meta:', JSON.stringify(meta, null, 2));
    }
  }

  public error(message: string, error?: Error): void {
    console.error(this.formatMessage('error', message));
    if (error) {
      console.error('Stack:', error.stack);
    }
  }

  public warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message));
    if (meta) {
      console.warn('Meta:', JSON.stringify(meta, null, 2));
    }
  }

  public debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message));
      if (meta) {
        console.debug('Meta:', JSON.stringify(meta, null, 2));
      }
    }
  }
}

// Utility function để convert JSON thành text format với dấu -
export class ScriptFormatter {
  static formatToText(jsonData: any): string {
    let textResult = '';
    
    // Video Info
    if (jsonData.videoInfo) {
      textResult += '🎬 THÔNG TIN VIDEO\n';
      textResult += `- Tiêu đề: ${jsonData.videoInfo.title || 'N/A'}\n`;
      textResult += `- Thời lượng: ${jsonData.videoInfo.totalDuration || 'N/A'}\n`;
      textResult += `- Thể loại: ${jsonData.videoInfo.genre || 'N/A'}\n`;
      textResult += `- Tone: ${jsonData.videoInfo.tone || 'N/A'}\n`;
      textResult += `- Mục tiêu: ${jsonData.videoInfo.objective || 'N/A'}\n\n`;
    }

    // Topic Analysis
    if (jsonData.topicAnalysis || jsonData.analysis) {
      const analysis = jsonData.topicAnalysis || jsonData.analysis;
      textResult += '📋 PHÂN TÍCH CHỦ ĐỀ\n';
      textResult += `- Tóm tắt: ${analysis.summary || 'N/A'}\n`;
      if (analysis.keyPoints && Array.isArray(analysis.keyPoints)) {
        textResult += '- Điểm chính:\n';
        analysis.keyPoints.forEach((point: string, index: number) => {
          textResult += `  ${index + 1}. ${point}\n`;
        });
      }
      textResult += '\n';
    }

    // Characters
    if (jsonData.characters && Array.isArray(jsonData.characters)) {
      textResult += '👥 NHÂN VẬT\n';
      jsonData.characters.forEach((char: any, index: number) => {
        textResult += `- Nhân vật ${index + 1}: ${char.name || 'N/A'}\n`;
        textResult += `  • Tuổi: ${char.age || 'N/A'}\n`;
        textResult += `  • Tính cách: ${Array.isArray(char.personality) ? char.personality.join(', ') : char.personality || 'N/A'}\n`;
        textResult += `  • Vai trò: ${char.role || 'N/A'}\n`;
        textResult += `  • Ngoại hình: ${char.appearance || 'N/A'}\n`;
        textResult += `  • Cách nói: ${char.speakingStyle || 'N/A'}\n`;
        if (char.costume) textResult += `  • Trang phục: ${char.costume}\n`;
        if (char.actingNotes) textResult += `  • Hướng dẫn diễn: ${char.actingNotes}\n`;
        textResult += '\n';
      });
    }

    // Scenes
    if (jsonData.scenes && Array.isArray(jsonData.scenes)) {
      textResult += '🎭 KỊCH BẢN TỪNG SCENE\n';
      jsonData.scenes.forEach((scene: any) => {
        textResult += `- Scene ${scene.sceneNumber || 'N/A'}: ${scene.title || 'Untitled'}\n`;
        textResult += `  • Địa điểm: ${scene.setting || scene.location || 'N/A'}\n`;
        if (scene.cameraSetup) textResult += `  • Camera: ${scene.cameraSetup}\n`;
        if (scene.lighting) textResult += `  • Ánh sáng: ${scene.lighting}\n`;
        if (scene.props && Array.isArray(scene.props)) {
          textResult += `  • Đạo cụ: ${scene.props.join(', ')}\n`;
        }
        textResult += `  • Thời lượng: ${scene.estimatedDuration || 'N/A'}\n`;
        
        // Dialogue
        if (scene.dialogue && Array.isArray(scene.dialogue)) {
          textResult += '  • Hội thoại:\n';
          scene.dialogue.forEach((line: any, index: number) => {
            textResult += `    ${index + 1}. ${line.character || 'Unknown'}: "${line.text || 'N/A'}"\n`;
            if (line.emotion) textResult += `       [Cảm xúc: ${line.emotion}]\n`;
            if (line.action) textResult += `       [Hành động: ${line.action}]\n`;
            if (line.actingDirection) textResult += `       [Diễn xuất: ${line.actingDirection}]\n`;
          });
        }
        
        if (scene.soundEffects) textResult += `  • Âm thanh: ${scene.soundEffects}\n`;
        if (scene.backgroundMusic) textResult += `  • Nhạc nền: ${scene.backgroundMusic}\n`;
        if (scene.notes) textResult += `  • Ghi chú: ${scene.notes}\n`;
        textResult += '\n';
      });
    }

    // Production
    if (jsonData.production) {
      textResult += '🎥 SẢN XUẤT\n';
      if (jsonData.production.equipment && Array.isArray(jsonData.production.equipment)) {
        textResult += `- Thiết bị: ${jsonData.production.equipment.join(', ')}\n`;
      }
      textResult += `- Thời gian quay: ${jsonData.production.estimatedFilmingTime || 'N/A'}\n`;
      textResult += `- Ngân sách: ${jsonData.production.budget || 'N/A'}\n`;
      if (jsonData.production.specialNotes && Array.isArray(jsonData.production.specialNotes)) {
        textResult += '- Lưu ý đặc biệt:\n';
        jsonData.production.specialNotes.forEach((note: string, index: number) => {
          textResult += `  ${index + 1}. ${note}\n`;
        });
      }
    }

    return textResult.trim();
  }
}