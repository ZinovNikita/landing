
import { WebSocketServer } from 'ws'

console.log2 = function (...args) { this.log(new Date().toLocaleString(), ...args) }
console.error2 = function (...args) { this.error(new Date().toLocaleString(), ...args) }

const wsServer = new WebSocketServer({ port: 3001 }),
  isHash = s => typeof s === 'string' && s.length === 8 && !isNaN(parseInt(s, 36))

wsServer.uniqId = function () {
  let hash
  do {
    hash = Math.floor(new Date().getTime() * 1000 * (Math.random() + 0.001)).toString(36).substring(0,8)
  } while (Array.from(this.clients).find(u => u.user_hash === hash || u.room_hash === hash))
  return hash
}

wsServer.hasRoom = function (room_hash) {
  return Array.from(this.clients).filter(ws => ws.room_hash === room_hash).length > 0
}

wsServer.sendMessage = function (action, room_hash, user_hash, data) {
  if (isHash(room_hash)) {
    this.clients.forEach(ws => {
      if (isHash(ws.room_hash) && ws.room_hash === room_hash)
        ws.send(JSON.stringify({action, room_hash, user_hash, data}))
    })
  }
  else if (isHash(user_hash)) {
    const u = [...this.clients].find(ws => isHash(ws.user_hash) && ws.user_hash === user_hash)
    u && u.send(JSON.stringify({action, room_hash, user_hash, data}))
  }
}

wsServer.on("error", console.error2)

wsServer.on('connection', ws => {
  ws.user_hash = wsServer.uniqId()
  ws.message_count = 0
  ws.interval = setInterval(() => ws.message_count = 0, 1000)
  console.log2(`${ws.user_hash} connected`)

  ws.on("error", console.error2)

  ws.on('close', () => {
    if (isHash(ws.room_hash)) {
      console.log2(`${ws.user_hash} left room ${ws.room_hash}`)
      wsServer.sendMessage('left', ws.room_hash, ws.user_hash)
    }
    ws.room_hash = undefined
    clearInterval(ws.interval)
    wsServer.clients.delete(ws)
  })

  ws.on('message', (msg) => {
    const { action, data } = JSON.parse(msg)
    try {
      if (ws.message_count >= 1000)
        throw new Error('message limit exceeded')
      ws.message_count++
      if (action === 'create' || action === 'enter') {
        let hash = ''
        if(action === 'create')
          hash = wsServer.uniqId()
        else if (action === 'enter' && isHash(data) && wsServer.hasRoom(data))
          hash = data
        else
          throw new Error(`room ${data} not found`)

        if (!isHash(hash))
          throw new Error(`room ${hash} not found`)

        if (ws.room_hash !== hash) {
          if (isHash(ws.room_hash)) {
            wsServer.sendMessage('left', ws.room_hash, ws.user_hash)
            console.log2(`${ws.user_hash} left room ${ws.room_hash}`)
          }
          ws.room_hash = hash
          wsServer.sendMessage(`${action}.then`, ws.room_hash, ws.user_hash)
          console.log2(`${ws.user_hash} entered room ${ws.room_hash}`)
        }
      }
      else if(typeof action === 'string' && action.length > 0)
        wsServer.sendMessage(action, ws.room_hash, ws.user_hash, data)
      else
        throw new Error('wrong message params')
    }
    catch (e) {
      console.error2(e)
      if(typeof action === 'string' && action.length > 0)
        wsServer.sendMessage(`${action}.catch`, undefined, ws.user_hash, e.message)
    }
  })
})

console.log2(`server start on ${wsServer.options.port} port`)
