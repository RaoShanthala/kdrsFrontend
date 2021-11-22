import store from '../store/index'
import router from '../router/index'

//カラム作成・並べ替え関数
function createFields(obj, order) {
    let a = []
    let b = []
    for(let i in obj) { a.push( {'key': i, 'label': obj[i]} ) }
    if(order) {
        for(let i in order) { b.push(a[order[i]]) }
        return b
    }
    return a
}

function clickMenuForward(menuCurrentPath, menuForwardPath) {
    saveCommonArea('menuCurrentPathNew', menuForwardPath);
    store.dispatch('pushMenuPath', menuCurrentPath);
    router.push({path: menuForwardPath});
}

function clickMenuBack() {
    // vue からの呼び出しは、次のとおり！
    //let menuBackPath = this.$store.getters.getLastMenuPath;
    //this.$store.dispatch('popMenuPath');
    //this.$router.push({path: menuPath});
    let menuBackPath = store.getters.getLastMenuPath;
    if (menuBackPath == "/menu"){
        resetCommonArea(getCurrentMenu());
    }
    saveCommonArea('menuCurrentPathNew', menuBackPath);
    store.dispatch('popMenuPath');
    router.push({path: menuBackPath});
}

function getCurrentMenu() {
    return loadCommonArea('menuCurrentPathNew');
}

function getCurrentMenuName() {
    let menuCurrentPath = loadCommonArea('menuCurrentPathNew');
    // console.log('menuCurrentPath=' + menuCurrentPath);
    // console.log('this=' + this);                    // this=[object Object]
    // console.log('this.$router=' + this.$router);    // this.$router=undefined   <-vue内でしか取得できない!
    // console.log('this.$router.options.routes=' + this.$router.options.routes);
    // let menuCurrentName = this.$router.options.routes.find(e => e.path === menuCurrentPath).name;
    let menuInfoByPath = loadCommonArea('menuInfoByPath');
    let menuRoute = menuInfoByPath[menuCurrentPath];
    // console.log('path=' + menuCurrentPath +', name=' + menuRoute.name + ', Title=' + menuRoute.title);
    return menuRoute.name;
}

function getParentMenu() {
    return store.getters.getLastMenuPath;
}

function saveCommonArea(key, val) {
    //this.$store.dispatch('saveCommonArea', { commonKey: key, commonVal: val });
    store.dispatch('saveCommonArea', { commonKey: key, commonVal: val });
}

function loadCommonArea(key) {
    //let menuPath = this.$store.getters.loadCommonArea(commonKey);
    //console.log('menuPath=' + menuPath);
    return store.getters.loadCommonArea(key);
}

function deleteCommonArea(key) {
    //this.$store.dispatch('deleteCommonArea', commonKey);
    store.dispatch('deleteCommonArea', key);
    //menuPath = this.$store.getters.loadCommonArea(commonKey);
    //console.log('menuPath=' + menuPath);
}

function resetCommonArea(key){
 store.dispatch('resetCommonArea', key);
}

function getResponseMessage(response) {
    return response.data.resultCode + ": " + response.data.resultMessage;
}

function getErrorMessage(error) {
    if (error.response == null) {
        return error;
    } else {
        return error.response.data.status.code + ": " + error.response.data.status.message;
    }
}

function sleep(delay, iteration, callbackFunc) {
    // delay（ミリ秒） * iteration = 待機時間
    var count = 0;
    // delayミリ秒間隔で無名関数をiterationの回数実行
    var id = setInterval(function () {
        count++;
        // 経過時間（delay * count） >= 待機時間の場合、待機終了。
        if (count >= iteration) {
            // タイマー停止
            clearInterval(id);
            // 完了時、コールバック関数を実行
            if (callbackFunc) callbackFunc();
        }
    }, delay);
}

function wait(sec) {
    return new Promise((resolve) => {
        setTimeout(resolve, sec*1000);
    });
    // return new Promise((resolve, reject) => {
    //     setTimeout(resolve, sec*1000);
    //     setTimeout(() => {reject(new Error("エラー！"))}, sec*1000);
    // });
}

