import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = parseInt(process.env.PORT || '3000', 10)

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

function resolveFilePath(urlPath) {
  let reqPath = decodeURI(urlPath.split('?')[0])
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html'

  // 1. Check in root directory
  let filePath = path.join(__dirname, reqPath)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath
  }

  // 2. Check in public directory
  let publicPath = path.join(__dirname, 'public', reqPath)
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    return publicPath
  }

  // 3. Try appending .html in root
  if (fs.existsSync(filePath + '.html') && fs.statSync(filePath + '.html').isFile()) {
    return filePath + '.html'
  }

  // 4. Try appending .html in public
  if (fs.existsSync(publicPath + '.html') && fs.statSync(publicPath + '.html').isFile()) {
    return publicPath + '.html'
  }

  // 5. Try directory index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    let indexHtml = path.join(filePath, 'index.html')
    if (fs.existsSync(indexHtml)) return indexHtml
  }

  return null
}

const server = http.createServer((req, res) => {
  const filePath = resolveFilePath(req.url)

  if (!filePath) {
    const notFoundPath = resolveFilePath('/404.html') || resolveFilePath('/index.html')
    if (notFoundPath) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
      fs.createReadStream(notFoundPath).pipe(res)
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('404 Not Found')
    }
    return
  }

  const ext = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache',
  })
  fs.createReadStream(filePath).pipe(res)
})

server.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`)
})
