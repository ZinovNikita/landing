const websocket_host = localStorage.getItem('websocket_host') || 'ws://localhost:3001'

class WSClass {
  static ws: WebSocket
  static instance: WSClass
  static Init () {
    return new Promise<WSClass>(resolve => {
      if (!WSClass.instance) {
        WSClass.instance = new WSClass()
        WSClass.ws = new WebSocket(websocket_host)
        WSClass.ws.addEventListener('error', console.error)
        WSClass.ws.addEventListener('open', () => {
          resolve(WSClass.instance)
        })
      }
      else
        resolve(WSClass.instance)
    })
  }
  constructor () {
  }
  public get ws() {
    return WSClass.ws
  }
  public send(action: string, data?: any): void{
    this.ws.send(JSON.stringify({action, data}))
  }
  public sendPromise(act: string, data?: any): Promise<any> {
    this.send(act, data)
    return new Promise((resolve, reject) => {
      let timeout: NodeJS.Timeout;
      const ls = (e: MessageEvent<any>) => {
        const {action, ...data} = JSON.parse(e.data)
        if (action === `${act}.then`){
          resolve(data)
          this.ws.removeEventListener('message', ls)
          clearTimeout(timeout)
        }
        else if (action === `${act}.catch`) {
          reject(data)
          this.ws.removeEventListener('message', ls)
          clearTimeout(timeout)
        }
      }
      this.ws.addEventListener('message', ls)
      timeout = setTimeout(() => {
        this.ws.removeEventListener('message', ls)
        reject(new Error(`ws ${act} answer timeout`))
        clearTimeout(timeout)
      }, 10000)
    })
  }
}

export type { WSClass }
export default WSClass.Init