function getColIndex(targetField, resDtTitle) {
    let colIndex = 0;
    for(let name in resDtTitle) {
        if (name == targetField) {
            break;
        }
        colIndex++;
    }
    return colIndex;
}
// 右寄せする項目名のtargetFields配列とresDtTitleから右寄せするインデックスを格納した配列を返す。
// let targetFields = ['procColorNo', 'projCode', 'procName', 'endDate'];   // 右寄せする項目名をtargetFieldsの配列に指定する
function makeResDtIndexRight(targetFields, resDtTitle) {
    let resDtIndexRight = [];       // resDtの列を右寄せするresDtのインデックス値を格納した配列
    let resDtName2Index = {};       // 項目名からresDtTitleのインデックスを格納した連想配列
    let n = 0;
    for(let name in resDtTitle) {
        // console.log('resDtTitle[name]=' + resDtTitle[name] + ', name=' + name + ', n=' + n);
        resDtName2Index[name] = n++;
    }
    // 右寄せする項目名をtargetFields配列からresDtIndex2Layout連想配列に設定
    for(let i in targetFields) {
        // console.log('targetFields[i]=' + targetFields[i] + ', i=' + i);
        // targetFields配列の右寄せする項目名からresDtTitleのインデックスを取得する
        let index = resDtName2Index[targetFields[i]];
        // console.log('index=' + index);
        if (index != null) {
            // console.log('targetFields[i]=' + targetFields[i] + ', index=' + index);
            // 右寄せのインデックスを設定をする
            resDtIndexRight.push(index);
        }
    }
    return resDtIndexRight;
}
// // 右寄せする項目名のtargetFields配列とresDtTitleからresDtの列を左寄せ、または右寄せする値を格納した連想配列を返す。
// // let targetFields = ['procColorNo', 'projCode', 'procName', 'endDate'];   // 右寄せする項目名をtargetFieldsの配列に指定する
// function makeResDtIndex2Layout(targetFields, resDtTitle) {
//     let resDtIndex2Layout = {};     // インデックスからresDtの列を左寄せ、または右寄せする値を格納した連想配列
//     let resDtName2Index = {};       // 項目名からresDtTitleのインデックスを格納した連想配列
//     for(let i in resDtTitle) {
//         //console.log('resDtTitle[i].key=' + resDtTitle[i].key + ', i=' + i);
//         resDtName2Index[resDtTitle[i].key] = i;
//         resDtIndex2Layout[i] = 'text-left';
//     }
//     // 右寄せする項目名をtargetFields配列からresDtIndex2Layout連想配列に設定
//     for(let i in targetFields) {
//         //console.log('targetFields[i]=' + targetFields[i] + ', i=' + i);
//         // targetFields配列の右寄せする項目名からresDtTitleのインデックスを取得する
//         let index = resDtName2Index[targetFields[i]];
//         if (index != null) {
//             //console.log('filedName=' + resDtTitle[index].key + ', index=' + index);
//             // resDtIndex2Layout連想配列に右寄せの設定をする
//             resDtIndex2Layout[index] = 'text-right';
//         }
//     }
//     return resDtIndex2Layout;
// }

// 項目名をキーにしてresDtTitleのインデックスを格納した連想配列を返す。
function makeResDtName2Index(resDtTitle) {
    let resDtName2Index = {};       // 項目名からresDtTitleのインデックスを格納した連想配列
    for(let i in resDtTitle) {
        //console.log('resDtTitle[i].key=' + resDtTitle[i].key + ', i=' + i);
        resDtName2Index[resDtTitle[i].key] = i;
    }
    return resDtName2Index;
}

// インデックスをキーにしてresDtTitleの項目名を格納した連想配列を返す。
function makeResDtIndex2Name(resDtTitle) {
    let resDtIndex2Name = {};       // インデックスからresDtTitleの項目名を格納した連想配列
    for(let i in resDtTitle) {
        //console.log('resDtTitle[i].key=' + resDtTitle[i].key + ', i=' + i);
        resDtIndex2Name[i] = resDtTitle[i].key;
    }
    return resDtIndex2Name;
}

