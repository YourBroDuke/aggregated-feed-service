import { ICrawler } from '../crawlers/base/ICrawler.js';

export class CrawlerService {
  private crawlers: Map<string, ICrawler>;
  
  constructor() {
    this.crawlers = new Map();
  }
  
  registerCrawler(platform: string, crawler: ICrawler): void {
    this.crawlers.set(platform, crawler);
  }
  
  getCrawler(platform: string): ICrawler {
    const crawler = this.crawlers.get(platform);
    if (!crawler) {
      throw new Error(`No crawler registered for platform: ${platform}`);
    }
    return crawler;
  }
} 