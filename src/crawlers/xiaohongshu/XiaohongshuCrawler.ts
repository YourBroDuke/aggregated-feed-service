import axios from 'axios';
import { ICrawler, UserProfile, Post } from '../base/ICrawler';
import { parse } from 'url';
import { generateRequestParams } from './utils';

export class XiaohongshuCrawler implements ICrawler {
  private baseUrl = 'https://edith.xiaohongshu.com';
  private cookies: string;

  constructor(cookies: string) {
    this.cookies = cookies;
  }

  private async makeRequest(api: string, method: 'GET' | 'POST' = 'GET', data?: any) {
    try {
      const { headers, cookies, data: processedData } = generateRequestParams(this.cookies, api, data);
      
      // Add cookies to headers
      headers['Cookie'] = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');

      const config = {
        headers,
        timeout: 10000, // 10 second timeout
      };

      const response = method === 'GET' 
        ? await axios.get(`${this.baseUrl}${api}`, config)
        : await axios.post(`${this.baseUrl}${api}`, processedData, config);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Request failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else {
        console.error('Request failed:', error);
      }
      throw error;
    }
  }

  private extractUserId(profileUrl: string): string {
    const parsedUrl = parse(profileUrl, true);
    const pathParts = parsedUrl.pathname?.split('/') || [];
    return pathParts[pathParts.length - 1].split('?')[0];
  }

  async fetchUserProfile(profileUrl: string): Promise<UserProfile> {
    const userId = this.extractUserId(profileUrl);
    const api = `/api/sns/web/v1/user/otherinfo?target_user_id=${userId}`;
    
    try {
      const response = await this.makeRequest(api);
      if (!response.success) {
        throw new Error(response.msg || 'Failed to fetch user profile');
      }

      const userData = response.data;
      return {
        name: userData.nickname || '',
        username: userData.red_id || '',
        avatar: userData.avatar || '',
      };
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  async fetchLatestPosts(profileUrl: string, cursor: string): Promise<{ posts: Post[], cursor: string }> {
    const userId = this.extractUserId(profileUrl);
    const posts: Post[] = [];
    let hasMore = true;

    while (hasMore) {
      try {
        const api = `/api/sns/web/v1/user_posted?num=30&cursor=&user_id=${userId}&image_formats=jpg,webp,avif`;
        const response = await this.makeRequest(api);
        
        if (!response.success) {
          throw new Error(response.msg || 'Failed to fetch posts');
        }

        const notes = response.data.notes || [];
        for (const note of notes) {
          const postDate = new Date(note.time * 1000);
          posts.push({
            businessId: `xhs-${note.id}`,
            title: note.title || '',
            content: note.desc || '',
            originalUrl: `https://www.xiaohongshu.com/explore/${note.id}`,
            postedAt: postDate,
          });
        }

        if (!response.data.has_more || !response.data.cursor) {
          hasMore = false;
        } else {
          cursor = response.data.cursor;
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        throw error;
      }
    }

    return { posts, cursor };
  }
} 