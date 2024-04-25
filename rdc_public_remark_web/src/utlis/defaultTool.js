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

//瀑布流式响应布局函数
//创建笔记盒子
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

//计算间距与列数函数
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

//渲染以及定位函数
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