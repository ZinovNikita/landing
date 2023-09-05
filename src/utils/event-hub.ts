const funcs: Record<string,Function> = {}
class EventHub {
  static instance: any
  static Init () {
    if (!EventHub.instance)
      EventHub.instance = new EventHub()
    return EventHub.instance
  }
  on (type: string, callback: Function) {
    funcs[type] = callback
  }
  emit (type: string, ...params: any) {
    return new Promise((resolve)=>{
      try {
        if (typeof funcs[type] !== 'function')
          throw new Error('listener is not a function')
        const result = funcs[type](...params)
        resolve(result)
      }
      catch (e) {
        console.error(e)
        resolve(undefined)
      }
    })
  }
  remove (type: string) {
    delete funcs[type]
  }
}
export default EventHub.Init