//isPrint: true=印刷前処理、false=印刷後処理
function printDesingHandler(tableName, isPrint) {
    if(isPrint) {
        if(document.getElementsByClassName(tableName).length) {                       
            let doubleHeadTable = document.getElementsByClassName(tableName)[0].children[0].children[0];
            doubleHeadTable.children[0].removeAttribute('hidden');
            doubleHeadTable.children[1].removeAttribute('hidden');
            doubleHeadTable.children[2].removeAttribute('hidden');

            //ブートストラップのテーブルラッパーとその中のテーブルを取得し、組込クラスを一旦削除
            let bTable = document.getElementsByClassName(tableName)[0];
            let table = bTable.getElementsByTagName('table')[0];
            bTable.classList.remove('table-sm', 'table-bordered', 'b-table-sticky-header', 'table-responsive');
            saveCommonArea('printTableMaxHeight', bTable.style.maxHeight);
            bTable.removeAttribute('style');
            table.classList.remove('b-table-no-border-collapse', 'table', 'b-table');
            //選択行背景色削除
            let rows = [...table.querySelectorAll('tbody>tr')];
            for(let r=0; r<rows.length; r++) {
                if (rows[r].getAttribute('aria-selected') === 'true') {
                    rows[r].classList.remove('b-table-row-selected', 'table-info');
                    saveCommonArea('printSelectedRow', r);
                    break;
                }
            }

            // カードの背景を無色
            [...document.getElementsByClassName('card')].map( element => element.classList.remove('bg-light'));
            
            //印刷用スタイル追加
            table.setAttribute('style', 'width: 100%;');
            let trStyle = 'border-bottom: 1px solid #dee2e6; border-collapse: collapse; color: black;';
            let thStyle = 'border-left: 1px solid #dee2e6; border-right: 1px solid #dee2e6; border-top: none; border-bottom: none; border-bottom-width: 1px; border-collapse: collapse; color: black; padding: .5rem;';
            let tdStyle = 'border-left: 1px solid #dee2e6; border-right: 1px solid #dee2e6; border-top: none; border-collapse: collapse; padding: .5rem;';
            let trs = table.getElementsByTagName('tr');
            [...trs].map((tr, idx) => {
                if(idx === 0) {
                    // tr.setAttribute('style', trStyle + 'border-bottom: none;');
                    tr.style.cssText += trStyle + 'border-bottom: none;';
                } else
                if(idx === 1) {
                    // tr.setAttribute('style', trStyle + 'border-top: none; border-bottom: none;');
                    tr.style.cssText += trStyle + 'border-top: none; border-bottom: none;';
                } else
                if(idx === 2) {
                    // tr.setAttribute('style', trStyle + 'border-top: none;');
                    tr.style.cssText += trStyle + 'border-top: none;';
                } else {
                    // tr.setAttribute('style', trStyle);
                    tr.style.cssText += trStyle;
                }
            });
            let ths = table.getElementsByTagName('th');
            [...ths].map((th, idx) => {
                if(idx === 0 || idx === 2) {
                    th.setAttribute('style', 'padding-top: 1rem;');
                } else
                if(idx === 1) {
                    th.setAttribute('style', 'text-align:center; font-size: 2em;');
                } else {
                    th.setAttribute('style', thStyle);
                }
            });
            let tds = table.getElementsByTagName('td');
            [...tds].map(td => td.style.cssText += tdStyle);

            // 共通エリアには線を消す対象の項目名称が入っていればそれに必要な処理を行う
            let lineDelCells = loadCommonArea('printTableLineDelCells');
            let resDtTitle = loadCommonArea('printTableResDtTitle');
            if(lineDelCells) {
                let fields = makeResDtIndexRight(lineDelCells, resDtTitle);
                let tableHead = doubleHeadTable.getElementsByTagName('tr');
                tableHead[3].style.removeProperty('border-bottom');
                [...tableHead[3].getElementsByTagName('th')].map((element, idx) => {
                    if(!fields.includes(idx)) {
                        element.style.setProperty('border-bottom', '1px solid #dee2e6');
                    }
                });
            }
        }
    } else {
        if(document.getElementsByClassName(tableName).length) {
            let doubleHeadTable = document.getElementsByClassName(tableName)[0].children[0].children[0];
            doubleHeadTable.children[0].setAttribute('hidden', '');
            doubleHeadTable.children[1].setAttribute('hidden', '');
            doubleHeadTable.children[2].setAttribute('hidden', '');
  
            // カードの背景を復元
            [...document.getElementsByClassName('card')].map( element => element.classList.add('bg-light'));
            
            //ブートストラップのテーブルラッパーとその中のテーブルを取得し、組込クラスを復元
            let bTable = document.getElementsByClassName(tableName)[0];
            let table = bTable.getElementsByTagName('table')[0];
            // bTable.classList.remove(...bTable.classList);
            // table.classList.remove(...table.classList);
            bTable.classList.add('table-sm', 'table-bordered', 'b-table-sticky-header', 'table-responsive');
            //let btableStyle = 'max-height: 200px;';
            let btableStyle = 'max-height: ' + loadCommonArea('printTableMaxHeight');
            deleteCommonArea('printTableMaxHeight');
            bTable.setAttribute('style', btableStyle);
            table.classList.add('b-table-no-border-collapse', 'table', 'b-table');
            //選択行背景色復元
            if(loadCommonArea('printSelectedRow') !== undefined) {
                [...table.querySelectorAll('tbody>tr')][loadCommonArea('printSelectedRow')].classList.add('b-table-row-selected', 'table-info');
                deleteCommonArea('printSelectedRow');
            }   

            //印刷用スタイル削除
            let trs = table.getElementsByTagName('tr');
            [...trs].map(tr => {
                let backgroundColor = tr.style.backgroundColor;
                tr.removeAttribute('style');
                tr.style.backgroundColor = backgroundColor;
            });
            let ths = table.getElementsByTagName('th');
            [...ths].map(th => th.removeAttribute('style'));
            let tds = table.getElementsByTagName('td');
            [...tds].map(td => {
                let backgroundColor = td.style.backgroundColor;
                td.removeAttribute('style');
                td.style.backgroundColor = backgroundColor;
            });
        }
    }
}

