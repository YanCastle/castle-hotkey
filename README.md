封装hotkeys-js为我所用

```
import hotkey from 'castle-hotkey'
//添加监听
hotkey.listen('ctrl+a','用户全选',(event,handler)=>{
    //<!-- do what you want -->
})
//移除监听
hotkey.unlisten('ctrl+a','用户全选')
//移除所有
hotkey.removeAll()
//添加键盘事件到禁用列表中
hotkey.deny('f5')
//移除禁用列表
hotkey.removeDeny('f5')
```