window.onload = function () {
    if (localStorage.getItem('token')) {
        document.querySelector('.dzdp_login').style.display = 'none'
        document.querySelector('.dzdp_mainPage').style.display = 'flex'
        setPosition()
        document.querySelector('.dzdp_Page_bottom').style.display = 'flex'
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
                document.querySelector('.dzdp_login').style.left = '0'
                document.querySelector('.dzdp_mainPage').style.display = 'flex'
                document.querySelector('.dzdp_Page_bottom').style.display = 'flex'
                setPosition()
            }, 2600)

            localStorage.setItem('token', result.data.token)
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


// 调用tab栏切换函数
tabToggle(document.querySelectorAll('.dzdp_mainPage_headTab'), 'header_tab_active')

tabToggle(document.querySelectorAll('.dzdp_mainPage_content_tab .tab_choice'), 'content_tab_active')

tabToggle(document.querySelectorAll('.dzdp_mainPage_bottomTab .tab_choice'), 'bottom_tab_active')

tabToggle(document.querySelectorAll('.dzdp_personPage_myRecord_head li'), 'recordHead_active')


//瀑布流式布局
const waterFall = document.querySelector('.dzdp_mainPage_noteShow')
let noteBoxWidth = 150

creatNoteBox()

let timerId = null
window.onresize = function () {
    if (timerId) {
        clearTimeout(timerId)
    }
    timerId = setTimeout(setPosition, 300)
}

//实现搜索界面与主界面的切换
document.querySelector('.dzdp_mainPage_searchBox').addEventListener('focus', () => {
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
        <img class="mainPage_backToTop" src="/static/icon/back_to_top.svg" alt="" style="width: 70%; object-fit: cover; object-position: center; border-radius: 15px;">
        `
        theFirstTab_bottom.addEventListener('click', () => {
            document.documentElement.scrollTop = 0
        })
    } else {
        document.querySelector('.dzdp_mainPage_bottomTab .tab_choice:nth-child(1)').innerHTML = '推荐'
    }  
})

//大页面切换
for (let i = 0; i < 5; i++) {
    document.querySelectorAll('.dzdp_mainPage_bottomTab .bottom_tab')[i].addEventListener('click', () => {
        document.querySelectorAll('.innerPage')[i].style.display = 'flex'
        document.querySelector('.dzdp_mainPage_bottomTab .bottom_tab:nth-child(1)').innerHTML = i === 0 ? '推荐' : '首页'
        document.querySelector('.dzdp_Page_bottom').style.display = i === 2 ?  'none' : 'flex'     
        for (let k = 0; k < 4; k++) {
            document.querySelectorAll(`.innerPage:not(.innerPage_0${i + 1})`)[k].style.display = 'none'
        }
    })
}

//从发表笔记页面返回之前的页面（即返回点进发表笔记页面前的页面）
document.querySelector('#backIcon_01').addEventListener('click', e => {
    if (e.target.tagName === 'IMG') {
        document.querySelector('.dzdp_notePublish').style.display = 'none'
        for (let i = 0; i < 4; i++) {
            for (let k = 0; k < document.querySelectorAll('.dzdp_mainPage_bottomTab .tab_choice')[i].classList.length; k++) {
                if (document.querySelectorAll('.dzdp_mainPage_bottomTab .tab_choice')[i].classList[k] === 'bottom_tab_active') {
                    if (i < 2) {
                        document.querySelector('.dzdp_mainPage_bottomTab .bottom_tab:nth-child(1)').innerHTML = i === 0 ? '推荐' : '首页'
                        document.querySelector(`.innerPage_0${i + 1}`).style.display = 'flex'
                    } else {
                        document.querySelector(`.innerPage_0${i + 2}`).style.display = 'flex'
                    }      
                }
            }
        }
        document.querySelector('.dzdp_Page_bottom').style.display = 'flex'
    }
})

//编辑资料页面与我的页面来回切换
document.querySelector('.personPage_personMessage_edit').addEventListener('click', () => {
    setTimeout(() => {
        document.querySelector('.dzdp_personPage').style.display = 'none'
        document.querySelector('.dzdp_Page_bottom').style.display = 'none'
        document.querySelector('.dzdp_personEditPage').style.display = 'flex'
    }, 200)
})

document.querySelector('#backIcon_02').addEventListener('click', () => {
    setTimeout(() => {
        document.querySelector('.dzdp_personPage').style.display = 'flex'
        document.querySelector('.dzdp_Page_bottom').style.display = 'flex'
        document.querySelector('.dzdp_personEditPage').style.display = 'none'
    }, 200)
})

document.querySelector('#backIcon_03').addEventListener('click', () => {
    setTimeout(() => {
        document.querySelector('.dzdp_personEditPage_uname').style.display = 'none'
        document.querySelector('.dzdp_personEditPage').style.display = 'flex'
        document.body.style.backgroundColor = 'white'
    }, 200)
})

//编辑个人对应资料
for (let i = 0; i < 7; i++) {
    document.querySelectorAll('.dzdp_personEditPage_edition>.editPart')[i].addEventListener('click', e => {
        if (e.target.tagName === 'LI') {
            e.target.style.backgroundColor = 'rgb(241, 241, 241)'
            setInterval(() => {
                e.target.style.backgroundColor = 'white'
            }, 150);
        }  
        switch (i) {
            case 0:
                console.log(0);
                break;
            case 1:
                console.log(1);
                break;
            case 2:
                document.querySelector('.dzdp_personEditPage').style.left = '-5000px'
                setTimeout(() => {
                    document.querySelector('.dzdp_personEditPage').style.display = 'none'
                    document.querySelector('.dzdp_personEditPage').style.left = '0'
                    document.querySelector('.dzdp_personEditPage_uname').style.display = 'flex'
                    document.body.style.backgroundColor = 'rgb(241, 241, 241)'
                }, 500);
                break;
            case 3:
                console.log(3);
                break;
            case 4:
                console.log(4);
                break;
            case 5:
                console.log(5);
                break;
            case 6:
                console.log(6);
                break;
            default:
                break;
        }
    })
}

setPosition()