function printPrepare(tableName, colLength, title, info) {
    let doubleHeadTable = document.getElementsByClassName(tableName)[0].children[0].children[0];
    // このメソッドではtrを3個追加しているので3個以上trがあったら重複して追加しないようにする。
    if(doubleHeadTable.getElementsByTagName('tr').length > 3) {
        return;
    }

    let today = new Date(Date.now());
    let diff = today.getTimezoneOffset() * 60 * 1000;    // -540 * 60 * 1000 = -32400000 (ミリ秒)
    let localToday = new Date(today - diff).toISOString().slice(0, 10);
    let time = today.toTimeString().slice(0,8)

    //入れ子を挿入
    let text = document.createTextNode(info);
    let tr = document.createElement('tr');
    let th = document.createElement('th');

    tr.setAttribute('hidden', '');
    th.appendChild(text);
    th.setAttribute('colspan', colLength);
    tr.appendChild(th);
    doubleHeadTable.prepend(tr);

    let textTitle = document.createTextNode(title);
    let textDate = document.createTextNode(localToday + ' ' + time);
    let span = document.createElement('span');
    span.setAttribute('style', 'float:right; font-size: 14px;');

    tr = document.createElement('tr');
    th = document.createElement('th');
    tr.setAttribute('hidden', '');
    span.appendChild(textDate);
    th.appendChild(textTitle);
    th.appendChild(span);
    th.setAttribute('colspan', colLength);
    tr.appendChild(th);
    doubleHeadTable.prepend(tr);

    tr = document.createElement('tr');
    th = document.createElement('th');
    tr.setAttribute('hidden', '');
    th.setAttribute('colspan', colLength);
    tr.appendChild(th);
    doubleHeadTable.prepend(tr);
}

