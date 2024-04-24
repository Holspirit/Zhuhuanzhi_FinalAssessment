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