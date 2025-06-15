import axios from 'axios';
import { ICrawler, UserProfile, Post } from '../base/ICrawler.js';
import { parse } from 'url';
import { generateRequestParams } from './sign.js';

export class XiaohongshuCrawler implements ICrawler {
  private baseUrl = 'https://edith.xiaohongshu.com';
  private cookies: string;

  constructor(cookies: string) {
    this.cookies = cookies;
  }

  private async makeRequest(api: string, method: 'GET' | 'POST' = 'GET', data?: any) {
    try {
      const { headers, cookies, data: processedData } = await generateRequestParams(this.cookies, api, data);
      
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
    const pathParts = (parsedUrl.pathname?.split('/') || []).filter(Boolean);
    if (pathParts.length === 0) return '';
    const last = pathParts[pathParts.length - 1];
    return last === 'profile' ? '' : last.split('?')[0];
  }

  async fetchUserProfile(profileUrl: string): Promise<UserProfile> {
    const userId = this.extractUserId(profileUrl);
    const api = `/api/sns/web/v1/user/otherinfo?target_user_id=${userId}`;
    
    try {
      const response = await this.makeRequest(api);
      if (!response.success) {
        throw new Error(response.msg || 'Failed to fetch user profile');
      }

      const userData = response.data.basic_info;
      return {
        name: userData.nickname || undefined,
        username: userData.red_id || undefined,
        avatar: userData.images || undefined,
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
    let start_cursor = "";

    while (hasMore) {
      try {
        const api = `/api/sns/web/v1/user_posted?num=30&cursor=${start_cursor}&user_id=${userId}&image_formats=jpg,webp,avif`;
        const response = await this.makeRequest(api);
        
        if (!response.success) {
          throw new Error(response.msg || 'Failed to fetch posts');
        }

        const notes = response.data.notes || [];
        for (const note of notes) {
          if (note.note_id == cursor) {
            hasMore = false;
            break;
          }

          // there is no time in the note, so we need to mock the date by now
          const postDate = new Date();
          posts.push({
            businessId: `xhs-${note.note_id}`,
            title: note.display_title || '',
            content: '',
            originalUrl: `https://www.xiaohongshu.com/explore/${note.note_id}`,
            postedAt: postDate,
          });
        }

        // if the cursor is empty, it means we only fetch the first page
        if (cursor == "")
        {
          break;
        }

        start_cursor = response.data.cursor;
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        throw error;
      }
    }

    return { posts, cursor };
  }
} 