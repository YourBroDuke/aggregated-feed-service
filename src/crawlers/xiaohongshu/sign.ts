import { parse } from 'url';
import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';

// Load the JavaScript files from local directory
const xhsXsXscPath = path.resolve(__dirname, './utils/xhs_xs_xsc_56.js');
const xhsXrayPath = path.resolve(__dirname, './utils/xhs_xray.js');

let xhsXsXscJs: string;
let xhsXrayJs: string;

try {
  xhsXsXscJs = fs.readFileSync(xhsXsXscPath, 'utf-8');
  xhsXrayJs = fs.readFileSync(xhsXrayPath, 'utf-8');
} catch (error) {
  console.error('Failed to load JavaScript files:', error);
  throw error;
}

// Create a function to execute code in the VM context
async function executeInVMContext(code: string, functionName: string, ...args: any[]): Promise<any> {
  try {
    const context = vm.createContext({
      global: {},
      self: {},
      window: {},
      Math: Math,
      Date: Date,
      console: console,
      JSON: JSON,
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      setInterval: setInterval,
      clearInterval: clearInterval,
      Buffer: Buffer,
      process: process,
      Error: Error,
      RegExp: RegExp,
      String: String,
      Number: Number,
      Boolean: Boolean,
      Array: Array,
      Object: Object,
      Function: Function,
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite,
      decodeURI: decodeURI,
      decodeURIComponent: decodeURIComponent,
      encodeURI: encodeURI,
      encodeURIComponent: encodeURIComponent,
      escape: escape,
      unescape: unescape,
      eval: eval,
      Infinity: Infinity,
      NaN: NaN,
      undefined: undefined,
      require: (moduleName: string) => {
        const modulePath = path.resolve(__dirname, './utils', moduleName);
        const moduleContent = fs.readFileSync(modulePath, 'utf-8');
        const moduleContext = vm.createContext({
          ...context,
          module: { exports: {} },
          exports: {},
          require: context.require
        });
        vm.runInContext(moduleContent, moduleContext);
        return moduleContext.module.exports;
      }
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