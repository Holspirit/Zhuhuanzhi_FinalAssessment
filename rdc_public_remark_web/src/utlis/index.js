//封装简易axios函数
function myAxios (config) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        if(config.params) {
            const paramsObj = new URLSearchParams(config.params)
            const queryString = paramsObj.toString()
            config.url += `?${queryString}`
        }

        xhr.open(config.method || 'GET', config.url)
        xhr.addEventListener('loadend', () => {
            if (xhr.status = 200) {
                resolve(JSON.parse(xhr.response))
            } else {
                reject(new Error(xhr.response))
            }
        })

        if(config.data) {
            const jsonStr = JSON.stringify(config.data)
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(jsonStr)
        } else {
            xhr.send()
        }

    })
}

//封装提示框显示函数
function alertTip (inner, judge) {
    document.querySelector('.dzdp_login_tip').style.opacity = '1'
    document.querySelector('.dzdp_login_tip').innerHTML = inner

    if (!judge) {
        document.querySelector('.dzdp_login_tip').style.backgroundColor = 'rgba(250, 0, 0, 0.5)'
        setTimeout(() => {
            document.querySelector('.dzdp_login_tip').style.opacity = '0'
        }, 2000)
        return
    }
    document.querySelector('.dzdp_login_tip').style.backgroundColor = 'rgb(14, 232, 14, 0.5)'
    setTimeout(() => {
        document.querySelector('.dzdp_login_tip').style.opacity = '0'
    }, 2000)
}

//封装tab栏切换函数
function tabToggle (arr, className_active) {
    for (let i = 0; i < arr.length; i++) {
       arr[i].addEventListener('click', e => {
        if (e.target.tagName === 'LI' || e.target.tagName ==='H2') {
            const flag = document.querySelector('.' + className_active)
            if(flag) {
                document.querySelector('.' + className_active).classList.remove(className_active)
            }
            e.target.classList.add(className_active)
        }
       })
    }
}


//获取登录按钮 赋予点击事件 登录
document.querySelector('.dzdp_log').addEventListener('click', e => {
    e.preventDefault()
    const account = document.querySelector('.account').value
    const password = document.querySelector('.password').value

    myAxios({
        url: 'http://8.134.148.60:4000/user/login',
        method: 'POST',
        data: {
            account,
            password
        }
    }).then(result => {
        if(account.length < 4) {
            alertTip('用户名长度应大于或等于4', false)
            return
        }

        if(password.length <3) {
            alertTip('密码长度应大于或等于3', false)
            return
        }

       if(!document.querySelector('.dzdp_login_attention_confirm').className.includes('attentionConfirm')) {
        alertTip('请先同意并勾选登录协议', false)
        return
       }

        document.querySelector('.dzdp_login_tip').innerHTML = result.msg
        if(result.msg === '登录成功') {
            alertTip(result.msg, true)
            
            setTimeout(() => {
                document.querySelector('.dzdp_login').style.left = '-1000px'
            }, 2000)

            setTimeout(() => {
                document.querySelector('.dzdp_login').style.display = 'none'
                document.querySelector('.dzdp_mainPage').style.display = 'flex'
                document.querySelector('.dzdp_Page_bottom').style.display = 'flex'
                setPosition()
            }, 2600)
        } else {
            alertTip(result.msg, false)
        }
    })
})

document.querySelector('.dzdp_login_attention_confirm').addEventListener('click', e => {
    if(e.target.tagName = 'I') {
        if(document.querySelector('.attentionConfirm')) {
            e.target.classList.remove('attentionConfirm')
            return
        }
        e.target.classList.add('attentionConfirm')
    }  
})

tabToggle(document.querySelectorAll('.dzdp_mainPage_headTab'), 'header_tab_active')

tabToggle(document.querySelectorAll('.dzdp_mainPage_content_tab .tab_choice'), 'content_tab_active')

tabToggle(document.querySelectorAll('.dzdp_mainPage_bottomTab .tab_choice'), 'bottom_tab_active')

tabToggle(document.querySelectorAll('.dzdp_personPage_myRecord_head li'), 'recordHead_active')
//瀑布流式布局


const waterFall = document.querySelector('.dzdp_mainPage_noteShow')
let noteBoxWidth = 150

