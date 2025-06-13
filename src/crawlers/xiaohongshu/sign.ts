import { parse } from 'url';
import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';

// Load the JavaScript files from local directory
const xhsXsXscPath = path.resolve(__dirname, './utils/xhs_xs_xsc_56.js');
const xhsXrayPath = path.resolve(__dirname, './utils/xhs_xray.js');
const xhsXrayPack1Path = path.resolve(__dirname, './utils/xhs_xray_pack1.js');
const xhsXrayPack2Path = path.resolve(__dirname, './utils/xhs_xray_pack2.js');

let xhsXsXscJs: string;
let xhsXrayJs: string;
let xhsXrayPack1Js: string;
let xhsXrayPack2Js: string;

try {
  xhsXsXscJs = fs.readFileSync(xhsXsXscPath, 'utf-8');
  xhsXrayJs = fs.readFileSync(xhsXrayPath, 'utf-8');
  xhsXrayPack1Js = fs.readFileSync(xhsXrayPack1Path, 'utf-8');
  xhsXrayPack2Js = fs.readFileSync(xhsXrayPack2Path, 'utf-8');
} catch (error) {
  console.error('Failed to load JavaScript files:', error);
  throw error;
}

// Create browser-like global objects
const browserGlobals = {
  window: {
    navigator: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
      language: 'zh-CN',
      languages: ['zh-CN', 'zh', 'en'],
      platform: 'Win32',
      vendor: 'Google Inc.',
    },
    location: {
      href: 'https://www.xiaohongshu.com',
      origin: 'https://www.xiaohongshu.com',
      protocol: 'https:',
      host: 'www.xiaohongshu.com',
      hostname: 'www.xiaohongshu.com',
      pathname: '/',
      search: '',
      hash: '',
    },
    document: {
      cookie: '',
      referrer: 'https://www.xiaohongshu.com',
    },
    localStorage: new Map(),
    sessionStorage: new Map(),
    performance: {
      now: () => Date.now(),
      timeOrigin: Date.now(),
    },
    Date: Date,
    Math: Math,
    JSON: JSON,
    console: {
      log: (...args: any[]) => console.log(...args),
      error: (...args: any[]) => console.error(...args),
      warn: (...args: any[]) => console.warn(...args),
      info: (...args: any[]) => console.info(...args),
    },
  },
  navigator: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
    language: 'zh-CN',
    languages: ['zh-CN', 'zh', 'en'],
    platform: 'Win32',
    vendor: 'Google Inc.',
  },
  document: {
    cookie: '',
    referrer: 'https://www.xiaohongshu.com',
  },
  location: {
    href: 'https://www.xiaohongshu.com',
    origin: 'https://www.xiaohongshu.com',
    protocol: 'https:',
    host: 'www.xiaohongshu.com',
    hostname: 'www.xiaohongshu.com',
    pathname: '/',
    search: '',
    hash: '',
  },
  localStorage: new Map(),
  sessionStorage: new Map(),
  performance: {
    now: () => Date.now(),
    timeOrigin: Date.now(),
  },
};

// Create a function to execute code in the VM context
async function executeInVMContext(code: string, functionName: string, ...args: any[]): Promise<any> {
  try {
    // Create a custom require function that returns the appropriate module
    const customRequire = (modulePath: string) => {
      if (modulePath === './xhs_xray_pack1.js') {
        return xhsXrayPack1Js;
      }
      if (modulePath === './xhs_xray_pack2.js') {
        return xhsXrayPack2Js;
      }
      throw new Error(`Module not found: ${modulePath}`);
    };

    const context = vm.createContext({
      ...browserGlobals,
      global: browserGlobals,
      window: browserGlobals.window,
      require: customRequire,
    });

    // First run the main code
    const script = new vm.Script(code);
    script.runInContext(context, { timeout: 5000 });

    // Then run the function
    const result = vm.runInContext(`${functionName}(${args.map(arg => JSON.stringify(arg)).join(',')})`, context, { timeout: 5000 });
    return result;
  } catch (error) {
    console.error(`Error executing ${functionName}:`, error);
    throw error;
  }
}

export function generateXb3TraceId(length: number = 16): string {
  const chars = 'abcdef0123456789';
  let traceId = '';
  for (let i = 0; i < length; i++) {
    traceId += chars[Math.floor(Math.random() * 16)];
  }
  return traceId;
}

export async function generateXrayTraceId(): Promise<string> {
  try {
    const result = await executeInVMContext(xhsXrayJs, 'traceId');
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

export async function generateXsXsCommon(a1: string, api: string, data: string = ''): Promise<{ xs: string; xt: string; xs_common: string }> {
  try {
    const result = await executeInVMContext(
      xhsXsXscJs,
      'get_request_headers_params',
      api,
      data,
      a1
    );
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

export async function generateRequestParams(cookies: string, api: string, data: any = ''): Promise<{
  headers: Record<string, string>;
  cookies: Record<string, string>;
  data: string;
}> {
  const parsedCookies = parseCookies(cookies);
  const a1 = parsedCookies['a1'] || '';
  
  // Generate headers
  const headers = getRequestHeadersTemplate();
  headers['x-b3-traceid'] = generateXb3TraceId();
  headers['x-xray-traceid'] = await generateXrayTraceId();
  
  // Generate X-s, X-t, and X-s-common using the actual JavaScript implementation
  const { xs, xt, xs_common } = await generateXsXsCommon(a1, api, typeof data === 'object' ? JSON.stringify(data) : data);
  headers['x-s'] = xs;
  headers['x-t'] = xt;
  headers['x-s-common'] = xs_common;
  
  // Convert data to JSON string if it's an object
  const processedData = typeof data === 'object' ? JSON.stringify(data, null, 0) : data;
  
  return { headers, cookies: parsedCookies, data: processedData };
} 