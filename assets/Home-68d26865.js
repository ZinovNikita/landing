import{d as i,r as d,u as f,o as g,c as h,w as l,a as u,b as a,e as _}from"./index-125f7831.js";const C=i({__name:"Home",setup(b){const n=d(localStorage.getItem("room_hash")),o=d(localStorage.getItem("user_hash")),v=f(),s=(r,e="new")=>{if(e.length===0)return alert("Укажите комнату");localStorage.setItem("room_hash",e),localStorage.setItem("user_hash",r),v.push({path:`/landing/rooms/${e}`})};return(r,e)=>{const p=u("a-input"),m=u("a-button"),c=u("a-input-group");return g(),h(c,{compact:""},{default:l(()=>[a(p,{"addon-before":"Комната",value:n.value,"onUpdate:value":e[0]||(e[0]=t=>n.value=t),style:{width:"20%"}},null,8,["value"]),a(p,{"addon-before":"Пользователь",value:o.value,"onUpdate:value":e[1]||(e[1]=t=>o.value=t),style:{width:"20%"}},null,8,["value"]),a(m,{type:"primary",onClick:e[2]||(e[2]=t=>s(o.value||"",n.value||""))},{default:l(()=>[_("Войти")]),_:1}),a(m,{onClick:e[3]||(e[3]=t=>s(o.value||""))},{default:l(()=>[_("Создать новую комнату")]),_:1})]),_:1})}}});export{C as default};
