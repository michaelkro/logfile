![logfile-white](https://github.com/user-attachments/assets/eb1922ba-eea8-4609-bf43-d083cee8864e) 
<svg width="46px" height="46px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
<!-- White background rectangle -->
<rect width="16" height="16" fill="white"/>
<g fill="#000000">
<path d="M5.314 1.256a.75.75 0 01-.07 1.058L3.889 3.5l1.355 1.186a.75.75 0 11-.988 1.128l-2-1.75a.75.75 0 010-1.128l2-1.75a.75.75 0 011.058.07zM7.186 1.256a.75.75 0 00.07 1.058L8.611 3.5 7.256 4.686a.75.75 0 10.988 1.128l2-1.75a.75.75 0 000-1.128l-2-1.75a.75.75 0 00-1.058.07zM2.75 7.5a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H2.75zM2 11.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2.75 13.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"/>
</g>
</svg>

# logfile
A convenient and performant tool for viewing your NDJSON (new line delimited JSON) log files!

## Getting started
1. Install dependencies and start development sever
```bash
npm i
npm run dev
```
2. Visit [http://localhost:5173/](http://localhost:5173/) and enter a web URL to your log file.
```
https://log-server.com/your-logs.log
```
3. Click on an individual row to see an expanded view.

## Log file format: `NDJSON` (new line delimited JSON)

The parser for `logfile` expects that your log file will adhere to the following conventions:
1. Each JSON text must end with a newline character `\n`. The newline character may be preceded by a carriage return `\r`
2. Each JSON text must have a `_time` property containing a unix timestamp

### Example

```
{"_time":1724323612592,"cid":"api","channel":"conf:policies","level":"info","message":"loading policy","context":"cribl","policy":{"args":["groupName","macroId"],"template":["GET /m/${groupName}/search/macros/${macroId}","GET /m/${groupName}/search/macros/${macroId}/*"],"description":"Members with this policy can view and use the macro","title":"Read Only"}}
{"_time":1724323576596,"cid":"api","channel":"ShutdownMgr","level":"info","message":"Shutdown:CB:Complete","name":"ServiceRpcMgr.master"}
```

## Configuration
There are a couple knobs you can use to suit your needs.

1. You can change the max download size. The default is 20MB. https://github.com/michaelkro/logfile/blob/c6e6f8d419ebb92ac8d1e1680ab457ee30964b03/src/hooks/use-stream-log-file.tsx/constants.ts#L6

## Notes
This application is able to render large data sets in a performant manner by using **virtualized rendering**.

![scroll](https://github.com/user-attachments/assets/a2e01cc0-8dce-4dd7-bfc3-195767f3c583)