function creatNoteBox () {
    for (let i = 0; i <= 20; i++) {
        const div = document.createElement('div')

        // 设置高
        div.style.height = `${Math.floor(Math.random() * 101) + 200}` + 'px'
        div.className = 'mainPage_noteBox'
        div.innerHTML = `
        <div class="dzdp_mainPage_noteImg"></div>
        <div class="dzdp_mainPage_noteText">
            <h2 class="dzdp_mainPage_noteTitle"></h2>
            <div class="dzdp_mainPage_publisher">
                <img src="" alt="" class="dzdp_mainPage_publisher_headphoto">
                <span class="dzdp_mainPage_publisher_ueserName"></span>
            </div>
        </div>
        `
        
        waterFall.appendChild(div)
    }
}

creatNoteBox()

function cal () {
    const containerWidth = waterFall.clientWidth

    const columns = Math.floor(containerWidth / noteBoxWidth)

    const spaceNumber = columns + 1

    const leftSpace = containerWidth - columns * noteBoxWidth

    const space = leftSpace / spaceNumber

    return {
        space: space,
        columns: columns
    }
}

function setPosition () {
    const info = cal()
    const nextTops = new Array(info.columns)
    nextTops.fill(0)

    for (let i = 0; i < waterFall.children.length; i++) {
        const minTop = Math.min.apply(null, nextTops)
        waterFall.children[i].style.top = minTop + 'px'
        const index = nextTops.indexOf(minTop)

        nextTops[index] += parseInt(waterFall.children[i].style.height.substring(0, 3)) + info.space

        const left = (index + 1) * info.space + index * noteBoxWidth

        waterFall.children[i].style.left = left + 'px'
    }
    const max = Math.max.apply(null, nextTops)

    waterFall.style.height = max + 'px'
}

let timerId = null
window.onresize = function () {
    if (timerId) {
        clearTimeout(timerId)
    }
    timerId = setTimeout(setPosition, 300)
}

//实现搜索界面与主界面的切换
document.querySelector('.dzdp_mainPage_searhBox').addEventListener('focus', () => {
    setTimeout( () => {
        document.querySelector('.dzdp_mainPage').style.display = 'none'
        document.body.style.backgroundColor = 'rgba(192, 183, 183, 0.13)'
        document.querySelector('.dzdp_searchPage').style.display = 'flex'
        document.querySelector('.dzdp_Page_bottom').style.display = 'none'
    }, 200)
})

document.querySelector('.searchPage_returnIcon').addEventListener('click', () => {
    setTimeout( () => {
        document.querySelector('.dzdp_searchPage').style.display = 'none'
        document.querySelector('.dzdp_mainPage').style.display = 'flex'
        setPosition()
        document.querySelector('.dzdp_Page_bottom').style.display = 'flex'
        document.body.style.backgroundColor = '#fff'
    }, 100)
})

const theFirstTab_bottom = document.querySelector('.dzdp_mainPage_bottomTab .tab_choice:nth-child(1)')
//判断滑动到某一距离时 推荐图标变为火箭 点击回到顶部
window.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop >= 150) {
        theFirstTab_bottom.innerHTML = `
        <img class="mainPage_backToTop" src="/static/icon/backToTop.svg" alt="" style="width: 70%; object-fit: cover; object-position: center; border-radius: 15px;">
        `
        theFirstTab_bottom.addEventListener('click', () => {
            document.documentElement.scrollTop = 0
        })
    } else {
        document.querySelector('.dzdp_mainPage_bottomTab .tab_choice:nth-child(1)').innerHTML = '推荐'
    }  
})

//大页面切换
for (let i = 0; i < 4; i++) {
    document.querySelectorAll('.dzdp_mainPage_bottomTab .tab_choice')[i].addEventListener('click', () => {
        document.querySelectorAll('.innerPage')[i].style.display = 'flex'
        document.querySelector('.dzdp_mainPage_bottomTab .tab_choice:nth-child(1)').innerHTML = i === 0 ? '推荐' : '首页'
        if (i === 3) {
            document.body.style.backgroundColor = 'rgba(192, 183, 183, 0.41)'
        } else {
            document.body.style.backgroundColor = 'white'
        }
        for (let k = 0; k < 3; k++) {
            document.querySelectorAll(`.innerPage:not(.innerPage_0${i + 1})`)[k].style.display = 'none'
        }
    })
}
