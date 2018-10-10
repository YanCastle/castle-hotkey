import hotkey from 'hotkeys-js'
import { EventEmitter } from 'eventemitter3';
export default new class Hotkey extends EventEmitter {
    /**
     * 已监听数组
     */
    protected listenedKeys: {
        [index: string]: {
            [index: string]: (event: any, handler: any) => void
        }
    } = {}
    /**
     * 直接拒绝的事件
     */
    protected denied: string[] = []
    deny(key: string) {
        let keys = key.split(',')
        for (let i = 0; i < keys.length; i++) {
            let keyt = keys[i];
            if (!this.listenedKeys[keyt]) {
                this.listenedKeys[keyt] = {}
                hotkey(keyt, (event, handler) => {
                    this.handle(event, handler)
                })
            }
            if (!this.denied[keyt]) { this.denied.push(keyt) }
        }
    }
    /**
     * 移除拒绝事件
     * @param key 
     */
    removeDeny(key: string) {
        let keys = key.split(',')
        for (let i = 0; i < keys.length; i++) {
            let index = this.denied.indexOf(keys[i])
            if (index > -1) {
                this.denied.splice(index, 1)
            }
        }
    }
    /**
     * 处理回调
     * @param event 
     * @param handler 
     */
    protected handle(event: any, handler: any) {
        if (this.listenedKeys[handler.key]) {
            Object.keys(this.listenedKeys[handler.key]).forEach((name: string) => {
                if (this.listenedKeys[handler.key][name] instanceof Function)
                    this.listenedKeys[handler.key][name](event, handler)
                else {
                    delete this.listenedKeys[handler.key][name]
                }
            })
        }
        if (this.denied.indexOf(handler.key) > -1) { return false; } else { event.preventDefault(); return true; }
    }
    /**
     * 监听键盘事件
     * @param key 
     * @param name 
     * @param cb 
     */
    listen(key: string, name: string, cb: (event: any, handler: any) => any) {
        if (cb instanceof Function) {
            let keys = key.split(',')
            for (let i = 0; i < keys.length; i++) {
                let keyt = keys[i];
                if (!this.listenedKeys[keyt]) {
                    this.listenedKeys[keyt] = {}
                    hotkey(keyt, (event, handler) => {
                        return this.handle(event, handler)
                    })
                }
                this.listenedKeys[keyt][name] = cb
            }
        }
    }
    /**
     * 移除该键盘事件所有监听
     * @param key 
     */
    removeAll(key: string) {
        let keys = key.split(',')
        for (let i = 0; i < keys.length; i++) {
            let keyt = keys[i];
            Object.keys(this.listenedKeys[keyt]).forEach((d: string) => {
                delete this.listenedKeys[keyt][d]
            })
        }
    }
    /**
     * 移除键盘监听
     * @param key 
     */
    unlisten(key: string, name: string) {
        let keys = key.split(',')
        for (let i = 0; i < keys.length; i++) {
            let keyt = keys[i];
            if (this.listenedKeys[keyt] && this.listenedKeys[keyt][name]) {
                delete this.listenedKeys[keyt][name]
            }
        }
    }

}