// セルの背景色
function progressColor(tableName, resDtTitle) {
    let screenName = getCurrentMenuName();
    let backColor = getProgressBackColorScreen(screenName);
    // console.log('screenName=' + screenName + ', backColor=' + backColor);
    if (backColor == null) {
        return;
    }
    let prodBackColor = backColor['prodBackColor'];
    let procBackColor = backColor['procBackColor'];
    // let prodBackColor = '#CCFF00';
    // let procBackColor = '#FFFF99';
    // let listProgressBackColor = [];
    let procCnt = resDtTitle.listProgress?.length;
    let table = document.querySelector(`.${tableName}>.table>tbody`);
    let rows = [...table.querySelectorAll('tr')];
    for(let i=0; i<rows.length; i++) {
        let cols = [...rows[i].querySelectorAll('td')];
        let progress = cols[cols.length-1].innerText?.slice(-5);
        if (progress !== '**-**' && progress !== '') {
            // 最終工程が完了していたら製品の完了として行の全ての列の背景色を変える
            // rows[i].style.backgroundColor = prodBackColor;
            for(let k=0; k<cols.length; k++) {
                cols[k].style.backgroundColor = prodBackColor;
            }
        } else {
            for(let j=cols.length-procCnt; j<cols.length; j++) {
                // 工程が完了していたら工程の背景色を変える
                // let progress = cols[j].innerText?.split('(')[0]?.split('/');
                progress = cols[j].innerText?.slice(-5);
                // console.log('cols[j].innerText=' + cols[j].innerText + ', progress=' + progress)
                if(progress !== '**-**' && progress !== '') {
                    // listProgressBackColor.push(j);
                    cols[j].style.backgroundColor = procBackColor;
                }
            }
        }
        // if (listProgressBackColor.length){
        //     for(let k in listProgressBackColor) {
        //         cols[listProgressBackColor[k]].style.backgroundColor = procBackColor;
        //     }
        // }
        // listProgressBackColor = [];
    }
}

// NameCollectionのResponseDtから画面名、製品の背景色、工程の背景色を取り出して、画面名をキーにした連想配列を返す。
function convertProgressBackColorScreen(resDt) {
    // console.log('convertProgressBackColorScreen(resDt)=' + resDt);
    if (resDt != null) {
        let progressBackColorScreen = {};
        for(let r in resDt) {
            // console.log('r=' + r + ', resDt[r]' + resDt[r]);
            let row = resDt[r];
            // for(let c in row) {
            //     console.log('c=' + c + ', row[c]' + row[c]);
            // }
            // console.log('nameAlpha=' + row['nameAlpha'] + ', nameShort=' + row['nameShort'] + ', nameLong=' + row['nameLong']);
            let nameScreen = row['nameAlpha'];  // 画面名
            let prodBackColor, procBackColor;
            let values = row['nameLong'].split(',');
            for (let value in values) {
                // console.log('value=' + value + ',values[value]=' + values[value]);
                let vals = values[value].trim().split('=');
                if (vals[0].trim() == 'prodBackColor')  {
                    prodBackColor = vals[1].trim();             //製品の背景色
                } else if (vals[0].trim() == 'procBackColor')  {
                    procBackColor = vals[1].trim();             //工程の背景色
                }
            }
            // console.log('nameScreen=' + nameScreen + ', prodBackColor=' + prodBackColor + ', procBackColor=' + procBackColor);
            progressBackColorScreen[nameScreen] = {'prodBackColor': prodBackColor, 'procBackColor': procBackColor};
        }
        return progressBackColorScreen;
    }
}

// 共通領域から画面名で背景色を取得
function getProgressBackColorScreen(nameScreen) {
    let progressBackColorScreen = loadCommonArea('progressBackColorScreen');
    // console.log('progressBackColorScreen=' + progressBackColorScreen);
    if (progressBackColorScreen == null) {
        return;
    }
    let backColor = progressBackColorScreen[nameScreen];
    // console.log('backColor=' + backColor);
    if (backColor == null) {
        return;
    }
    // console.log('nameScreen=' + nameScreen + ', prodBackColor=' + backColor['prodBackColor'] + ', prodBackColor=' + backColor['prodBackColor']);
    return backColor;
}

export default {
    createFields, clickMenuForward, clickMenuBack,
    saveCommonArea, loadCommonArea, deleteCommonArea,resetCommonArea,
    getResponseMessage, getErrorMessage, sleep, wait,
    getCurrentMenu, getCurrentMenuName, getParentMenu, getColIndex,
    makeResDtIndexRight, makeResDtName2Index, makeResDtIndex2Name,
    printDesingHandler, printPrepare, progressColor,
    convertProgressBackColorScreen, getProgressBackColorScreen,
}