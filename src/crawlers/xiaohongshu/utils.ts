import { parse } from 'url';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Load the JavaScript files from local directory
const xhsXsXscPath = path.resolve(__dirname, './xhs_xs_xsc_56.js');
const xhsXrayPath = path.resolve(__dirname, './xhs_xray.js');

let xhsXsXscJs: string;
let xhsXrayJs: string;

try {
  xhsXsXscJs = fs.readFileSync(xhsXsXscPath, 'utf-8');
  xhsXrayJs = fs.readFileSync(xhsXrayPath, 'utf-8');
} catch (error) {
  console.error('Failed to load JavaScript files:', error);
  throw error;
}

export function generateXb3TraceId(length: number = 16): string {
  const chars = 'abcdef0123456789';
  let traceId = '';
  for (let i = 0; i < length; i++) {
    traceId += chars[Math.floor(Math.random() * 16)];
  }
  return traceId;
}

export function generateXrayTraceId(): string {
  try {
    // Execute the xray.js code using Node.js
    const result = execSync(`node -e "${xhsXrayJs}; console.log(traceId());"`).toString().trim();
    return result;
  } catch (error) {
    console.error('Failed to generate xray trace ID:', error);
    // Fallback to a simple implementation
    return `xray-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}

export function getRequestHeadersTemplate(): Record<string, string> {
  return {
    'authority': 'edith.xiaohongshu.com',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    'content-type': 'application/json;charset=UTF-8',
    'origin': 'https://www.xiaohongshu.com',
    'pragma': 'no-cache',
    'referer': 'https://www.xiaohongshu.com/',
    'sec-ch-ua': '"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
    'x-b3-traceid': '',
    'x-mns': 'unload',
    'x-s': '',
    'x-s-common': '',
    'x-t': '',
    'x-xray-traceid': ''
  };
}

export function parseCookies(cookieStr: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieStr.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      cookies[key] = value;
    }
  });
  return cookies;
}

export function generateXsXsCommon(a1: string, api: string, data: string = ''): { xs: string; xt: string; xs_common: string } {
  try {
    // Execute the xhs_xs_xsc_56.js code using Node.js
    const script = `
      ${xhsXsXscJs}
      const result = get_request_headers_params('${api}', '${data}', '${a1}');
      console.log(JSON.stringify(result));
    `;
    const result = JSON.parse(execSync(`node -e "${script}"`).toString().trim());
    return {
      xs: result.xs,
      xt: result.xt,
      xs_common: result.xs_common
    };
  } catch (error) {
    console.error('Failed to generate X-s, X-t, and X-s-common:', error);
    throw error;
  }
}

export function generateRequestParams(cookies: string, api: string, data: any = ''): {
  headers: Record<string, string>;
  cookies: Record<string, string>;
  data: string;
} {
  const parsedCookies = parseCookies(cookies);
  const a1 = parsedCookies['a1'] || '';
  
  // Generate headers
  const headers = getRequestHeadersTemplate();
  headers['x-b3-traceid'] = generateXb3TraceId();
  headers['x-xray-traceid'] = generateXrayTraceId();
  
  // Generate X-s, X-t, and X-s-common using the actual JavaScript implementation
  const { xs, xt, xs_common } = generateXsXsCommon(a1, api, typeof data === 'object' ? JSON.stringify(data) : data);
  headers['x-s'] = xs;
  headers['x-t'] = xt;
  headers['x-s-common'] = xs_common;
  
  // Convert data to JSON string if it's an object, similar to Python's json.dumps
  const processedData = typeof data === 'object' ? JSON.stringify(data, null, 0) : data;
  
  return { headers, cookies: parsedCookies, data: processedData };
} 